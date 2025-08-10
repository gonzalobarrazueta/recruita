from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import FastAPI, Request, Depends
from langchain_core.messages import ToolMessage, AIMessage, HumanMessage, SystemMessage
from starlette import status
from typing import Annotated
from sqlalchemy.orm import Session
from .database.database import Base, engine, get_db
from .agent import graph
from .models.messages import Messages
from .models.conversations import Conversations
from .routes import conversations, messages
from .services.conversations import get_or_create_conversation
from .services.embeddings import build_query_context, embed_text, store_embeddings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(conversations.router)
app.include_router(messages.router)

Base.metadata.create_all(bind=engine)

@app.post('/ask')
async def ask_agent(request: Request):
    try:
        data = await request.json()
        user_input = data.get('user_input')
        # Optional fields
        job_description = data.get('job_description')
        conversation_id = data.get('conversation_id')

        message_list = []

        if not user_input:
             return JSONResponse({'error': 'Missing user input field'}, status_code=status.HTTP_400_BAD_REQUEST)

        query_context = build_query_context(user_input, conversation_id)

        if query_context:
            message_list.append(
                SystemMessage(content=f"Mensajes relevantes:\n{query_context}")
            )

        if job_description:
            message_list.append(
                SystemMessage(content=f'Descripción del puesto de trabajo:\n{job_description}')
            )

        message_list.append(
            HumanMessage(content=user_input)
        )

        state = {
            'messages': message_list
        }

        final_response = None

        # Stream messages from the agent
        for step in graph.stream(state, stream_mode="values"):
            if 'messages' in step:
                step_messages = step['messages']

                for message in step_messages[-3:]:
                    if isinstance(message, ToolMessage):
                        print(f'Tool result: {message.content}')

                # Capture the last assistant message in the stream
                for msg in step_messages:
                    if isinstance(msg, AIMessage):
                        # Embed AI message and store it in Pinecone
                        store_embeddings(
                            embedding=embed_text(msg.content),
                            text=msg.content,
                            conversation_id=conversation_id
                        )

                        final_response = msg.content

        if final_response:
            return JSONResponse({"response": final_response})
        else:
            return JSONResponse({"error": "No response generated"}, status_code=500)

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
