import React from "react";
import './BoxStyles.css';

function WhatAppDoes() {
    return (
        <div className="info-box">
            <h2>🛳️ Titanic Survival Predictor – What It Does</h2>
            <p>
                Welcome aboard, Captain! ⚓ This interactive chat app allows you to explore the fate of Titanic passengers. 🌊
            </p>
            <ul>
                <li>👤 Enter passenger details: Name, Gender</li>
                <li>🏷️ Specify Class: 1st, 2nd, or 3rd</li>
                <li>🎂 Provide Age</li>
                <li>👫 Number of Siblings/Spouses aboard</li>
                <li>👨‍👩‍👧 Number of Parents/Children aboard</li>
                <li>💰 Fare Paid range $0 - $512</li>
                <li>⚓ Port of Embarkation: C, Q, or S</li>
            </ul>
            <p>
                Once the details are entered, the app uses a Machine Learning model 🤖 to predict whether the passenger would have survived 🛟 or not.
                It also provides explanations 📖 and suggestions 💡 to help you understand the outcome.
            </p>
            <p>
                Explore, learn, and navigate through history! 🌊🧭
            </p>
        </div>

    );
}

export default WhatAppDoes;
