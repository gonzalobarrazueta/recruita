from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import FastAPI, Request
from langchain_core.messages import ToolMessage, AIMessage, HumanMessage
from starlette import status
from .database.database import Base, engine
from .agent import graph
from .models.messages import Messages
from .models.conversations import Conversations
from .routes import conversations

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(conversations.router)

Base.metadata.create_all(bind=engine)

@app.post('/ask')
async def ask_agent(request: Request):
    try:
        data = await request.json()
        user_input = data.get('user_input')

        if not user_input:
            return JSONResponse({'error': 'Missing user input'}, status_code=status.HTTP_400_BAD_REQUEST)

        state = {
            'messages': [
                HumanMessage(content=user_input)
            ]
        }

        final_response = None

        # Stream messages from the agent
        for step in graph.stream(state, stream_mode="values"):
            if "messages" in step:
                messages = step["messages"]

                for message in messages[-3:]:
                    if isinstance(message, ToolMessage):
                        print(f'Tool result: {message.content}')

                # Capture the last assistant message in the stream
                for msg in messages:
                    if isinstance(msg, AIMessage):
                        final_response = msg.content

        if final_response:
            return JSONResponse({"response": final_response})
        else:
            return JSONResponse({"error": "No response generated"}, status_code=500)

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
