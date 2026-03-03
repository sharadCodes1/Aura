import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f"chat_{self.conversation_id}"

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        
        # Start simulated AI streaming
        asyncio.create_task(self.stream_response())

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def stream_response(self):
        # 1. Send simulated agent trace
        traces = [
            {"id": "t1", "step": "Searching knowledge base...", "status": "success", "tool": "knowledge", "timestamp": "2024-03-03T10:00:00Z"},
            {"id": "t2", "step": "Synthesizing answer...", "status": "success", "tool": "think", "timestamp": "2024-03-03T10:00:05Z"}
        ]
        
        for trace in traces:
            await asyncio.sleep(1)
            await self.send(text_data=json.dumps({
                "type": "trace",
                "message_id": "assistant-" + self.conversation_id, # Mock ID
                "step": trace
            }))

        # 2. Send token stream
        message = "Indeed! I've analyzed your request and AURA is ready to assist. Based on the local context, I should proceed with the following actions."
        tokens = message.split(' ')
        
        for token in tokens:
            await asyncio.sleep(0.1)
            await self.send(text_data=json.dumps({
                "type": "token",
                "token": token + " "
            }))

        # 3. Finalize
        await self.send(text_data=json.dumps({
            "type": "token",
            "done": True
        }))

    async def chat_message(self, event):
        # Receive message from room group
        await self.send(text_data=json.dumps(event['message']))
