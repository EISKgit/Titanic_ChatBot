from rest_framework.views import APIView
from rest_framework.response import Response
from joblib import load
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from pydantic import BaseModel, Field
import pandas as pd
import os
import json

# Build absolute path to the model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, "ML", "titanic_model.joblib")

# Load environment variables from .env
load_dotenv()  
# Load model
model = load(model_path)


# Initialize ChatGroq with API key
chat_model = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.5,

)


# Define structured output schema
class TitanicExplanationSchema(BaseModel):
    reason: str = Field(description="Why the ML model predicted this outcome")
    suggestion: str = Field(description="What could be changed to increase survival probability")
    fact: str = Field(description="An interesting fact about this passenger")

# Wrap the LLM with structured output
structured_model = chat_model.with_structured_output(TitanicExplanationSchema)

class TitanicMLAPIView(APIView):
    def post(self, request):
        features = request.data

        # Prepare DataFrame for ML model
        X_input = pd.DataFrame([{
            "Pclass": features['Pclass'],
            "Sex": 0 if features['Sex'].lower() == 'female' else 1,
            "Age": features['Age'],
            "SibSp": features['SibSp'],
            "Parch": features['Parch'],
            "Fare": features['Fare'],
            "Embarked": {'C':0,'Q':1,'S':2}[features['Embarked'].upper()]
        }])
        
        # Predict using ML model
        prediction = model.predict(X_input)[0]
        survival_prob = model.predict_proba(X_input)[0][1]

        # Build prompt for structured LLM output
        llm_prompt = f"""
        The Titanic passenger has these details:
        {features}
        ML model predicted survival: {'Yes' if prediction == 1 else 'No'}
        Survival probability: {survival_prob:.2f}

        Return a JSON object with exactly these keys:
        - "reason": why the ML model predicted this outcome
        - "suggestion": what could be changed to increase survival probability
        - "fact": an interesting fact about this passenger

        Make sure the response is valid JSON and nothing else.
        """

        #testing
        # raw_response = structured_model.invoke(llm_prompt)
        # print("Raw LLM output:", raw_response)


        # Invoke structured LLM
        try:
            llm_response: TitanicExplanationSchema = structured_model.invoke(llm_prompt)
        except Exception:
            # fallback if LLM fails
            llm_response = TitanicExplanationSchema(
                reason="Could not generate explanation.",
                suggestion="Could not generate suggestion.",
                fact="Could not generate fact."
            )

        # Return API response
        return Response({
            "prediction": int(prediction),
            "survival_probability": round(float(survival_prob), 2),
            "explanation": {
                "reason": llm_response.reason,
                "suggestion": llm_response.suggestion,
                "fact": llm_response.fact
            }
        })




# Receptionist LLM
receptionist_model = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.7,
)

class TitanicReceptionistAPIView(APIView):
    def post(self, request):
        user_question = request.data.get("question", "")

        prompt = f"""
        You are a Titanic onboarding receptionist assistant your name is Rose.
        Answer only questions related to:
        - The Titanic ship
        - Its voyage, passengers, history, or travel-related info

        If the question is NOT related to Titanic or ship travel, respond with:
        "Sorry, I can only answer questions related to the Titanic or ship travel."

        After answering, politely guide the user back to filling the form by saying:
        "Now, let's continue with your details."
        
        User question: {user_question}
        """

        try:
            response = receptionist_model.invoke(prompt)
            answer = response.content if hasattr(response, "content") else str(response)
        except Exception:
            answer = "Sorry, I'm unable to answer right now. Let's continue with your details."

        return Response({"answer": answer})
