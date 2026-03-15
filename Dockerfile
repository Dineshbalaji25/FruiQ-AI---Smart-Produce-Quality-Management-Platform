# Stage 1: Build React Frontend
FROM node:20-alpine as build-stage
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Serve with Flask
FROM python:3.10-slim

WORKDIR /app/backend

# Install necessary system dependencies for OpenCV and other packages
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Create uploads directory (used by Flask)
RUN mkdir -p uploads

# Create necessary model directory structure
RUN mkdir -p ../models/trained

# Copy React build from stage 1 to /app/dist (backend static_folder points to '../dist')
COPY --from=build-stage /app/frontend/dist /app/backend/dist

# Expose the Hugging Face requested port
EXPOSE 7860

# We don't need Redis or Postgres URLs; the app falls back to SQLite naturally.
ENV FLASK_APP=wsgi.py
ENV FLASK_ENV=production
ENV MODEL_PATH=../models/trained/efficientnet_v2.keras
ENV UPLOAD_FOLDER=./uploads

# Create a non-root user (Hugging Face Spaces requirement / best practice)
RUN useradd -m -u 1000 user
# Give the user ownership over /app so SQLite can create the db file and uploads can be saved
RUN chown -R user:user /app

USER user

# Start Gunicorn on port 7860
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:7860", "--timeout", "120", "wsgi:app"]
