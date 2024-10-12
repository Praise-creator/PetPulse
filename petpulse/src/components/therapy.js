import React, { useState } from 'react';
import '../styles/catanimation.css';

const TherapyPage = () => {
  const [response, setResponse] = useState("");

  const handleTextInput = (e) => {
    const userInput = e.target.value;
    // Simple mock-up response logic, replace with more advanced response later
    setResponse(`You said: ${userInput}. Let's breathe together!`);
  };

  return (
    <div className="therapy-page">
      <h2>Your Cat Therapist</h2>
      <div className="cat-container">
        <img src="/assets/cat-therapist.png" alt="Cat Therapist" className="cat-therapist" />
      </div>
      <div className="input-section">
        <input type="text" placeholder="How are you feeling?" onBlur={handleTextInput} />
      </div>
      <div className="response-section">
        <p>{response}</p>
      </div>
    </div>
  );
};

export default TherapyPage;
