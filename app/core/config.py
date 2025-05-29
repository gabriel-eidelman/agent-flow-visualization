import os
from autogen import LLMConfig
from pydantic import BaseModel

# FILL IN WITH YOUR CREDENTIALS
llm_config = LLMConfig(
	config_list=[
		{
			"api_type": "azure",
			"api_key": os.environ["OPENAI_API_KEY"],
			"api_version": "2024-12-01-preview",
			"base_url": "https://gabriel-azure-oai.openai.azure.com/",
			"model": "gpt-4o-mini", 
		}
	],
	temperature=0.7
)
