# FruiQ AI - Smart Produce Quality Management Platform

A next-generation platform for real-time fruit quality assessment using deep learning.

## Features
- **Multi-class Classification**: Identifies Fresh, Rotten, and Formalin-treated produce.
- **Freshness Scoring**: 0-100 scale showing absolute quality level.
- **Shelf-life Prediction**: Rule-based estimation for consumption dates.
- **Food Safety Detection**: Unique formalin detection capability.
- **Explainable AI**: Integrated Grad-CAM visualization for prediction transparency.
- **Enterprise-grade API**: Robust REST architecture built with Flask.
- **Modern Interface**: React, TypeScript, and TailwindCSS frontend.

## Directory Structure
- `/backend`: Flask API service, machine learning models, training scripts
- `/frontend`: React client interface (Vite + TypeScript)
- `/datasets`: Stores raw and processed fruit images
- `/models`: Houses trained saved weights
- `/uploads`: Temporary directory for image processing

## Installation and Setup

### Prerequisites
- Docker and Docker Compose
- Python 3.10+ (for local, non-Docker development)
- Node.js 18+ (for local frontend development)

### Deployment with Docker (Recommended)
You can launch the entire stack (Frontend, Backend, Postgres, Redis) via Docker Compose.
```bash
# 1. Clone the repository / Navigate to directory
cd FruiQ-AI

# 2. Build and run the containers
docker-compose up --build -d
```
The application will be accessible at:
- Web Interface: `http://localhost:3000`
- API Backend: `http://localhost:5000`

### Local Development Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python wsgi.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Quick Start Guide
1. Launch the application via `docker-compose up`.
2. Open your browser and navigate to `http://localhost:3000`.
3. Click on the **Scan Fruit** section from the sidebar or homepage.
4. Upload an image of an apple, banana, grape, mango, or orange.
5. Watch the real-time AI inference evaluate freshness, detect formalin, and map shelf-life, all augmented with Grad-CAM overlays!

## Troubleshooting
**1. Model Inference Fails or Times Out**
- **Cause**: Initial application state assumes a skeleton placeholder. If you attempt to load real deep weights and it fails, it may run out of memory.
- **Fix**: Ensure your Docker host is allocated at least 4GB of RAM. If you don't have a model yet, ensure `MODEL_PATH` in `.env` corresponds to your checkpoint.

**2. Port Configuration Conflicts**
- **Symptom**: `Bind for 0.0.0.0:5000 failed`
- **Fix**: Another service might be running on ports `3000` or `5000`. Stop any interfering services, or remap the ports in `docker-compose.yml` (e.g. `5001:5000`).

**3. Frontend Not Finding API**
- **Cause**: By default, the frontend relies on `http://localhost:5000/api/v1`.
- **Fix**: Check `frontend/.env` or docker-compose environment variables (`REACT_APP_API_URL` or `VITE_API_URL`) to ensure they point accurately to the backend hostname.

## Training Pipeline Overview
If you wish to re-train the model, utilize the scripts provided in `/backend/scripts`:
1. Place datasets in `/datasets/raw`.
2. Run `python scripts/data_preprocessing.py`.
3. Run `python scripts/train_model.py`.
4. Review logs and artifacts produced during training. By default, best weights save to `/models/trained/efficientnet_v2.h5`.
