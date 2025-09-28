import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './App.css';
import WhatAppDoes from './WhatAppDoes';
import TechnologiesUsed from './TechnologiesUsed';

function App() {
  const maxAttempts = 3; // max retry attempts per step
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm the Titanic Survival Predictor. What's your name?" }
  ]);
  const [input, setInput] = useState("");
  const [userData, setUserData] = useState({});
  const [step, setStep] = useState("name");
  const [attempts, setAttempts] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const backendUrl = "http://127.0.0.1:8000/api/chatbot_ml/";

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

    if (!valid) {
      const newAttempts = attempts + 1;
      if (newAttempts >= maxAttempts) {
        resetChat();
        return;
      } else {
        setMessages(prev => [...prev, { sender: "bot", text: `${errorMsg} Attempts left: ${maxAttempts - newAttempts}` }]);
        setAttempts(newAttempts);
        setInput("");
        return;
      }
    }

    // Valid input
    setMessages(prev => [...prev, { sender: "user", text: input }]);
    setAttempts(0); // reset attempts for next step
    setIsTyping(true);
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
        setMessages(prev => [...prev, { sender: "bot", text: "Fare?" }]);
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

          setMessages(prev => [
            ...prev,
            { sender: "bot", text: `Prediction: ${prediction === 1 ? "Survived" : "Did not survive"} (Probability: ${survival_probability * 100}%)` },
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
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleUserInput();
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

      <WhatAppDoes />


      <div className="chat-overlay">

        <h1 className="chat-title">🚢 Titanic Survival Predictor</h1>

        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender}`}>
              <div className="message-text">{msg.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className="message bot">
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
          <button className="btn-try" onClick={() => handleTryAgain()}>Try Once More</button>
        )}
      </div>
      <TechnologiesUsed />
    </div>
  );
}

export default App;
