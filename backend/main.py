import copy

from fastapi import FastAPI, Depends, APIRouter, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from core.chat_history.chat_history import ChatHistory
from core.llms.base_llm import BaseLLM
from core.llms.llm_factory import LLMFactory
from core.prompts.agent_prompt import AGENT_PROMPT
from core.tools import tool_registry
from core.tracing.tracer_factory import TracerFactory
from core.utilities.config import Config
from core.utilities.stream_events import serialize_stream_events

config = Config()
tracer = TracerFactory(config).create_tracer()
llm_config = config.get_llm_config("main")
fallback_llm_config = config.get_llm_config("fallback")



def get_main_llm():
    llm = LLMFactory.create_llm(llm_type=llm_config["type"], config=llm_config)
    llm.bind_tools(tool_registry)
    return llm

def get_fallback_llm():
    llm = LLMFactory.create_llm(llm_type=fallback_llm_config["type"], config=fallback_llm_config)
    llm.bind_tools(tool_registry)
    return llm


#TODO: change this to a persistent DB
sessions = {}
def get_chat_history(session_id: str) -> ChatHistory:
    """Get or create a new chat history for the session.
    The system prompt will be added by the agent when it runs."""
    if session_id not in sessions:
        sessions[session_id] = ChatHistory()
    return sessions[session_id]


router = APIRouter()

async def get_generator(llm, fallback_llm, chat_history):
    clean_chat_history = copy.deepcopy(chat_history)

    try:
        async for event in llm.async_stream_inference(chat_history):
            yield event
    except Exception as e:
        print(f"Error with main LLM: {str(e)}")
        async for event in fallback_llm.async_stream_inference(clean_chat_history):
            yield event



class QueryRequest(BaseModel):
    query: str = Query(..., description="The query to be sent to the agent")
    session_id: str = Query(..., description="The session ID to be used for the query")


@router.post("/query")
@router.get("/query")
async def query_endpoint(payload: QueryRequest = Depends(), llm: BaseLLM = Depends(get_main_llm), fallback_llm: BaseLLM = Depends(get_fallback_llm)):
    """
    Query the agent with a text input.
    """
    headers = {
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    }

    session_id = payload.session_id
    query = payload.query

    _ = tracer.start_trace(
        name="User Query",
        session_id=session_id,
        input=query
    )

    chat_history = get_chat_history(session_id)

    if not chat_history.messages:
        chat_history.add_system_message(AGENT_PROMPT)

    chat_history.add_user_message(query)

    generator = get_generator(llm, fallback_llm, chat_history)
    serialized_generator = serialize_stream_events(generator)
    return EventSourceResponse(serialized_generator, headers=headers)




@router.get("/")
def healthcheck():
    print("Healthcheck")
    return {"response": "OK"}


app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:8080",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)
