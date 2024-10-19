import os
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import ConversationChain
from langchain.chains.conversation.memory import ConversationBufferMemory
from langchain_core.messages import SystemMessage

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("Google API Key not found in environment variables")

# Initialize the Google Generative AI model
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    temperature=0.5,
    max_tokens=150,
    timeout=5,
    max_retries=2,
)

# Initialize conversation memory
memory = ConversationBufferMemory()
conversation = ConversationChain(
    llm=llm,
    verbose=True,
    memory=memory
)

# Define the schema for the task input
class TaskInput(BaseModel):
    title: str
    description: str

# Task generator logic
def create_task_prompt(task_input: TaskInput):
    system_prompt = (
        "You are a task assistant. Based on the given task title and description, generate a helpful and structured response."
        f" Task Title: {task_input.title}. "
        f" Task Description: {task_input.description}. "
        "Generate a response with clear guidance, next steps, or suggestions on how to proceed with the task."
    )
    return system_prompt

# Function to generate AI response based on task input
def generate_task_response_logic(task_input: TaskInput) -> str:
    # Clear memory for each new task input
    memory.chat_memory.clear()

    # Create a system prompt based on task title and description
    system_prompt = create_task_prompt(task_input)
    memory.chat_memory.add_message(SystemMessage(content=system_prompt))

    # Generate the AI response
    conversation = ConversationChain(llm=llm, verbose=False, memory=memory)
    ai_response = conversation.predict(input="")  # Empty input triggers the response based on memory
    
    return ai_response