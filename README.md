# FruiQ AI - Smart Produce Quality Management Platform 🍎🥭🍊

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Backend-Flask-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![TensorFlow](https://img.shields.io/badge/AI-TensorFlow-FF6F00?style=flat-square&logo=tensorflow)](https://www.tensorflow.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=flat-square&logo=sqlite)](https://www.sqlite.org/)

**FruiQ AI** is a state-of-the-art agricultural technology platform that leverages Deep Learning to revolutionize fruit quality management. By combining high-accuracy computer vision with real-time analytics, we provide an end-to-end solution for freshness assessment, chemical detection, and shelf-life optimization.

---

## 🚀 Key Modules & Features

### 1. 📊 Real-Time Analytics Dashboard
Experience a data-driven overview of your produce stream.
- **Scan Volume Trends**: 7-day interactive area charts (using Recharts).
- **Quality Distribution**: Real-time pie charts showing ratios of Fresh vs. Rotten vs. Formalin items.
- **Model Confidence Matrix**: Dynamic visualizations of the AI performance metrics.

### 2. 🔍 Smart Fruit Scan
Individual item analysis powered by **EfficientNetV2**.
- **Multi-Head Output**: Simultaneously classifies state (Fresh/Rotten/Formalin) and generates a 0-100 freshness score.
- **Shelf-Life Predictor**: Logic-based estimation for consumption windows.
- **Storage Recommendations**: Tailored advice (e.g., "Refrigerate at 4°C") based on detected quality.
- **Explainable AI (XAI)**: Integrated **Grad-CAM** activation maps to show exactly *where* the AI is looking.

### 3. 📦 Bulk AI Inspection (Batch Processing)
Industrial-scale verification for warehouses and distributors.
- **Multi-file Upload**: Process up to 50 images in a single payload.
- **Batch Report Matrix**: Aggregated statistics and itemized results for high-volume quality control.

### 4. 🛡️ Food Safety & Chemical Detection
Unique neural network layers specifically trained to detect **Formalin** and other common chemical preservatives, protecting consumer health.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS v4, Recharts, Framer Motion |
| **Backend** | Flask (Python), SQLAlchemy, RESTful API |
| **AI/ML** | TensorFlow/Keras, EfficientNetV2, OpenCV, Grad-CAM |
| **Database** | SQLite (Persistence for analytics and contact inquiries) |

---

## 📂 Project Architecture

```text
├── backend/
│   ├── app/
│   │   ├── database/       # SQLAlchemy models & DB initialization
│   │   ├── routes/         # API controllers (Prediction, Auth, Contact)
│   │   ├── services/       # Core AI logic & Shelf-life algorithms
│   │   └── utils/          # Performance logging & validators
│   ├── models/             # Trained neural network weights (.h5)
│   └── scripts/            # Training and evaluation pipelines
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI widgets & Layouts
│   │   ├── pages/          # Dashboard, Scan, Batch, About, Contact
│   │   └── services/       # API integration (Axios)
└── datasets/               # Raw and processed training data
```

---

## ⚙️ Installation & Setup

### Local Development

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python wsgi.py
```
*API runs on: `http://localhost:5000`*

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --port 5174
```
*Web App runs on: `http://localhost:5174`*

---

## 📬 Contact & Support
Located at: **#107, 1st Cross, Greenwoods Layout, TC Palaya, Bengaluru, KA 560049**  
Email: [balajidineshr@gmail.com](mailto:balajidineshr@gmail.com)  
Phone: **+91 7259634987**

---

Developed with ❤️ for a sustainable and safer food supply chain.
