# 🧠 Productive vs Unproductive Web Classifier

> **A real-time browser intelligence system that knows whether you're learning or procrastinating — before you do.**

An AI-powered Chrome extension that classifies every webpage you visit using a custom-trained DistilBERT model running entirely on your machine. No cloud. No tracking. Just instant, honest feedback about your digital habits.

---

## ✨ What Makes This Different

This isn't just another productivity timer. It's a **semantic understanding engine** that reads the actual content of what you're consuming — YouTube transcripts, infinite-scroll feeds, long-form articles, streaming platforms — and tells you whether it aligns with your goals.

**The result?** Real-time awareness of how you spend your attention.

---

## 🎯 Features

### 🔍 **Intelligent Content Extraction**
Extracts meaningful text from virtually any web page:
- **Standard websites** — articles, blogs, documentation
- **Infinite-scroll feeds** — social media, news aggregators
- **Video platforms** — YouTube transcripts and DOM parsing
- **Streaming sites** — content metadata and descriptions
- **Dynamic SPAs** — React, Vue, Angular applications

### 🤖 **Local Transformer Inference**
- Fine-tuned **DistilBERT** binary classifier (productive vs. unproductive)
- Runs on a **local FastAPI server** — your data never leaves your machine
- Fast PyTorch inference with optimized **safetensors** format
- No API keys, no rate limits, no compromises

### 🎨 **Chrome Extension (Manifest V3)**
- **One-click classification** of any active tab
- Clean, minimal UI with instant productivity scores
- **Tab usage tracking** — see how long you've been on each page
- **Persistent history** — stores your last classifications locally
- Built with modern Chrome Extension standards

### 📊 **Custom Training Dataset**
Trained on a carefully curated, balanced dataset:
- **Wikipedia** educational pages (500+ articles)
- **Reddit** entertainment feeds (250+ threads)
- **YouTube** transcripts (250+ videos per class)
- Cleaned, tokenized, and balanced for optimal performance

---

## 🏗️ Architecture

```
┌─────────────┐
│ Browser Tab │
└──────┬──────┘
       │ (scrapes content)
       ▼
┌──────────────────┐
│  Content Script  │
└──────┬───────────┘
       │ (extracts text)
       ▼
┌──────────────────┐
│  Extension UI    │
└──────┬───────────┘
       │ (HTTP POST)
       ▼
┌──────────────────┐
│ FastAPI Server   │
│  localhost:9000  │
└──────┬───────────┘
       │ (inference)
       ▼
┌──────────────────┐
│ DistilBERT Model │
└──────┬───────────┘
       │
       ▼
   📈 Result:
   Productive / Unproductive
```

---

## 🚀 Quick Start

### **1. Clone the Repository**

```bash
git clone https://github.com/<yourusername>/<repo-name>
cd <repo-name>
```

### **2. Install Backend Dependencies**

```bash
pip install -r requirements.txt
```

> **Requirements:** Python 3.8+, PyTorch, Transformers, FastAPI, Uvicorn

### **3. Start the FastAPI Server**

```bash
uvicorn app:app --host 0.0.0.0 --port 9000
```

✅ **Server running at:** `http://localhost:9000/predict`

---

## 🧪 Test the API

```bash
curl -X POST "http://localhost:9000/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "I studied machine learning algorithms and neural networks today"}'
```

**Expected Response:**

```json
{
  "productive": 0.94,
  "unproductive": 0.06
}
```

---

## 🎨 Install Chrome Extension

1. Navigate to `chrome://extensions/`
2. Enable **Developer Mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the `gl_ext/` folder from this repository
5. **Keep the FastAPI server running** in the background

🎉 **You're ready!** Click the extension icon on any page to see its productivity score.

---

## 📁 Project Structure

```
repo/
│
├── app.py                    # FastAPI inference server
├── requirements.txt          # Python dependencies
│
├── model/                    # Fine-tuned DistilBERT model
│   ├── config.json
│   ├── model.safetensors
│   ├── tokenizer.json
│   └── vocab.txt
│
├── gl_ext/                   # Chrome Extension (Manifest V3)
│   ├── manifest.json         # Extension configuration
│   ├── popup.html            # UI interface
│   ├── popup.js              # UI logic
│   ├── background.js         # Service worker
│   ├── content.js            # Page content extraction
│   └── icons/                # Extension icons
│
└── README.md                 # You are here
```

---

## 💡 Why This Exists

**Digital consumption is invisible.**

You can track screen time, block websites, and set timers — but none of that tells you whether what you're reading is actually valuable. This tool changes that.

By combining:
- **Natural Language Processing** — understanding semantic content
- **Browser automation** — real-time page scraping
- **Local inference** — privacy-first, zero-latency classification

...this project becomes an **always-on mirror** of your digital behavior.

It's not about judgment. It's about **awareness**.

---

## 🔮 Future Enhancements

- [ ] **Per-category breakdown** (learning, entertainment, news, social)
- [ ] **Daily productivity reports** with charts
- [ ] **Focus mode** — auto-block unproductive sites
- [ ] **Ollama integration** — run Llama 3 for even smarter classification
- [ ] **Mobile support** — Android/iOS companion apps

---

## 🤝 Contributing

Pull requests welcome! If you have ideas for:
- Better content extraction methods
- Improved model architectures
- UI/UX enhancements
- Dataset expansion

...open an issue or submit a PR.

---

## 📄 License

MIT License — feel free to fork, modify, and build on this project.

---

## 🙏 Acknowledgments

Built with:
- **Hugging Face Transformers** — model training and inference
- **FastAPI** — high-performance API framework
- **Chrome Extensions API** — browser integration
- **PyTorch** — deep learning backbone

---

**Made with curiosity, caffeine, and a desire to understand where attention really goes.**

⭐ **Star this repo if it helped you understand your browsing habits better.**
