from fastapi import FastAPI
from app.api.api_manager import chat

app = FastAPI()
app.post("/chat")(chat)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)

# uvicorn app.main:app --reload
