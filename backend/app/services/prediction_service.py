import numpy as np
import uuid
import tensorflow as tf
from .image_processor import ImageProcessor
from .freshness_scorer import calculate_freshness_score, determine_grade
from .shelf_life_predictor import estimate_shelf_life
from .gradcam_generator import generate_gradcam, overlay_heatmap
import datetime
import os

class PredictionService:
    def __init__(self, model_path=None):
        self.model_path = model_path
        self.classes = ['fresh', 'rotten', 'formalin']
        
        self.model = None
        if self.model_path:
            abs_path = os.path.abspath(self.model_path)
            print(f"DEBUG: Checking for model at relative: {self.model_path}, absolute: {abs_path}")
            print(f"DEBUG: Path exists? {os.path.exists(self.model_path)}")
            if os.path.exists(self.model_path):
                print(f"DEBUG: File size: {os.path.getsize(self.model_path)} bytes")
                
                # Monkey patch Keras Layer to ignore 'quantization_config' which causes ValueError
                # in mismatched Keras minor versions when loading the model.
                import keras
                original_layer_init = keras.layers.Layer.__init__
                def patched_layer_init(self, *args, **kwargs):
                    kwargs.pop('quantization_config', None)
                    original_layer_init(self, *args, **kwargs)
                keras.layers.Layer.__init__ = patched_layer_init

                try:
                    print(f"Loading model from {self.model_path}...")
                    self.model = tf.keras.models.load_model(self.model_path, compile=False)
                    print("Model loaded successfully.")
                except Exception as e:
                    import traceback
                    print(f"Error loading TF model: {e}")
                    traceback.print_exc()

            else:
                # Let's see what is inside ./models/trained/ if it exists
                dir_path = os.path.dirname(self.model_path)
                print(f"DEBUG: Directory {dir_path} exists? {os.path.exists(dir_path)}")
                if os.path.exists(dir_path):
                    print(f"DEBUG: Contents of {dir_path}: {os.listdir(dir_path)}")
        self.processor = ImageProcessor()
        
    def predict(self, file_stream, include_gradcam=False, include_shelf_life=False, fruit_type='apple'):
        # Validate & process
        if not self.processor.validate_image(file_stream):
            raise ValueError("Invalid image file format or corrupted file.")
            
        file_stream.seek(0)
        img_array = self.processor.preprocess_image(file_stream)
        
        # Mock prediction logic if model isn't loaded - fail in production
        if self.model is None:
            raise RuntimeError(
                "Model not loaded. Check MODEL_PATH config and that the .keras file exists."
            )
        
        # Multi-head output architecture: [classification_head, freshness_head]
        preds = self.model.predict(img_array)
        class_preds = preds[0][0]
        reg_preds = preds[1][0]
        
        pred_idx = np.argmax(class_preds)
        pred_class = self.classes[pred_idx]
        probabilities = {
            'fresh': float(class_preds[0]),
            'rotten': float(class_preds[1]),
            'formalin': float(class_preds[2])
        }
        confidence = probabilities[pred_class]
        freshness_score = max(0.0, min(100.0, float(reg_preds[0]) * 100.0)) # Get scalar score out of 100
        freshness_score = round(freshness_score, 1)
        grade = determine_grade(freshness_score)
        
        # Build Response
        response = {
            "prediction": {
                "class": pred_class,
                "confidence": confidence,
                "freshness_score": freshness_score,
                "grade": grade,
                "probabilities": probabilities
            },
            "safety": {
                "formalin_detected": (pred_class == 'formalin' or probabilities['formalin'] > 0.15),
                "confidence": probabilities['formalin'],
                "safe_for_consumption": (pred_class != 'formalin' and pred_class != 'rotten' and probabilities['formalin'] <= 0.15)
            },
            "metadata": {
                "fruit_type": fruit_type,
                "prediction_id": str(uuid.uuid4()),
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
                "model_version": "v1.0.0"
            }
        }
        
        if include_shelf_life:
            response["shelf_life"] = estimate_shelf_life(fruit_type, freshness_score, pred_class)
            
        if include_gradcam:
            heatmap = generate_gradcam(self.model, img_array, pred_idx)
            overlay = overlay_heatmap(img_array, heatmap)
            response["visualization"] = {
                "gradcam_url": None, # Could save to disk and serve URL
                "heatmap_overlay": overlay
            }
            
        return response
