from flask import Flask, jsonify
from flask_cors import CORS
import os
from .database.db import db
from .config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    CORS(app)
    db.init_app(app)

    # Note: the models should be imported here to register with SQLAlchemy
    from .database import models

    # Register routes
    from .routes.prediction_routes import bp as prediction_bp
    app.register_blueprint(prediction_bp, url_prefix='/api/v1')
    
    from .routes.auth_routes import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')

    # Health endpoint
    @app.route('/api/v1/health', methods=['GET'])
    def health():
        return jsonify({
            "status": "healthy",
            "model_loaded": True, # Assume true for skeleton
            "version": "1.0.0",
            "uptime": 3600
        }), 200

    @app.route('/api/v1/stats', methods=['GET'])
    def stats():
        return jsonify({
            "total_predictions": 15000,
            "accuracy": 0.94,
            "average_confidence": 0.89,
            "class_distribution": {
                "fresh": 8500,
                "rotten": 5200,
                "formalin": 1300
            }
        }), 200

    # Initialize tables if they don't exist
    with app.app_context():
        db.create_all()

    return app
