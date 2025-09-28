-Titanic Survival Predictor

An interactive chat-based web app that predicts whether a passenger on the Titanic would have survived or not.
Built with React (Vite) on the frontend, Django + Python on the backend, and a Scikit-learn machine learning model trained on Titanic dataset.

The app combines a smooth glassmorphism UI , background video 🎥, and a fun chat-style interface  to make exploring ML predictions more engaging.


Preview
- Background video of Titanic with chat overlay
- Chatbot asking user details step by step and predicting survival


Features
- Chat-style input: Provide passenger details step by step.
- Background video overlay for immersive Titanic theme.
- Machine learning prediction (Survived / Not Survived).
- Probability score with explanations & suggestions.
- Retry option if inputs are invalid or after completing a prediction.
- Glassmorphism design for modern UI feel.


-> Tech Stack

Frontend:
- React.js (with Vite)
- CSS (Glassmorphism, responsive design)
- Axios (API requests)

Backend:
- Python (Django REST Framework)
- Scikit-learn (ML model trained on Titanic dataset)

Extras:
- LangChain (for LLM workflow experimentation)
- LangGraph (visual pipeline structuring)


----> Getting Started

1 Clone the repo

git clone https://github.com/your-username/titanic-chatbot.git
cd titanic-chatbot

2 Backend Setup (Django)

cd backend
python -m venv venv
source venv/bin/activate   # (Linux/Mac)
venv\Scripts\activate      # (Windows)

pip install -r requirements.txt
python manage.py runserver


API will run on: http://127.0.0.1:8000/

3 Frontend Setup (React + Vite)

cd frontend
npm install
npm run dev


App will run on: http://localhost:5173/

------- Background Video Setup

Place your Titanic video file at:

frontend/public/videos/titanic.mp4


It will automatically load in the app background.

--------- How to Use

Start both backend & frontend servers.

Open the app in browser.

Enter details step by step (Class, Age, Gender, etc.).

Receive prediction with probability & explanation.



Click Try Once More to restart.

- Future Improvements
- Add visual survival probability chart.
- Try deep learning models (TensorFlow / PyTorch).
- Deploy on cloud (AWS / Vercel / Render).
- Add voice-based input/output for accessibility.

------- Contributing

Contributions are welcome! Fork the repo, create a new branch, and submit a pull request.


------- License

This project is licensed under the MIT License – free to use, modify, and distribute.

-----------------------------------------------

Project setup (pip install -r requirements.txt)

How to run server (python manage.py runserver)