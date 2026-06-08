document.addEventListener('DOMContentLoaded', function() {

  // Dark/Light Mode Toggle
  const btn = document.getElementById('toggleMode');
  btn.addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
      btn.textContent = '☀️ Light';
    } else {
      btn.textContent = '🌙 Dark';
    }
  });

  // Scroll Animation
  const cards = document.querySelectorAll('.card');
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  });
  cards.forEach(function(card) {
    observer.observe(card);
  });

  // Chat Widget
  const chatBubble = document.getElementById('chatBubble');
  const chatBox = document.getElementById('chatBox');
  const closeChat = document.getElementById('closeChat');
  const sendBtn = document.getElementById('sendBtn');
  const userInput = document.getElementById('userInput');
  const chatMessages = document.getElementById('chatMessages');

  chatBubble.addEventListener('click', function() {
    chatBox.style.display = 'flex';
  });

  closeChat.addEventListener('click', function() {
    chatBox.style.display = 'none';
  });

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.classList.add(type);
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage(message, 'user-message');
    userInput.value = '';
    addMessage('Thinking... 🤖', 'bot-message');

    try {
      const response = await fetch('/.netlify/functions/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ message: message })
});

const data = await response.json();
const botReply = data.reply;

chatMessages.removeChild(chatMessages.lastChild);
addMessage(botReply, 'bot-message');

    } catch (error) {
      chatMessages.removeChild(chatMessages.lastChild);
      addMessage('Sorry, something went wrong! 😅', 'bot-message');
    }
  }

  sendBtn.addEventListener('click', sendMessage);

  userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
  });

});