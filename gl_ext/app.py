# app.py — FULL RADAR LOGGING VERSION
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import time

MODEL_PATH = r"C:\my_notebook\eda\results\checkpoint-462"

print("\n===================================")
print("🔥 PRODUCTIVITY AI SERVER STARTING")
print("===================================\n")

print("[1] Loading model...")
t0 = time.time()

tokenizer = DistilBertTokenizer.from_pretrained(MODEL_PATH)
model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()

print(f"[✔] Model loaded in {time.time() - t0:.2f}s")
print(f"[✔] Device: {'CUDA' if torch.cuda.is_available() else 'CPU'}")
print("\n===================================\n")

app = FastAPI()

# ---- DATA CLASSES ----


class PredictRequest(BaseModel):
    text: str


class TabEvent(BaseModel):
    url: str
    page_type: str  # "youtube" or "webpage"


# ---- ROUTES ----


@app.post("/tab-event")
async def tab_event(event: TabEvent):
    print("\n🟦 TAB EVENT RECEIVED")
    print(f"URL: {event.url}")
    print(f"TYPE: {event.page_type.upper()}")
    print("====================================")
    return {"status": "logged"}


@app.post("/predict")
async def predict(req: PredictRequest):

    print("\n📥 SCRAPE RECEIVED")
    print("--------------------------------")
    preview = req.text[:200].replace("\n", " ")
    print(f"Scraped text (first 200 chars):\n{preview}")

    print("\n[2] Tokenizing...")
    inputs = tokenizer(req.text, return_tensors="pt", truncation=True, max_length=512)

    t_inf = time.time()
    print("[3] Running model inference...")

    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1)[0]

    dt = time.time() - t_inf
    print(f"⚡ Inference time: {dt:.3f}s")
    print(f"📊 Productive: {probs[0]:.4f}")
    print(f"📛 Unproductive: {probs[1]:.4f}")
    print("====================================\n")

    return {"productive": float(probs[0]), "unproductive": float(probs[1])}


@app.get("/health")
async def health():
    print("💓 HEALTH CHECK")
    return {"status": "OK"}


if __name__ == "__main__":
    print("🚀 Server running at http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)
