import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/welcomepage.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/therapy'); 
  };

  return (
    <div>
      <h1>Welcome to PetPulse!</h1>
      <p>Click below to start a therapy session with a pet!</p>
      <button onClick={handleButtonClick}>Start </button>
    </div>
  );
};

export default WelcomePage;
