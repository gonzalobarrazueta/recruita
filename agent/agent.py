from typing import TypedDict, Annotated, Sequence

from langgraph.graph import StateGraph, START, END
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage, ToolMessage
from langgraph.prebuilt import ToolNode
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI

from .tools.apply_to_job import apply_to_job
from .tools.create_job_posting import create_job_posting


class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

tools = [
    create_job_posting,
    apply_to_job
]

llm = ChatOpenAI(
    model='gpt-4o-mini',
    temperature=0
).bind_tools(tools)

def chatbot(state: AgentState) -> AgentState:
    system_prompt = SystemMessage(content=f"""
    Eres un asistente de recursos humanos. Tienes acceso a diversas herramientas que te permiten actualizar el estado de los procesos de los postulantes, finalizar procesos, enviar correos y más.
    Los usuarios con los que interactuarás son postulantes o reclutadores que te dirán qué acción realizar. Según el contexto y tu comprensión del mensaje, decide cuál herramienta usar y con qué parámetros. Lee bien las descripciones y los campos requeridos de cada herramienta antes de usarlas. Toda la conversación es es español, así que debes responder en ese idioma.
    """)

    all_messages = [system_prompt] + list(state['messages']) # + [HumanMessage(content=user_message)]

    response = llm.invoke(all_messages)

    return {'messages': list(state['messages']) + [response]}


def decide_next(state: AgentState) -> str:
    """ Determines if a tool needs to be called """
    messages = state['messages']

    if not messages:
        return 'end'

    last_message = messages[-1]

    if isinstance(last_message, AIMessage) and getattr(last_message, 'tool_calls', None):
        return 'tools'

    return 'end'


graph_builder = StateGraph(AgentState)

graph_builder.add_node('chatbot', chatbot)
graph_builder.add_node('tools', ToolNode(tools))

graph_builder.set_entry_point('chatbot')

graph_builder.add_conditional_edges(
    'chatbot',
    decide_next,
    {
        'tools': 'tools',
        'end': END
    }
)

graph_builder.add_edge('tools', 'chatbot')

graph = graph_builder.compile()
