import React, { useState, useEffect } from 'react';
import '../styles/catanimation.css';

const Therapy = () => {
    const [recognition, setRecognition] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [catResponse, setCatResponse] = useState('');
  
    useEffect(() => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
  
      if (!SpeechRecognition) {
        alert("Your browser doesn't support Speech Recognition.");
        return;
      }
  
      const recog = new SpeechRecognition();
      recog.continuous = true; // Keep recognizing
      recog.interimResults = true; // Get interim results
  
      recog.onstart = () => setIsListening(true);
      recog.onend = () => setIsListening(false);
      recog.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        setUserInput(transcriptResult); // Update the input with the transcript
      };
  
      setRecognition(recog);
    }, []);
  
    const startVoiceRecognition = () => {
      if (recognition) {
        setUserInput(''); // Clear previous input
        recognition.start();
      }
    };
  
    const stopVoiceRecognition = () => {
      if (recognition) {
        recognition.stop();
      }
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      // Handle the input submission
      console.log("User Input:", userInput);
      setCatResponse("That's interesting! Tell me more."); // Default response
      setUserInput(''); // Clear the input after submission
    };
  
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Therapy Session with Cat Therapist</h1>
        <img src='/assets/cat-therapist.png' alt="Cat Therapist" style={{ width: '300px', height: 'auto' }} />
        
        <div>
          <button onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your thoughts here"
            required
            style={{ width: '300px', marginRight: '10px' }}
          />
          <button type="submit">Submit</button>
        </form>
  
        {/* Display cat's response */}
        {catResponse && (
          <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
            Cat Therapist: {catResponse}
          </div>
        )}
      </div>
    );
  };
  
  export default Therapy;