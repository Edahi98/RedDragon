from pydantic import BaseModel


class PipelineResponse(BaseModel):
    filename: str
    mode: str
    result: str | list[str] | dict
