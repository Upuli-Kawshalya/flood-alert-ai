# 🌊 AI Flood Alert System | Sri Lanka

[![CI/CD](https://github.com/yourusername/flood-alert-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/flood-alert-ai/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/downloads/)

**AI-powered flood risk prediction and early warning system for communities in Sri Lanka.**

## 🎯 Overview

This system uses machine learning to predict flood risk 24-48 hours in advance and sends automated alerts via Telegram. Built with modern web technologies and cloud deployment.

### ✨ Features
- 🤖 **ML Prediction**: XGBoost model with 94%+ accuracy
- 📍 **Interactive Map**: Real-time location-based risk visualization
- 🚨 **Automated Alerts**: Telegram notifications for high-risk areas
- 📊 **Dashboard**: Web interface with risk levels and recommendations
- ☁️ **Cloud-Native**: Deployed on Vercel + Render + MongoDB Atlas

## 🚀 Live Demo

- **Frontend**: [https://your-frontend.vercel.app](https://your-frontend.vercel.app)
- **API Docs**: [https://your-backend.render.com/docs](https://your-backend.render.com/docs)

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **XGBoost** - Machine learning model
- **MongoDB** - NoSQL database
- **Pydantic** - Data validation

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Leaflet** - Interactive maps

### DevOps
- **GitHub Actions** - CI/CD
- **Docker** - Containerization
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

## 📦 Installation

### Prerequisites
- Python 3.11+
- Node.js 20+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your MongoDB URI and Telegram tokens

# Train the model
python scripts/train_model.py

# Run the server
uvicorn app.main:app --reload