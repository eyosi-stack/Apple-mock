// api/get-data.js
export default async function handler(request, response) {
    try {
        // 1. Get the secret API key from Vercel's environment variables
        const apiKey = process.env.MY_SECRET_API_KEY;

        // 2. Define the exact v1beta gemini-flash-latest endpoint
        const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

        // 3. Build the payload matching your local configuration exactly
        const payload = {
            system_instruction: {
                parts: [
                    {
                        text: "You are an expert Apple Genius assistant on the official Apple website. Keep responses concise, friendly, and structured."
                    }
                ]
            },
            contents: request.body.history
        };

        // 4. Send the structured request down to the Gemini API
        const apiResponse = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await apiResponse.json();

        // 5. Send the clean data back to your frontend browser
        return response.status(200).json(data);
    } catch (error) {
        console.error("Backend error:", error);
        return response.status(500).json({ error: 'Failed to fetch data safely' });
    }
}
