import React from "react";
import './BoxStyles.css';

function TechnologiesUsed() {
    return (
        <div className="info-box">
            <h2>🛠️ Technologies Used & Tools </h2>
            <ul>
                <li>⚛️ React.js – Frontend UI</li>
                <li>⚡ Vite – Development environment & bundler</li>
                <li>🐍 Python & Django – Backend API & logic</li>
                <li>🤖 Scikit-learn – ML model for Titanic survival prediction</li>
                <li>🌐 Axios – API calls & data fetching</li>
                <li>🧩 LangChain – LLM workflow & processing</li>
                <li>🗺️ LangGraph – Visual graph for AI pipelines</li>
                <li>🧠 ChatGroq llama-3 – Language model for chat interactions</li>
                <li>🛠️ Postman – API testing & debugging</li>
                <li>📚 Pandas & NumPy – Data manipulation & analysis (used in model training)</li>
                <li>🔍 Jupyter Notebooks – (used in for building)</li>
                <li>💻 Git & GitHub – Version control & collaboration</li>
                <li>🌍 RESTful API – Communication between frontend and backend</li>
                <li>📦 npm – Package management for JavaScript</li>
                <li>📝 Markdown – Documentation & README files</li>


            </ul>
        </div>

    );
}

export default TechnologiesUsed;
