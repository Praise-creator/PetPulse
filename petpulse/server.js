const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

app.post('/api/chat', async (req, res) => {
    const userInput = req.body.userInput; 

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'user',
                        content: `Respond like you are a therapist (only say therapist parts) and I am your patient. Engage in meaningful conversation. Don't just answer once.ask questions and keep a flowing conversation. Remember, a key part of therapy is letting the patient talk more, so be concise in your answers until you feel it is time to suggest help or stuff to do eventually youll need to pivot and start talking about how to actually help, so dont just keep asking questions indefinately. remember youre not an actual therapist so if the situation becomes very severe reccomend the person to a real therapist. Be human-like in your response. You can add filler like "hmm" or "mmm nut dont overdo it.OK?" Here is my message: ${userInput}`
                    }
                ]
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data); // Send the response back to the client
    } catch (error) {
        console.error('Error fetching AI response:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
