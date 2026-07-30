// api/get-data.js
export default async function handler(request, response) {
    // 1. Get the secret API key from Vercel's environment variables
    const apiKey = process.env.MY_SECRET_API_KEY;

    // 2. Define the real Google Gemini API endpoint using your key
    const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        // 3. Forward the incoming chat history from your frontend down to Gemini
        const apiResponse = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contents: request.body.history })
        });

        const data = await apiResponse.json();

        // 4. Send the clean data back to your frontend browser
        return response.status(200).json(data);
        
    } catch (error) {
        console.error("Backend error:", error);
        return response.status(500).json({ error: 'Failed to fetch data safely' });
    }
}
