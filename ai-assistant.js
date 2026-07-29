  // DOM Elements
const chatToggle = document.getElementById('ai-chat-toggle');
const chatBox = document.getElementById('ai-chat-box');
const closeBtn = document.getElementById('chat-close-btn');
const sendBtn = document.getElementById('chat-send-btn');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

// UI Toggle Listeners
chatToggle.addEventListener('click', () => chatBox.classList.toggle('chat-hidden'));
closeBtn.addEventListener('click', () => chatBox.classList.add('chat-hidden'));

sendBtn.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSendMessage();
});

// Quick prompt suggestions
function sendQuickPrompt(text) {
  chatInput.value = text;
  handleSendMessage();
}

async function handleSendMessage() {
  const userText = chatInput.value.trim();
  if (!userText) return;

  appendMessage(userText, 'user');
  chatInput.value = '';

  const loadingMsg = appendMessage('Thinking...', 'assistant');

  try {
    const aiResponse = await callGeminiAPI(userText);
    loadingMsg.textContent = aiResponse;
  } catch (error) {
    loadingMsg.textContent = "Sorry, I'm having trouble connecting right now.";
    console.error(error);
  }
}

function appendMessage(text, sender) {
  const msgElement = document.createElement('div');
  msgElement.classList.add('message', sender);
  msgElement.textContent = text;
  chatMessages.appendChild(msgElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msgElement;
}

// Conversation History Array
let chatHistory = [];

// Gemini API Function
async function callGeminiAPI(userPrompt) {
  // 1. Push user prompt to history just like you did before
  chatHistory.push({ role: "user", parts: [{ text: userPrompt }] });

  try {
    // 2. Fetch from YOUR backend proxy instead of Google directly
    const response = await fetch('/api/get-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send the chat history down to your serverless backend
      body: JSON.stringify({ history: chatHistory })
    });

    const data = await response.json();
    
    // 3. Return the text response coming back from your backend proxy
    // (Adjust this line if needed depending on how your message element reads the return value)
    return data.candidates[0].content.parts[0].text; 

  } catch (error) {
    console.error("Error calling backend proxy:", error);
    return "Sorry, I'm having trouble connecting right now.";
  }
}
function sendQuickPrompt(text) {
  document.getElementById('chat-input').value = text;
  handleSendMessage();
}
