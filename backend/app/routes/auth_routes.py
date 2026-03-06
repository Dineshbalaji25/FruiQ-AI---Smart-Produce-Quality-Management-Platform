from flask import Blueprint, request, jsonify

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    # Placeholder for JWT auth
    return jsonify({"token": "placeholder-jwt-token"}), 200

@bp.route('/register', methods=['POST'])
def register():
    return jsonify({"message": "User registered"}), 201

@bp.route('/refresh', methods=['POST'])
def refresh():
    return jsonify({"token": "refreshed-jwt-token"}), 200
