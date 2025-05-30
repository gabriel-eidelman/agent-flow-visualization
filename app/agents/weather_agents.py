import autogen
from datetime import datetime

def run_weather_agents(llm_config, initial_msg: str):
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