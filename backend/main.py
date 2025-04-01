from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import torch
import requests
from bs4 import BeautifulSoup
from typing import Optional
import json

app = FastAPI(title="Wrong News API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the model
model_name = "facebook/roberta-hate-speech-dynabench-r4-target"
classifier = pipeline("text-classification", model=model_name)

class ArticleRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None

def extract_text_from_url(url: str) -> str:
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        text = soup.get_text()
        # Break into lines and remove leading/trailing space
        lines = (line.strip() for line in text.splitlines())
        # Break multi-headlines into a line each
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        # Drop blank lines
        text = ' '.join(chunk for chunk in chunks if chunk)
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching URL: {str(e)}")

@app.post("/api/analyze")
async def analyze_article(request: ArticleRequest):
    if not request.text and not request.url:
        raise HTTPException(status_code=400, detail="Either text or URL must be provided")
    
    if request.url:
        text = extract_text_from_url(request.url)
    else:
        text = request.text

    # Analyze the text
    results = classifier(text)
    
    # Process results
    analysis = {
        "text": text[:500] + "..." if len(text) > 500 else text,  # Truncate for response
        "results": results,
        "summary": {
            "is_fake": results[0]["label"] == "hate",
            "confidence": results[0]["score"],
            "details": "This article appears to be potentially misleading or false." if results[0]["label"] == "hate" else "This article appears to be legitimate."
        }
    }
    
    return analysis

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "model": model_name} 