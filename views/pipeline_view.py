from models.pipeline_models import PipelineResponse


def render_pipeline_response(filename: str, mode: str, result: str | list[str] | dict) -> PipelineResponse:
    return PipelineResponse(filename=filename, mode=mode, result=result)
