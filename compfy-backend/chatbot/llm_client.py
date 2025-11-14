# chatbot/llm_client.py
from langchain_community.llms import Ollama

llm = Ollama(
    model="tinyllama",            
    base_url="http://localhost:11434"
)

def get_chat_response(user_input):
    prompt = f"You are Compfy's PC build assistant.\nUser says: {user_input}"
    return llm.invoke(prompt)
