from dotenv import load_dotenv
import requests
from typing import TypedDict

from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, START, END

# Load environment variables
load_dotenv()

# Initialize Chat Model
chat_model = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.5,
)

#  Define State 
class BotState(TypedDict, total=False):
    name: str
    Age: int
    Sex: str
    Pclass: int
    SibSp: int
    Parch: int
    Fare: float
    Embarked: str
    response: str


# Backend API call 
def call_backend_api(state: BotState) -> BotState:
    features = {
        "Pclass": state["Pclass"],
        "Sex": state["Sex"],
        "Age": state["Age"],
        "SibSp": state["SibSp"],
        "Parch": state["Parch"],
        "Fare": state["Fare"],
        "Embarked": state["Embarked"]
    }
    response = requests.post("http://localhost:8000/api/chatbot_ml/", json=features)
    data = response.json()
    prob = data['survival_probability']

    if prob > 0.5:
        state["response"] = f"Good news, {state['name']}! Your survival chance is high: {prob*100:.1f}%"
    else:
        state["response"] = f"Warning, {state['name']}! Your survival chance is low: {prob*100:.1f}%"
    return state


#   Node Functions
def start_node(state: BotState) -> BotState:
    state["response"] = "Hello! I’m your Titanic Survival Predictor bot. What’s your name?"
    return state

def name_node(state: BotState) -> BotState:
    state["response"] = f"Nice to meet you, {state['name']}! Ready to start? (yes/no)"
    return state

def permission_node(state: BotState) -> BotState:
    state["response"] = "Do you want to continue onboarding? (yes/no)"
    return state

def age_node(state: BotState) -> BotState:
    state["response"] = "Enter your age:"
    return state

def sex_node(state: BotState) -> BotState:
    state["response"] = "Enter your sex (male/female):"
    return state

def pclass_node(state: BotState) -> BotState:
    state["response"] = "Enter your ticket class (1,2,3):"
    return state

def sibsp_node(state: BotState) -> BotState:
    state["response"] = "Enter number of siblings/spouses aboard:"
    return state

def parch_node(state: BotState) -> BotState:
    state["response"] = "Enter number of parents/children aboard:"
    return state

def fare_node(state: BotState) -> BotState:
    state["response"] = "Enter ticket fare:"
    return state

def embarked_node(state: BotState) -> BotState:
    state["response"] = "Enter port of embarkation (C/Q/S):"
    return state

def prediction_node(state: BotState) -> BotState:
    return call_backend_api(state)

def end_node(state: BotState) -> BotState:
    state["response"] = "Thank you for using Titanic Predictor! Safe travels! 🚢"
    return state


#   Build Graph  
graph = StateGraph(BotState)

graph.add_node("Start", start_node)
graph.add_node("Name", name_node)
graph.add_node("Permission", permission_node)
graph.add_node("Age", age_node)
graph.add_node("Sex", sex_node)
graph.add_node("Pclass", pclass_node)
graph.add_node("SibSp", sibsp_node)
graph.add_node("Parch", parch_node)
graph.add_node("Fare", fare_node)
graph.add_node("Embarked", embarked_node)
graph.add_node("Prediction", prediction_node)
graph.add_node("End", end_node)

# Connect nodes using START and END
graph.add_edge(START, "Start")
graph.add_edge("Start", "Name")
graph.add_edge("Name", "Permission")
graph.add_edge("Permission", "Age")
graph.add_edge("Age", "Sex")
graph.add_edge("Sex", "Pclass")
graph.add_edge("Pclass", "SibSp")
graph.add_edge("SibSp", "Parch")
graph.add_edge("Parch", "Fare")
graph.add_edge("Fare", "Embarked")
graph.add_edge("Embarked", "Prediction")
graph.add_edge("Prediction", "End")
graph.add_edge("End", END)

# Compile graph
titanic_app = graph.compile()
