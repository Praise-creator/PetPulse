const API_URL = 'http://localhost:5000/api/chat'; // Update this URL

export const fetchAIResponse = async (userInput) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput }), // Send userInput in request body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content; // Returns the AI's response
    } catch (error) {
        console.error('Error fetching AI response:', error);
        return "I'm sorry, I couldn't get a response from the AI.";
    }
};
