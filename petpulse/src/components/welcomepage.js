import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/therapy'); // Navigate to therapy page
  };

  return (
    <div>
      <h1>Welcome to PetPulse!</h1>
      <p>Click below to start your therapy session with a cat!</p>
      <button onClick={handleButtonClick}>Start Therapy</button>
    </div>
  );
};

export default WelcomePage;
