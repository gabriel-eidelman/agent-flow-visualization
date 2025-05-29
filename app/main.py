from fastapi import FastAPI
from app.api.api_manager import chat
from autogen.io.websockets import IOWebsockets
from app.agents.agentchat_websockets import on_connect
import threading

app = FastAPI()
app.post("/chat")(chat)

def start_ws_server():
    with IOWebsockets.run_server_in_thread(on_connect=on_connect, port=8765) as uri:
        print(f"WebSocket server is running on {uri}")

if __name__ == "__main__":
    import uvicorn
    # Start websocket server in a background thread
    threading.Thread(target=start_ws_server, daemon=True).start()
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)


# uvicorn app.main:app --reload
