# Titanic Survival Predictor

An interactive **chat-based web app** that predicts whether a passenger on the Titanic would have survived.  
Built with **React (Vite)** on the frontend, **Django + Python** on the backend, and a **Scikit-learn machine learning model** trained on the Titanic dataset.

The app combines a smooth **glassmorphism UI**, **background video** 🎥, and a **chat-style interface** to make exploring ML predictions more engaging.

---

## Preview

- Background video of Titanic with chat overlay.
- Chatbot asks user details step by step and predicts survival.

---

## Features

- Chat-style input: provide passenger details step by step.  
- Background video overlay for immersive Titanic theme.  
- Machine learning prediction (**Survived / Not Survived**).  
- Probability score with explanations & suggestions.  
- Retry option if inputs are invalid or after completing a prediction.  
- Modern **glassmorphism design** for UI.

---

## Tech Stack

**Frontend:**

- React.js (with Vite)  
- CSS (Glassmorphism, responsive design)  
- Axios (API requests)  

**Backend:**

- Python (Django REST Framework)  
- Scikit-learn (ML model trained on Titanic dataset)  

**Extras:**

- LangChain (LLM workflow experimentation)  
- LangGraph (visual pipeline structuring)  

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/titanic-chatbot.git
cd titanic-chatbot


2. Backend Setup (Django)

cd backend
python -m venv venv
# Activate virtual environment
# Linux / Mac
source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt
python manage.py runserver
The backend API will run on: http://127.0.0.1:8000/



3. Frontend Setup (React + Vite)
cd frontend
npm install
npm run dev


The frontend will run on: http://localhost:5173/


How to Use

Start both backend and frontend servers.

Open the app in your browser.

Enter passenger details step by step (Class, Age, Gender, etc.).

Receive prediction with probability & explanation.

Click "Try Once More" to restart the input process.


Future Improvements

Add visual survival probability chart.

Explore deep learning models (TensorFlow / PyTorch).

Deploy on cloud (AWS / Vercel / Render).

Add voice-based input/output for accessibility.

Contributing

Contributions are welcome!
Fork the repository, create a new branch, and submit a pull request.

License

This project is licensed under the MIT License – free to use, modify, and distribute.

Quick Commands

Install Python dependencies:

pip install -r requirements.txt


Run Django server:

python manage.py runserver
