# JARVIS - Browser Voice AI Assistant

JARVIS is a fully client-side voice AI assistant that runs entirely in the browser. It uses the Web Speech API for voice input/output and can handle Hindi/Hinglish commands. For non-direct commands, it calls the OpenAI API directly from the browser.

## Features

- 🎙️ Voice input using **SpeechRecognition**
- 🔊 Voice output using **SpeechSynthesis** (Hindi voice preferred)
- ✅ Hindi + Hinglish understanding
- 💬 Chat-style UI for conversations
- 🚀 Direct commands:
  - "YouTube chalao" → opens YouTube
  - "ChatGPT chalao" → opens ChatGPT
  - "search <text>" → Google search

## Project Files

```
index.html
style.css
config.js
script.js
README.md
```

## How to Run Locally

1. **Download or clone** this project.
2. Open `config.js` and add your OpenAI API key:
   ```js
   const OPENAI_API_KEY = "YOUR_KEY_HERE";
   ```
3. Open `index.html` in a modern browser (Chrome recommended).
4. Click the microphone button and start speaking.

> ⚠️ **Note:** Some browsers require HTTPS or localhost for speech recognition. If it doesn't work, use a simple local server.

### Optional: Run a Local Server

If speech recognition doesn't work with file://, use a local server:

```bash
# Python 3
python -m http.server 5500
```

Then open `http://localhost:5500` in your browser.

## Deploy on GitHub Pages

1. Create a new repository on GitHub and push these files.
2. Go to **Settings → Pages**.
3. Set the source branch to `main` and folder to `/root`.
4. Save. Your app will be live at:

```
https://<your-username>.github.io/<repo-name>/
```

## Security Reminder

This project calls the OpenAI API directly from the browser, which exposes your API key. For production use, use a backend proxy to keep the key safe.

---

Enjoy building with JARVIS! 🚀
