from flask import Blueprint, request, jsonify
from ..database.db import db
from ..database.models import ContactMessage

bp = Blueprint('contact', __name__)

@bp.route('/contact', methods=['POST'])
def submit_contact_form():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')

    if not all([name, email, subject, message]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        new_message = ContactMessage(
            name=name,
            email=email,
            subject=subject,
            message=message
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify({"status": "success", "message": "Contact form submitted successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to save contact message: {str(e)}"}), 500
