// api/get-data.js
export default async function handler(request, response) {
  // 1. Get the secret API key from Vercel's environment variables
  const apiKey = process.env.MY_SECRET_API_KEY; 

  // 2. Define the external API endpoint you want to call (e.g., OpenAI, Weather, etc.)
  const apiURL = `https://api.example.com/v1/data`; 

  try {
    // 3. Make the secure request from the backend server
    const apiResponse = await fetch(apiURL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await apiResponse.json();

    // 4. Send the clean data back to your frontend browser
    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({ error: 'Failed to fetch data safely' });
  }
}
