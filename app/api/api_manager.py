from fastapi import Request  # You can delete FastAPI and APIRouter
from app.agents.agent_manager import run_agent

# Just a standalone route handler
async def chat():
    # data = await request.json()
    # user_input = data.get("input")
    result = run_agent()
    return {"response": result}