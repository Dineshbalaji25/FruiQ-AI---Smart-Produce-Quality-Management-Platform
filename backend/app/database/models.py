import uuid
from datetime import datetime
from .db import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class PredictionRecord(db.Model):
    __tablename__ = 'predictions'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    fruit_type = db.Column(db.String(50), nullable=True)
    predicted_class = db.Column(db.String(50), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    freshness_score = db.Column(db.Integer, nullable=False)
    formalin_detected = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    model_version = db.Column(db.String(20), nullable=False)

class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    subject = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
