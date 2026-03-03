from celery import shared_task
from .models import Memory
import time

@shared_task
def process_document(user_id, file_name, content):
    """
    Simulated document processing for RAG.
    In a real app, this would use LangChain/LlamaIndex + OpenAI/HuggingFace.
    """
    print(f"Processing document {file_name} for user {user_id}")
    
    # Simulate extraction and embedding
    time.sleep(5)
    
    # Create a memory entry
    Memory.objects.create(
        user_id=user_id,
        content=f"Processed content of {file_name}: {content[:100]}...",
        metadata={"source": file_name, "processed_at": time.time()}
    )
    
    return f"Document {file_name} processed successfully"
