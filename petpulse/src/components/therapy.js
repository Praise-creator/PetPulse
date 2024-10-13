import React, { useState, useEffect, useRef } from 'react';
import { fetchAIResponse } from '../api/openai.js';
import { jsPDF } from 'jspdf'; 
import html2canvas from 'html2canvas'; 
import '../styles/catanimation.css';
import { FaMicrophone, FaCog } from 'react-icons/fa'; 

const Therapy = () => {
    const [recognition, setRecognition] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [catResponse, setCatResponse] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const chatEndRef = useRef(null); // Ref to manage auto-scrolling
    const [isTyping, setIsTyping] = useState(false); // For typing animation
    const [petMood, setPetMood] = useState('neutral'); // Mood of the pet, controlling expression changes
    const [isTTSOn, setIsTTSOn] = useState(true); // State for text-to-speech toggle
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser doesn't support Speech Recognition.");
            return;
        }

        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;

        recog.onstart = () => setIsListening(true);
        recog.onend = () => {
            setIsListening(false);
            handleSubmit();
        };
        recog.onresult = (event) => {
            const current = event.resultIndex;
            const transcriptResult = event.results[current][0].transcript;
            setUserInput(transcriptResult);
        };

        setRecognition(recog);

        const greetingMessage = "Hey! I'm your pet therapist. How are you feeling today?";
        setChatHistory([{ type: 'ai', text: greetingMessage }]);
    }, []);

    // Autoscroll to the bottom whenever chatHistory updates
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory]);

    const startVoiceRecognition = () => {
        if (recognition) {
            setUserInput('');
            recognition.start();
        }
    };

    const stopVoiceRecognition = () => {
        if (recognition) {
            recognition.stop();
        }
    };

    const handleSubmit = async (event) => {
        if (event) event.preventDefault();
    
        if (!userInput.trim()) return;
    
        // Add user message immediately
        setChatHistory(prevHistory => [
            ...prevHistory,
            { type: 'user', text: userInput }
        ]);
    
        setUserInput('');
        setIsTyping(true); // Start typing animation
        setPetMood('thinking'); // Change pet's mood to thinking
    
        // Simulate typing animation delay
        setTimeout(async () => {
            const aiResponse = await fetchAIResponse(userInput);
            setIsTyping(false); // Stop typing animation
            setPetMood('happy'); // Set mood based on response
            setCatResponse(aiResponse);
    
            setChatHistory(prevHistory => [
                ...prevHistory,
                { type: 'ai', text: aiResponse }
            ]);
    
            // Trigger Text-to-Speech if enabled
            if (isTTSOn) {
                const utterance = new SpeechSynthesisUtterance(aiResponse);
                window.speechSynthesis.speak(utterance); // Speak the response
            }
        }, 1000); // Typing bubbles duration
    };

    const generateReport = async () => {
        const chatSummary = await fetchAIResponse(createSummaryPrompt(chatHistory));

        const pdf = new jsPDF();
        pdf.setFontSize(12);
        pdf.setFont("courier", "normal"); 

        // Add a title
        pdf.text("Therapy Session Report", 20, 20);
        pdf.setFont("courier", "italic");
        pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
        pdf.setFont("courier", "normal");

        // Add chat history and summary, scaling text to fit the page
        let yOffset = 40; 
        chatHistory.forEach(message => {
            const text = message.type === 'user' ? `User: ${message.text}` : `Therapist: ${message.text}`;
            const lines = pdf.splitTextToSize(text, 180); // Dynamically adjust text width
            lines.forEach(line => {
                if (yOffset >= 280) { // New page when out of space
                    pdf.addPage();
                    yOffset = 20;
                }
                pdf.text(line, 20, yOffset);
                yOffset += 10;
            });
        });

        // Add the summary at the end
        if (yOffset >= 280) { pdf.addPage(); yOffset = 20; }
        pdf.text("Summary:", 20, yOffset);
        yOffset += 10;
        const summaryLines = pdf.splitTextToSize(chatSummary, 180);
        summaryLines.forEach(line => {
            if (yOffset >= 280) { pdf.addPage(); yOffset = 20; }
            pdf.text(line, 20, yOffset);
            yOffset += 10;
        });

        pdf.save('therapy_report.pdf');
    };

    const createSummaryPrompt = (history) => {
        const messages = history.map(message => {
            return message.type === 'user' ? `User: ${message.text}` : `Therapist: ${message.text}`;
        }).join('\n');
        
        return `Based on the following conversation, generate a summary in the style of therapist notes:\n\n${messages}`;
    };

    const toggleTTS = () => {
        setIsTTSOn(prevState => !prevState);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    return (
        <div style={{ textAlign: 'center', margin: '20px', position: 'relative' }}>
            <h1>Therapy Session with Cat Therapist</h1>
            <img 
                src={`/assets/cat-therapist.png`} 
                alt="Cat Therapist" 
                style={{ width: '300px', height: 'auto' }} 
            />
            {/* Settings Icon */}
            <div style={{ position: 'absolute', top: '20px', right: '-460px' }}>
                <FaCog style={{ cursor: 'pointer' }} onClick={toggleSidebar} />
            </div>

            {/* Sidebar */}
            {isSidebarOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '250px',
                    height: '100%',
                    backgroundColor: 'white',
                    boxShadow: '-2px 0 5px rgba(0,0,0,0.5)',
                    padding: '20px',
                    zIndex: 1000,
                    transition: 'transform 0.3s ease',
                }}>
                    <h2>Settings</h2>
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '10px' }}>Text-to-Speech:</span>
                            <button
                                onClick={toggleTTS}
                                style={{
                                    width: '40px',
                                    height: '20px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    backgroundColor: isTTSOn ? 'green' : 'grey',
                                    color: 'white',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: '0',
                                    left: isTTSOn ? '20px' : '0',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    transition: 'left 0.3s ease'
                                }} />
                            </button>
                        </label>
                    </div>
                    <button onClick={toggleSidebar} style={{ marginTop: '20px' }}>Close</button>
                </div>
            )}

            {/* Chat History */}
            <div style={{ height: '270px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '20px', borderRadius: '10px' }}>
                {chatHistory.map((message, index) => (
                    <div key={index} style={{ textAlign: message.type === 'user' ? 'right' : 'left' }}>
                        <SpeechBubble text={message.text} />
                    </div>
                ))}
                {isTyping && (
                    <div className="typing">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* User Input Section */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your message..."
                        style={{ width: '300px', padding: '10px', borderRadius: '5px', marginRight: '10px' }}
                    />
                    <button type="submit" style={{ padding: '10px', borderRadius: '5px', marginLeft: '-1px' }}>Send</button>
                    <FaMicrophone 
                        onClick={isListening ? stopVoiceRecognition : startVoiceRecognition} 
                        style={{ cursor: 'pointer', fontSize: '24px', marginLeft: '10px' }} 
                    />
                </form>
            </div>

            {/* Generate Report Button */}
            <button onClick={generateReport} style={{ marginTop: '20px' }}>
                Generate Report
            </button>
        </div>
    );
};

const SpeechBubble = ({ text }) => {
    return (
        <div style={{
            display: 'inline-block',
            padding: '10px',
            borderRadius: '10px',
            backgroundColor: '#f1f1f1',
            marginBottom: '10px',
            maxWidth: '80%',
            position: 'relative'
        }}>
            {text}
        </div>
    );
};

export default Therapy;
