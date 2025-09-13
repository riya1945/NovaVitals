# 🌌 NovaVitals – Satellite Health Prediction

NovaVitals is a modern health monitoring and prediction platform built to **analyze satellite health parameters in real-time**. Instead of relying on manual calculations or scattered tools, NovaVitals lets you input key statistical features, run predictions via a **FastAPI ML backend**, and securely store results in **Supabase**—all from a clean, modern dashboard.

---

## 🌟 Features

- ✅ Intuitive form to input satellite statistical parameters  
- 📡 Real-time health prediction using ML backend  
- ☁️ Supabase backend for secure data storage & history tracking  
- 📊 Prediction history dashboard (coming soon)  
- ✨ Modern Next.js + Tailwind frontend  

---

## 🧰 Tech Stack

- **Frontend**: Next.js (React + TypeScript), Tailwind CSS  
- **Backend**: FastAPI (Prediction Service)  
- **Database**: Supabase (PostgreSQL + Auth + Storage)  
- **Other Tools**: Vercel (deployment), Render (API hosting)  

---

## 🚀 Getting Started

### Prerequisites
* **Node.js & npm**: [Download Node.js](https://nodejs.org/)  
* **Supabase Account**: [Sign up for Supabase](https://supabase.com/)  
* **Prediction API URL**: Your deployed FastAPI ML model endpoint  

---

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/novavitals.git
   cd novavitals

### 2. Install Dependencies
```bash
npm install
```
### 3. Run the application
```bash
npm start
```
---
### Set up environment variables:
```
Create a .env file and add:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=your_fastapi_backend_url
```
## AI Integrations
```
Health Prediction Model: ML backend (FastAPI) evaluates statistical satellite parameters.

Supabase Storage: Every prediction is logged for history tracking and future analytics.
```
### 👩‍💻 About the Creator
Hi, I'm Riya Joshi, the creator of NovaVitals – Satellite Health Prediction.
My goal is to provide an easy-to-use platform for monitoring and predicting satellite health using modern AI + cloud technologies.

NovaVitals empowers users to:

Monitor satellite health in real-time

Store predictions for analysis

Use an intuitive dashboard for quick insights
