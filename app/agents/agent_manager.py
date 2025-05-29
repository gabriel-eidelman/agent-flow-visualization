from autogen import ConversableAgent, LLMConfig
from app.core.config import llm_config

# Sequential chat full stack demo

curriculum_message = """You are a curriculum designer for a fourth grade class. Nominate an appropriate a topic for a lesson, based on the given subject."""

# Lesson planner
planner_message = """You are a classroom lesson agent.
Given a topic, write a lesson plan for a fourth grade class in bullet points. Include the title, learning objectives, and script.
"""

# Formatter
formatter_message = """You are a lesson plan formatter. Format the complete plan as follows:
<title>Lesson plan title</title>
<learning_objectives>Key learning objectives</learning_objectives>
<script>How to introduce the topic to the kids</script>
"""

# Teacher who initiates the chats
teacher_message = """You are a classroom teacher.
You decide topics for lessons and work with a lesson planner, you provide one round of feedback on their lesson plan.
Then you will work with a formatter to get a final output of the lesson plan.
"""

summary_system_message = """
You are a class planning summary assistant that generates a structured summary of the class plan.
Analyze the full conversation and generate a summary which includes the main_topic of the class
and the class_schedule (a str giving details regarding the blocking of the class eg first 15 minutes
example, next 10 minutes class discussion etc)
"""

def run_agent():
    with llm_config:
        lesson_curriculum = ConversableAgent(
            name="curriculm_agent",
            system_message=curriculum_message,
        )

        lesson_planner = ConversableAgent(
            name="planner_agent",
            system_message=planner_message,
        )

        lesson_formatter = ConversableAgent(
            name="formatter_agent",
            system_message=formatter_message,
        )

        teacher = ConversableAgent(
            name="teacher_agent",
            system_message=teacher_message,
        )

    chat_results = teacher.initiate_chats(
        [
            {
                "recipient": lesson_curriculum,
                "message": "Let's create a science lesson, what's a good topic?",
                "max_turns": 1,
                "summary_method": "last_msg",
            },
            {
                "recipient": lesson_planner,
                "message": "Create a lesson plan.",
                "max_turns": 2, # One revision
                "summary_method": "last_msg",
            },
            {
                "recipient": lesson_formatter,
                "message": "Format the lesson plan.",
                "max_turns": 1,
                "summary_method": "last_msg",
            },
        ]
    )
    summary_response = chat_results[2].summary
    return summary_response