from tempfile import TemporaryDirectory
from websockets.sync.client import connect as ws_connect
from autogen.io.websockets import IOWebsockets
from app.core.config import llm_config
from app.agents.financial_group import run_group
from app.agents.tech_support_group import tech_support_group
from app.agents.heirerarchical_research import research_group

def on_connect(iostream: IOWebsockets) -> None:
    print(f" - on_connect(): Connected to client using IOWebsockets {iostream}", flush=True)

    while True:
        print(" - on_connect(): Receiving message from client.", flush=True)

        # 1. Receive Initial Message
        initial_msg = iostream.input()
        print(f"{initial_msg=}")
        if(initial_msg=="TERMINATE"):
            break
        try:
            # run_weather_agents(llm_config, initial_msg)
            # run_group(llm_config)
            tech_support_group(llm_config, initial_msg)
            # research_group(llm_config, initial_msg)
            
        except Exception as e:
            print(f" - on_connect(): Exception: {e}", flush=True)
            raise e
    

# TESTING WEBSOCKET

def test_websockets():
    with IOWebsockets.run_server_in_thread(on_connect=on_connect, port=8765) as uri:
        print(f" - test_setup() with websocket server running on {uri}.", flush=True)

        with ws_connect(uri) as websocket:
            print(f" - Connected to server on {uri}", flush=True)

            print(" - Sending message to server.", flush=True)
            # websocket.send("2+2=?")
            websocket.send("Check out the weather in Paris and write a poem about it.")

            while True:
                try:
                    message = websocket.recv()
                    message = message.decode("utf-8") if isinstance(message, bytes) else message

                    print(message)

                    # if "TERMINATE" in message:
                    #     print()
                    #     print(" - Received TERMINATE message. Exiting.", flush=True)
                    #     break
                except Exception as e:
                    print("Connection closed:", e, flush=True)
                    break