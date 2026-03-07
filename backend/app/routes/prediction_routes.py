from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from ..services.prediction_service import PredictionService
from ..database.db import db
from ..database.models import PredictionRecord

bp = Blueprint('prediction', __name__)

prediction_service = None

def get_prediction_service():
    global prediction_service
    if prediction_service is None:
        model_path = current_app.config.get('MODEL_PATH')
        prediction_service = PredictionService(model_path=model_path)
    return prediction_service

def allowed_file(filename):
    extensions = current_app.config.get('ALLOWED_EXTENSIONS')
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in extensions

@bp.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image part in the request"}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and allowed_file(file.filename):
        include_gradcam = request.form.get('include_gradcam', 'false').lower() == 'true'
        include_shelf_life = request.form.get('include_shelf_life', 'false').lower() == 'true'
        fruit_type = request.form.get('fruit_type', 'apple')
        
        try:
            service = get_prediction_service()
            result = service.predict(
                file, 
                include_gradcam=include_gradcam, 
                include_shelf_life=include_shelf_life,
                fruit_type=fruit_type
            )
            
            # Save to Database
            record = PredictionRecord(
                fruit_type=fruit_type,
                predicted_class=result['prediction']['class'],
                confidence=result['prediction']['confidence'],
                freshness_score=int(result['prediction']['freshness_score']),
                formalin_detected=result['safety']['formalin_detected'],
                model_version=result['metadata']['model_version']
            )
            db.session.add(record)
            db.session.commit()
            
            return jsonify(result), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": f"Prediction failed: {str(e)}"}), 500
            
    return jsonify({"error": "File type not allowed"}), 400

@bp.route('/predict/batch', methods=['POST'])
def predict_batch():
    if 'images' not in request.files:
        return jsonify({"error": "No images part in the request"}), 400
        
    files = request.files.getlist('images')
    if not files or files[0].filename == '':
        return jsonify({"error": "No selected files"}), 400
        
    include_gradcam = request.form.get('include_gradcam', 'false').lower() == 'true'
    include_shelf_life = request.form.get('include_shelf_life', 'false').lower() == 'true'
    fruit_type = request.form.get('fruit_type', 'apple')
        
    results = []
    service = get_prediction_service()
    
    for file in files:
        if file and allowed_file(file.filename):
            try:
                result = service.predict(
                    file, 
                    include_gradcam=include_gradcam, 
                    include_shelf_life=include_shelf_life,
                    fruit_type=fruit_type
                )
                
                # Save to Database
                record = PredictionRecord(
                    fruit_type=fruit_type,
                    predicted_class=result['prediction']['class'],
                    confidence=result['prediction']['confidence'],
                    freshness_score=int(result['prediction']['freshness_score']),
                    formalin_detected=result['safety']['formalin_detected'],
                    model_version=result['metadata']['model_version']
                )
                db.session.add(record)
                
                results.append({"filename": file.filename, **result})
            except Exception as e:
                results.append({"filename": file.filename, "error": str(e)})
        else:
            results.append({"filename": file.filename, "error": "Invalid file format"})
            
    db.session.commit()
    return jsonify(results), 200
