import os
from autogen import LLMConfig
from pydantic import BaseModel

# FILL IN WITH YOUR CREDENTIALS
llm_config = LLMConfig(
    api_type="openai",                      # The provider
    model="gpt-4o-mini",                    # The specific model
    api_key=os.environ["OPENAI_API_KEY"],   # Authentication
)
