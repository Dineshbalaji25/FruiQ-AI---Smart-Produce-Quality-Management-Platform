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
        
        # Convert to numpy array and ensure float32 range [0, 255]
        # EfficientNetV2 handles internal rescaling but expects specific distribution
        img_array = np.array(image).astype(np.float32)
        
        img_array = np.expand_dims(img_array, axis=0)
        return img_array

    def validate_image(self, file_stream):
        """
        Check if valid image according to properties without corrupting the stream.
        """
        try:
            file_stream.seek(0)
            image = Image.open(file_stream)
            image.verify()
            file_stream.seek(0) # Reset after verify
            return True
        except Exception:
            return False

