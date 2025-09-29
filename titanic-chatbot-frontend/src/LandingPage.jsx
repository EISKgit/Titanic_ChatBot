import React from "react";
import { useNavigate } from "react-router-dom";
import WhatAppDoes from "./WhatAppDoes";
import TechnologiesUsed from "./TechnologiesUsed";
import "./LandingPage.css";

function LandingPage() {
    const navigate = useNavigate();

    const goToChat = () => {
        navigate("/chat");
    };

    return (
        <div className="landing-container">
            <header className="landing-hero">
                <h1 className="landing-title">🚢 Titanic Survival Predictor</h1>
                <p className="landing-subtitle">
                    Explore history through AI predictions.
                    See who might have survived the Titanic disaster using Machine Learning.
                </p>
            </header>

            <div className="landing-info">
                <WhatAppDoes />
                <TechnologiesUsed />
            </div>

            <div className="landing-action">
                <button className="start-chat-btn" onClick={goToChat}>
                    💬 Start Chatting
                </button>
            </div>

            <footer className="landing-footer">
                <p>⚡ Built with React, Vite, and Machine Learning</p>
            </footer>
        </div>
    );
}

export default LandingPage;
