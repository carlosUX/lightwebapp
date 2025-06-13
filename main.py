from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "https://yourfrontenddomain.com"],  # Allow frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# API credentials from environment variables
AI_FOUNDRY_API_KEY = os.getenv("AI_FOUNDRY_API_KEY")
AI_FOUNDRY_ENDPOINT = os.getenv("AI_FOUNDRY_ENDPOINT")

@app.post("/generate/")
async def generate(request: Request):
    data = await request.json()
    prompt = data.get("prompt")

    headers = {
        "Authorization": f"Bearer {AI_FOUNDRY_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "messages": [
            {"role": "system", "content": "You are an AI that generates wireframes."},
            {"role": "user", "content": prompt}
        ]
    }
    
    response = requests.post(AI_FOUNDRY_ENDPOINT, json=payload, headers=headers)

    print("API Response:", response.text)  # Debugging log

    try:
        result = response.json()
        return {"message": result}
    except:
        return {"message": "Error processing AI response!"}

