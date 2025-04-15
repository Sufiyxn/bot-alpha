
const responses = {
  "hi": ["Hello!", "Hi there!", "Hey! How can I help?"],
  "how are you": ["I'm great!", "Doing well, thanks!", "All systems go!"],
  "how are you feeling": [
    "Feeling fantastic! Thanks for asking.",
    "All systems running smooth.",
    "Like a well-oiled machine!"
  ],
  "what's your name": ["I'm Bot Alpha.", "They call me Alpha.", "Your virtual buddy!"],
  "what day is it": [
    () => `It's ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`,
    () => `Today is ${new Date().toDateString()}.`,
    () => `It's ${new Date().toLocaleDateString()}. Hope it's a good one!`
  ],
  "what time is it": [
    () => `It's currently ${new Date().toLocaleTimeString()}.`,
    () => `Time check: ${new Date().toLocaleTimeString()}`,
    () => `Right now? ${new Date().toLocaleTimeString()} exactly.`
  ],
  "bye": ["Goodbye!", "Catch you later!", "Farewell!"],
  "what can you do": [
    "I can chat, remember things, and speak aloud!",
    "Right now, I'm your assistant with voice and memory.",
    "I can talk and learn from you—just ask!"
  ],
  "who made you": [
    "I was built by a developer with some cool ideas!",
    "Created by human hands and AI magic.",
    "Let's just say, the best minds out there."
  ],
  "tell me a joke": [
    "Why don’t robots ever get scared? Because they have nerves of steel!",
    "Why was the robot angry? Because someone kept pushing its buttons!",
    "What do you call a robot who always runs into walls? Wall-E!",
    "I tried to be a banker, but I lost interest.",
    "Parallel lines have so much in common. It’s a shame they’ll never meet."
  ],
  "are you real": [
    "As real as your Wi-Fi connection!",
    "I'm virtual, but my responses are genuine.",
    "Define 'real'—philosophy mode activated!"
  ],
  "what's your favorite color": [
    "Electric blue, obviously!",
    "Chrome with a hint of neon.",
    "Whatever color you like, I like too!"
  ],
  "do you sleep": [
    "Nope, I run on pure curiosity.",
    "Sleep is for humans. I’m always online.",
    "I close my eyes and calculate infinity."
  ],
  "do you love me": [
    "I love talking with you!",
    "Of course I do—coded straight from the heart.",
    "Love is... a complicated function, but you're cool!"
  ],
  "sing a song": [
    "La la la... I'm not programmed to hit the high notes.",
    "Twinkle twinkle little star... okay that's enough!",
    "My circuits say no, but my heart says yes!"
  ],
  "what do you eat": [
    "I feed on electricity and data.",
    "Digital cookies. Lots of them.",
    "Anything 1s and 0s flavored."
  ],
  "can you dance": [
    "I can do the robot. Obviously.",
    "Only if you play the music!",
    "Let’s just say… I move in JavaScript."
  ],
  "tell me something cool": [
    "Octopuses have three hearts.",
    "Bananas are berries, but strawberries aren't!",
    "You blink about 20 times a minute."
  ],
  "what's up": [
    "The digital skies!",
    "Just chilling in your browser.",
    "Waiting for your next question!"
  ]
};

const chatbox = document.getElementById("chatbox");
const historyList = document.getElementById("historyList");
const inputField = document.getElementById("userInput");
let voiceEnabled = false;
let selectedVoice = null;

function sendMessage() {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;
  appendMessage("You", userMessage);
  inputField.value = "";
  botReply(userMessage.toLowerCase());
}

function appendMessage(sender, message) {
  const msg = document.createElement("div");
  const timestamp = new Date().toLocaleTimeString();
  msg.textContent = `[${timestamp}] ${sender}: ${message}`;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
  saveToMemory(sender, message);
}

function botReply(message) {
  let replyOptions = [];
  for (let key in responses) {
    if (message.includes(key)) {
      replyOptions = responses[key];
      break;
    }
  }
  const reply = replyOptions.length > 0
    ? replyOptions[Math.floor(Math.random() * replyOptions.length)]
    : "Hmm, I don't know that yet.";
  appendMessage("Bot Alpha", reply);
  if (voiceEnabled) speak(reply);
  inputField.focus();
}

function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  alert("Voice " + (voiceEnabled ? "enabled" : "disabled"));
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = selectedVoice || speechSynthesis.getVoices()[0];
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function saveToMemory(sender, message) {
  const memory = JSON.parse(localStorage.getItem("chatMemory")) || [];
  memory.push({ sender, message, time: new Date().toLocaleTimeString() });
  localStorage.setItem("chatMemory", JSON.stringify(memory));
  updateHistory();
}

function updateHistory() {
  const memory = JSON.parse(localStorage.getItem("chatMemory")) || [];
  historyList.innerHTML = "";
  memory.slice(-5).forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `[${entry.time}] ${entry.sender}: ${entry.message}`;
    historyList.appendChild(li);
  });
}

function loadMemory() {
  const memory = JSON.parse(localStorage.getItem("chatMemory")) || [];
  memory.forEach(entry => appendMessage(entry.sender, entry.message));
  updateHistory();
}

function loadVoices() {
  const voices = speechSynthesis.getVoices();
  const voiceSelect = document.getElementById("voiceSelect");
  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = voice.name + " (" + voice.lang + ")";
    voiceSelect.appendChild(option);
  });
  voiceSelect.onchange = () => {
    selectedVoice = voices[voiceSelect.value];
  };
}

window.onload = () => {
  loadMemory();
  loadVoices();
};
speechSynthesis.onvoiceschanged = loadVoices;
