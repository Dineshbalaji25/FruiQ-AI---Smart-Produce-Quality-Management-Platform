import numpy as np
import base64
import cv2
import io
from PIL import Image

def generate_gradcam(model, img_array, class_index, layer_name="top_conv"):
    """
    Generates a Grad-CAM heatmap for a given image array and model.
    In a real scenario, applies TensorFlow's GradientTape to the specified last conv layer.
    """
    # Dummy implementation for skeleton:
    # We would actually compute gradients here. 
    # Since this is a skeleton without the loaded tf instance directly here, returning a placeholder.
    
    heatmap = np.random.rand(224, 224) 
    heatmap = np.uint8(255 * heatmap)
    
    # Apply colormap
    jet = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    
    return jet

def overlay_heatmap(img_array, heatmap, alpha=0.4):
    """
    Overlays the heatmap on top of the original image (which should be 224x224x3).
    """
    # Assuming img_array is shape (1, 224, 224, 3) 
    img = img_array[0].astype('uint8')
    superimposed_img = cv2.addWeighted(img, 1 - alpha, heatmap, alpha, 0)
    
    # Convert back to PIL
    pil_img = Image.fromarray(superimposed_img)
    buff = io.BytesIO()
    pil_img.save(buff, format="JPEG")
    
    return base64.b64encode(buff.getvalue()).decode('utf-8')
