# Productive vs Unproductive Web Classifier

A browser extension and local NLP inference service that classifies any visited webpage — including YouTube, streaming sites, long articles, and dynamically loaded content — as productive or unproductive.  

This project combines a fully custom-trained DistilBERT model with a real-time Chrome extension that scrapes page text, sends it to a local FastAPI backend, and displays instant classification results.

---

## Features

### • Full-site text extraction
Extracts text from:
- Standard websites
- Infinite-scroll pages
- Streaming platforms
- YouTube (via transcript or DOM parsing)
- Dynamically loaded content

### • Local Transformer inference
- Fine-tuned DistilBERT binary classifier
- Local FastAPI server (no cloud, no limits)
- Fast inference using PyTorch + safetensors

### • Chrome extension (Manifest V3)
- Scrapes active tab content
- Sends text to local API
- Displays productivity scores with a clean UI
- Tracks tab usage time
- Stores last classification results

### • Custom dataset
Built from:
- Wikipedia educational pages  
- Reddit entertainment feeds  
- YouTube transcripts (250+ per class)  
- Cleaned, filtered, balanced binary dataset  

---

## Architecture

Browser Tab → Content Script → Extracted Text → Chrome Extension UI
↓
Local HTTP POST
↓
FastAPI Model Server
↓
DistilBERT Classification
↓
Productive / Unproductive

yaml
Copy code

---

## Local Setup

### 1. Clone Repository
git clone https://github.com/<yourusername>/<repo-name>
cd <repo-name>

shell
Copy code

### 2. Install Backend Dependencies
pip install -r requirements.txt

shell
Copy code

### 3. Start FastAPI Server
uvicorn app:app --host 0.0.0.0 --port 9000

arduino
Copy code

Server will run at:
http://localhost:9000/predict

yaml
Copy code

---

## Testing API

curl -X POST "http://localhost:9000/predict"
-H "Content-Type: application/json"
-d '{"text": "I studied machine learning today"}'

yaml
Copy code

Expected response:
{
"productive": 0.94,
"unproductive": 0.06
}

yaml
Copy code

---

## Chrome Extension Setup

1. Go to `chrome://extensions/`
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select the `gl_ext` folder
5. Keep FastAPI server running

---

## Folder Structure

repo/
│
├── app.py # FastAPI backend
├── requirements.txt
├── model/ # DistilBERT model files
│ ├── config.json
│ ├── model.safetensors
│ ├── tokenizer.json
│ └── vocab.txt
│
├── gl_ext/ # Chrome Extension
│ ├── manifest.json
│ ├── popup.html
│ ├── popup.js
│ ├── background.js
│ ├── content.js
│ └── icons/
│
└── README.md

yaml
Copy code

---

## Why I Built This

Understanding the quality of digital consumption is complicated.  
This tool makes it measurable.

By combining NLP, browser scripting, and real-time content extraction, this project becomes an always-on reflection of how productive my browsing behavior actually is.

---

## License
MIT
