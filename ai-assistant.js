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
    chatHistory.push({ role: "user", parts: [{ text: userPrompt }] });

    try {
        const response = await fetch('/api/get-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ history: chatHistory })
        });

        const data = await response.json();
        
        // Extract the AI's reply text
        const aiReply = data.candidates[0].content.parts[0].text;

        // ✨ THE FIX: Save the model's reply to the history so it alternates perfectly!
        chatHistory.push({ role: "model", parts: [{ text: aiReply }] });

        return aiReply;

    } catch (error) {
        console.error("Error calling backend proxy:", error);
        return "Sorry, I'm having trouble connecting right now.";
    }
}
function sendQuickPrompt(text) {
  document.getElementById('chat-input').value = text;
  handleSendMessage();
}
