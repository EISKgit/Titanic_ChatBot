import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './App.css';


function App() {
  const maxAttempts = 3;
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm the Titanic Survival Predictor. What's your name?" }
  ]);
  const [input, setInput] = useState("");
  const [userData, setUserData] = useState({});
  const [step, setStep] = useState("name");
  const [attempts, setAttempts] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingSender, setTypingSender] = useState("bot"); // bot or receptionist
  const messagesEndRef = useRef(null);

  const backendUrl = "http://127.0.0.1:8000/api/chatbot_ml/";
  const receptionistUrl = "http://127.0.0.1:8000/api/titanic_receptionist/";

  // Step prompts for repeating after receptionist response
  const stepPrompts = {
    name: "What's your name?",
    pclass: "Which class are you traveling in? (1, 2, or 3)",
    sex: "What is your Sex (male/female)?",
    age: "what is your Age?",
    sibsp: "How many siblings/spouses are aboard (SibSp)?",
    parch: "How many parents/children are aboard (Parch)?",
    fare: "What is your Fare? ($0 - $512)",
    embarked: "What is your Port of Embarkation (C, Q, S)?"
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const resetChat = (msg = "Too many invalid attempts. Let's start over.") => {
    setMessages([{ sender: "bot", text: msg }]);
    setInput("");
    setUserData({});
    setStep("name");
    setAttempts(0);
  };

  const handleUserInput = async () => {
    if (!input.trim()) return;

    // Add user message immediately
    setMessages(prev => [...prev, { sender: "user", text: input }]);

    let valid = true;
    let errorMsg = "";

    // Validation per step
    switch (step) {
      case "pclass":
        const pclass = parseInt(input);
        if (![1, 2, 3].includes(pclass)) {
          valid = false;
          errorMsg = "Please enter 1, 2, or 3 for class.";
        }
        break;
      case "sex":
        if (!["male", "female"].includes(input.toLowerCase())) {
          valid = false;
          errorMsg = "Please enter 'male' or 'female'.";
        }
        break;
      case "age":
        if (isNaN(parseFloat(input)) || parseFloat(input) < 0) {
          valid = false;
          errorMsg = "Please enter a valid positive number for age.";
        }
        break;
      case "sibsp":
      case "parch":
        if (isNaN(parseInt(input)) || parseInt(input) < 0) {
          valid = false;
          errorMsg = "Please enter a valid non-negative integer.";
        }
        break;
      case "fare":
        const fare = parseFloat(input);
        if (isNaN(fare) || fare < 0 || fare > 512) {
          valid = false;
          errorMsg = "Fare should be a number between 0 and 512.";
        }
        break;
      case "embarked":
        if (!["c", "q", "s"].includes(input.toLowerCase())) {
          valid = false;
          errorMsg = "Please enter C, Q, or S for port.";
        }
        break;
      default:
        break;
    }

    // If invalid, send to receptionist
    if (!valid && step !== "done") {
      setIsTyping(true);
      setTypingSender("receptionist");
      try {
        const res = await axios.post(receptionistUrl, { question: input });
        // simulate typing
        await new Promise(resolve => setTimeout(resolve, 800));
        setMessages(prev => [
          ...prev,
          { sender: "receptionist", text: res.data.answer },
          { sender: "bot", text: stepPrompts[step] } // repeat the original question
        ]);
      } catch {
        await new Promise(resolve => setTimeout(resolve, 800));
        setMessages(prev => [
          ...prev,
          { sender: "receptionist", text: "Receptionist unavailable. Let's continue with your details." },
          { sender: "bot", text: stepPrompts[step] }
        ]);
      }
      setIsTyping(false);
      setTypingSender("bot");
      setInput("");
      return;
    }

    // Valid input → continue ML flow
    setAttempts(0);
    setIsTyping(true);
    setTypingSender("bot");
    await new Promise(resolve => setTimeout(resolve, 400));

    let nextStep = step;

    switch (step) {
      case "name":
        setUserData({ ...userData, name: input });
        setMessages(prev => [...prev, { sender: "bot", text: `Nice to meet you, ${input}! Which class are you traveling in? (1, 2, or 3)` }]);
        nextStep = "pclass";
        break;
      case "pclass":
        setUserData({ ...userData, Pclass: parseInt(input) });
        setMessages(prev => [...prev, { sender: "bot", text: "Sex (male/female)?" }]);
        nextStep = "sex";
        break;
      case "sex":
        setUserData({ ...userData, Sex: input.toLowerCase() });
        setMessages(prev => [...prev, { sender: "bot", text: "Age?" }]);
        nextStep = "age";
        break;
      case "age":
        setUserData({ ...userData, Age: parseFloat(input) });
        setMessages(prev => [...prev, { sender: "bot", text: "Number of siblings/spouses aboard (SibSp)?" }]);
        nextStep = "sibsp";
        break;
      case "sibsp":
        setUserData({ ...userData, SibSp: parseInt(input) });
        setMessages(prev => [...prev, { sender: "bot", text: "Number of parents/children aboard (Parch)?" }]);
        nextStep = "parch";
        break;
      case "parch":
        setUserData({ ...userData, Parch: parseInt(input) });
        setMessages(prev => [...prev, { sender: "bot", text: "Fare? ($0 - $512)" }]);
        nextStep = "fare";
        break;
      case "fare":
        setUserData({ ...userData, Fare: parseFloat(input) });
        setMessages(prev => [...prev, { sender: "bot", text: "Port of Embarkation (C, Q, S)?" }]);
        nextStep = "embarked";
        break;
      case "embarked":
        const embarked = input.toUpperCase();
        setUserData({ ...userData, Embarked: embarked });

        try {
          const res = await axios.post(backendUrl, { ...userData, Embarked: embarked });
          const { prediction, survival_probability, explanation } = res.data;

          await new Promise(resolve => setTimeout(resolve, 600)); // simulate typing
          setMessages(prev => [
            ...prev,
            { sender: "bot", text: `Prediction: ${prediction === 1 ? "✅ Survived" : "❌ Did not survive"} (Probability: ${(survival_probability * 100).toFixed(0)}%)` },
            { sender: "bot", text: `Reason: ${explanation.reason}` },
            { sender: "bot", text: `Suggestion: ${explanation.suggestion}` },
            { sender: "bot", text: `Fact: ${explanation.fact}` }
          ]);
        } catch (err) {
          setMessages(prev => [...prev, { sender: "bot", text: "Error contacting backend." }]);
        }

        nextStep = "done";
        break;
      default:
        break;
    }

    setStep(nextStep);
    setInput("");
    setIsTyping(false);
    setTypingSender("bot");
  };

  const handleTryAgain = () => {
    resetChat("Hello! I'm the Titanic Survival Predictor. What's your name?");
  };

  return (
    <div className="video-background-container">
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="/videos/titanic.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>


      <div className="chat-overlay">
        <h1 className="chat-title">🚢 Titanic Survival Predictor</h1>

        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender}`}>
              <div className="message-text">{msg.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className={`message ${typingSender}`}>
              <div className="message-text typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {step !== "done" && (
          <div className="input-area">
            <input
              type="text"
              placeholder="Type your answer..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleUserInput()}
            />
            <button onClick={handleUserInput}>Send</button>
          </div>
        )}

        {step === "done" && (
          <button className="btn-try" onClick={handleTryAgain}>
            🔄 Try Once More
          </button>
        )}
      </div>

    </div>
  );
}

export default App;
