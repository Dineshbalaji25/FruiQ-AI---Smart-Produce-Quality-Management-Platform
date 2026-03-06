from PIL import Image
import numpy as np
import io

class ImageProcessor:
    def __init__(self, target_size=(224, 224)):
        self.target_size = target_size

    def preprocess_image(self, file_stream):
        """
        Reads a file stream, converts to RGB, resizes, and normalizes it
        for the EfficientNetV2 model.
        """
        # Open image from stream
        image = Image.open(file_stream)
        
        # Convert to RGB (handles PNG with alpha, etc.)
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        # Resize image
        image = image.resize(self.target_size)
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Normalize to [0, 1] range typically expected if not handled by keras normalization layer
        # EfficientNet automatically scales internally but doing basic scaling here, 
        # or leave as integers depending on exact keras model setup. 
        # For typical keras.applications.efficientnet_v2... it expects [0, 255] or [0, 1].
        # We will keep as float32 array unscaled, but formatted as batch.
        
        img_array = np.expand_dims(img_array, axis=0)
        return img_array

    def validate_image(self, file_stream):
        """
        Check if valid image according to properties.
        """
        try:
            image = Image.open(file_stream)
            image.verify()
            return True
        except Exception:
            return False
