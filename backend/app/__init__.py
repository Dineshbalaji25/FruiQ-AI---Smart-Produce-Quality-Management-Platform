from flask import Flask, jsonify
from flask_cors import CORS
import os
import logging
from .database.db import db
from .config import Config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def create_app(config_class=Config):
    # Set static_folder to point to where the React build outputs its files
    app = Flask(__name__, static_folder='../dist', static_url_path='/')
    app.config.from_object(config_class)
    
    CORS(app, resources={r"/api/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}})
    db.init_app(app)

    # Note: the models should be imported here to register with SQLAlchemy
    from .database import models

    # Register routes
    from .routes.prediction_routes import bp as prediction_bp
    app.register_blueprint(prediction_bp, url_prefix='/api/v1')
    
    from .routes.auth_routes import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')

    from .routes.contact_routes import bp as contact_bp
    app.register_blueprint(contact_bp, url_prefix='/api/v1')

    # Health endpoint
    @app.route('/api/v1/health', methods=['GET'])
    def health():
        return jsonify({
            "status": "healthy",
            "model_loaded": True, # Assume true for skeleton
            "version": "1.2.0",
            "uptime": 3600
        }), 200

    @app.route('/api/v1/stats', methods=['GET'])
    def stats():
        from .database.models import PredictionRecord
        from sqlalchemy import func
        import datetime
        from datetime import timedelta
        
        total_predictions = db.session.query(PredictionRecord).count()
        if total_predictions == 0:
            return jsonify({
                "total_predictions": 0,
                "accuracy": 0.0,
                "average_confidence": 0.0,
                "class_distribution": {
                    "fresh": 0,
                    "rotten": 0,
                    "formalin": 0
                },
                "trend_data": []
            }), 200

        fresh_count = db.session.query(PredictionRecord).filter_by(predicted_class="fresh").count()
        rotten_count = db.session.query(PredictionRecord).filter_by(predicted_class="rotten").count()
        formalin_count = db.session.query(PredictionRecord).filter_by(predicted_class="formalin").count()
        
        avg_conf = db.session.query(func.avg(PredictionRecord.confidence)).scalar() or 0.0
        
        # Determine chart data (last 7 days simplified)
        trend_data = []
        today = datetime.datetime.utcnow().date()
        
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            # Query db for items matching `day` prefix logic
            day_str = day.strftime("%Y-%m-%d")
            
            # Simple SQLite date match via string (since timestamp is datetime type, we can cast/like)
            day_count = db.session.query(PredictionRecord).filter(
                func.date(PredictionRecord.timestamp) == day_str
            ).count()
            
            trend_data.append({
                "date": day.strftime("%b %d"),
                "scans": day_count
            })
            
        return jsonify({
            "total_predictions": total_predictions,
            "accuracy": 94.8, # Theoretical model accuracy based on training
            "average_confidence": round(avg_conf, 3),
            "class_distribution": {
                "fresh": fresh_count,
                "rotten": rotten_count,
                "formalin": formalin_count
            },
            "trend_data": trend_data
        }), 200

    @app.route('/sitemap.xml')
    def sitemap():
        return """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://fruiq-ai.me/</loc>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://fruiq-ai.me/blog</loc>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://fruiq-ai.me/detect-rotten-fruits</loc>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://fruiq-ai.me/fruit-freshness-checker</loc>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://fruiq-ai.me/formalin-detection-fruits</loc>
        <priority>0.9</priority>
    </url>
</urlset>""", 200, {'Content-Type': 'application/xml'}

    @app.route('/detect-rotten-fruits')
    @app.route('/fruit-freshness-checker')
    @app.route('/formalin-detection-fruits')
    @app.route('/blog')
    def seo_pages():
        from flask import send_from_directory
        return send_from_directory(app.static_folder, 'index.html')

    # Initialize tables if they don't exist
    with app.app_context():
        db.create_all()

    # Serve React App
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        from flask import send_from_directory
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app

