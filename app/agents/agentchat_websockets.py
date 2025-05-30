from datetime import datetime
from tempfile import TemporaryDirectory
from websockets.sync.client import connect as ws_connect
import autogen
from autogen.io.websockets import IOWebsockets
from app.core.config import llm_config
from financial_group import run_group

def run_agents(initial_msg: str):
        # 2. Instantiate ConversableAgent
        # multiple agents have to have different llm_configs so fn's don't get added to all
        agent = autogen.ConversableAgent(
            name="chatbot",
            system_message="Complete a task given to you and reply TERMINATE when the task is done. If asked about the weather, use tool 'weather_forecast(city)' to get the weather forecast for a city.",
            llm_config=llm_config
        )

        # 3. Define UserProxyAgent
        user_proxy = autogen.UserProxyAgent(
            name="user_proxy",
            system_message="A proxy for the user.",
            is_termination_msg=lambda x: x.get("content", "") and x.get("content", "").rstrip().endswith("TERMINATE"),
            human_input_mode="NEVER",
            max_consecutive_auto_reply=10,
            code_execution_config=False,
        )

        # 4. Define Agent-specific Functions
        def weather_forecast(city: str) -> str:
            return f"The weather forecast for {city} at {datetime.now()} is sunny."

        autogen.register_function(
            weather_forecast, caller=agent, executor=user_proxy, description="Weather forecast for a city"
        )

        # 5. Initiate conversation
        print(
            f" - on_connect(): Initiating chat with agent {agent} using message '{initial_msg}'",
            flush=True,
        )
        user_proxy.initiate_chat(
            agent,
            message=initial_msg,
        )

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
            run_agents(initial_msg)
            # run_group()
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