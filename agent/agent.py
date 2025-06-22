from typing import TypedDict, Annotated, Sequence

from langgraph.graph import StateGraph, START, END
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage, ToolMessage
from langgraph.prebuilt import ToolNode
from langgraph.graph.message import add_messages
from langchain_ollama import ChatOllama

from tools.create_job_posting import create_job_posting


class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

tools = [
    create_job_posting
    ]

llm = ChatOllama(model='qwen3').bind_tools(tools)

def chatbot(state: AgentState) -> AgentState:
    system_prompt = SystemMessage(content=f"""
    Eres un asistente de recursos humanos. Tienes acceso a diversas herramientas que te permiten actualizar el estado de los procesos de los postulantes, finalizar procesos, enviar correos y más.
    Los usuarios con los que interactuarás son postulantes o reclutadores que te dirán qué acción realizar. Según el contexto y tu comprensión del mensaje, decide cuál herramienta usar y con qué parámetros. Lee bien las descripciones y los campos requeridos de cada herramienta antes de usarlas.
    """)
    user_message = input('¿Qué te gustaría hacer?: ')
    print(f'Usuario: {user_message}')

    all_messages = [system_prompt] + list(state['messages']) + [HumanMessage(content=user_message)]

    response = llm.invoke(all_messages)

    print(f'AI: {response.content}')

    return {'messages': list(state['messages']) + [user_message, response]}

def should_continue(state: AgentState) -> str:
    """Determines if we should continue or end the conversation"""
    messages = state['messages']
    if not messages:
        return 'continue'

    for message in reversed(messages):
        if isinstance(message, ToolMessage) and 'completed' in message.content.lower():
            return 'end'

    return 'continue'

graph_builder = StateGraph(AgentState)
graph_builder.add_node('chatbot', chatbot)
graph_builder.add_node('tools', ToolNode(tools))

graph_builder.set_entry_point('chatbot')

graph_builder.add_edge('chatbot', 'tools')
graph_builder.add_conditional_edges(
    'tools',
    should_continue,
    {
        'continue': 'chatbot',
        'end': END
    }
)

graph = graph_builder.compile()

def print_messages(messages):
    for message in messages[-3:]:
        if isinstance(message, ToolMessage):
            print(f'Tool result: {message.content}')

def run_agent():
    state = {'messages': []}
    for step in graph.stream(state, stream_mode='values'):
        if 'messages' in step:
            print_messages(step['messages'])

if __name__ == '__main__':
    run_agent()