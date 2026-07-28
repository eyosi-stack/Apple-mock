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
async function callGeminiAPI(userPrompt, retries = 2) {
  const API_KEY = "hidien";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

  // Push user prompt to history
  chatHistory.push({ role: "user", parts: [{ text: userPrompt }] });

  const payload = {
    system_instruction: {
      parts: [
        {
          text: "You are an expert Apple Genius assistant on the official Apple website. Keep responses concise, friendly, and structured."
        }
      ]
    },
    contents: chatHistory
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Auto-retry on temporary 503 server overload
    if (response.status === 503 && retries > 0) {
      await new Promise(res => setTimeout(res, 1000));
      return callGeminiAPI(userPrompt, retries - 1);
    }

    const data = await response.json();

    if (!response.ok) {
      chatHistory.pop(); // Remove failed prompt from history
      return `API Error ${response.status}: ${data.error?.message || 'Check request'}`;
    }

    const replyText = data.candidates[0].content.parts[0].text;
    
    // Push AI reply to history for multi-turn chat memory
    chatHistory.push({ role: "model", parts: [{ text: replyText }] });

    return replyText;

  } catch (err) {
    chatHistory.pop();
    return "Network error. Please check your internet connection.";
  }
}
function sendQuickPrompt(text) {
  document.getElementById('chat-input').value = text;
  handleSendMessage();
}