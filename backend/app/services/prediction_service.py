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
        if self.model_path and os.path.exists(self.model_path):
            try:
                print(f"Loading model from {self.model_path}...")
                self.model = tf.keras.models.load_model(self.model_path, compile=False)
                print("Model loaded successfully.")
            except Exception as e:
                print(f"Error loading TF model: {e}")
                
        self.processor = ImageProcessor()
        
    def predict(self, file_stream, include_gradcam=False, include_shelf_life=False, fruit_type='apple'):
        # Validate & process
        if not self.processor.validate_image(file_stream):
            raise ValueError("Invalid image file format or corrupted file.")
            
        file_stream.seek(0)
        img_array = self.processor.preprocess_image(file_stream)
        
        # Mock prediction logic if model isn't loaded
        if self.model is None:
            print("Warning: Model not loaded! Using mock prediction.")
            probs = np.random.dirichlet(np.ones(3), size=1)[0]
            pred_idx = np.argmax(probs)
            pred_class = self.classes[pred_idx]
            probabilities = {
                'fresh': float(probs[0]),
                'rotten': float(probs[1]),
                'formalin': float(probs[2])
            }
            confidence = probabilities[pred_class]
            freshness_score = calculate_freshness_score(probabilities)
            grade = determine_grade(freshness_score)
        else:
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
                "formalin_detected": (pred_class == 'formalin'),
                "confidence": probabilities['formalin'],
                "safe_for_consumption": (pred_class != 'formalin' and pred_class != 'rotten')
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
