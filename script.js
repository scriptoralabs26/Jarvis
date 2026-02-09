// JARVIS Voice AI Assistant
// Uses Web Speech API for speech recognition and synthesis.

const statusText = document.getElementById("statusText");
const chat = document.getElementById("chat");
const micButton = document.getElementById("micButton");
const themeToggle = document.getElementById("themeToggle");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognitionSupported = !!SpeechRecognition;
let recognition = null;
let isListening = false;

// Create a new chat bubble in the UI
function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message message--${type}`;

  const bubble = document.createElement("div");
  bubble.className = "message__bubble";
  bubble.textContent = text;

  message.appendChild(bubble);
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

// Update status pill text
function updateStatus(text) {
  statusText.textContent = text;
}

// Speak text using SpeechSynthesis with a Hindi voice if available
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hi-IN";

  const voices = window.speechSynthesis.getVoices();
  const hindiVoice = voices.find((voice) => voice.lang === "hi-IN");
  if (hindiVoice) {
    utterance.voice = hindiVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// Normalize the command text
function normalize(text) {
  return text.toLowerCase().trim();
}

// Handle commands that open URLs directly
function handleDirectCommands(command) {
  if (command.includes("youtube chalao") || command.includes("यूट्यूब चलाओ")) {
    window.open("https://www.youtube.com", "_blank");
    return "YouTube खोल रहा हूँ.";
  }

  if (command.includes("chatgpt chalao") || command.includes("चैटजीपीटी चलाओ")) {
    window.open("https://chat.openai.com", "_blank");
    return "ChatGPT खोल रहा हूँ.";
  }

  if (command.startsWith("search ")) {
    const query = command.replace("search ", "").trim();
    if (query) {
      const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.open(url, "_blank");
      return `"${query}" के लिए खोज रहा हूँ.`;
    }
    return "कृपया search के बाद कुछ बोलें.";
  }

  return null;
}

// Call OpenAI API for other commands
async function askOpenAI(prompt) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_API_KEY_HERE") {
    return "कृपया config.js में अपना OpenAI API key जोड़ें.";
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are JARVIS, a helpful voice assistant. Reply concisely in Hindi or Hinglish.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", errorText);
      return "माफ़ कीजिए, अभी जवाब नहीं मिल सका.";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "कोई जवाब नहीं मिला.";
  } catch (error) {
    console.error("OpenAI fetch failed:", error);
    return "नेटवर्क समस्या आ गई है.";
  }
}

// Process the speech input
async function handleCommand(text) {
  addMessage(text, "user");

  const command = normalize(text);
  const directResponse = handleDirectCommands(command);
  if (directResponse) {
    addMessage(directResponse, "assistant");
    speak(directResponse);
    return;
  }

  updateStatus("Thinking...");
  const aiResponse = await askOpenAI(text);
  addMessage(aiResponse, "assistant");
  speak(aiResponse);
  updateStatus("Ready to listen.");
}

// Start speech recognition
function startListening() {
  if (!recognitionSupported) {
    updateStatus("Speech recognition is not supported in this browser.");
    return;
  }

  if (isListening) {
    recognition.stop();
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "hi-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening = true;
    micButton.classList.add("listening");
    updateStatus("Listening...");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    handleCommand(transcript);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    updateStatus("Error: " + event.error);
  };

  recognition.onend = () => {
    isListening = false;
    micButton.classList.remove("listening");
    updateStatus("Ready to listen.");
  };

  recognition.start();
}

// Theme toggle helper
function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.dataset.theme !== "light";
  if (isDark) {
    root.dataset.theme = "light";
    root.style.setProperty("--bg", "#f5f7fb");
    root.style.setProperty("--card", "#ffffff");
    root.style.setProperty("--text", "#1f2937");
    root.style.setProperty("--muted", "#6b7280");
    root.style.setProperty("--border", "rgba(15, 23, 42, 0.12)");
    themeToggle.textContent = "☀️";
  } else {
    root.dataset.theme = "dark";
    root.style.setProperty("--bg", "#0e0f13");
    root.style.setProperty("--card", "#1a1c24");
    root.style.setProperty("--text", "#f5f5f7");
    root.style.setProperty("--muted", "#a1a1aa");
    root.style.setProperty("--border", "rgba(255, 255, 255, 0.08)");
    themeToggle.textContent = "🌙";
  }
}

micButton.addEventListener("click", startListening);

themeToggle.addEventListener("click", toggleTheme);

// Populate an initial assistant greeting
addMessage("नमस्ते! मैं JARVIS हूँ. आप क्या जानना चाहेंगे?", "assistant");

if (!recognitionSupported) {
  updateStatus("Speech recognition is not supported in this browser. Try Chrome.");
}

// Warm up voices list for some browsers
window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};
