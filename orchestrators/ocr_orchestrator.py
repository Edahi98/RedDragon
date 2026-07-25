from orchestrators.xml_orchestrator import XmlOrchestrator
from services.cross_encoder_service import CrossEncoderService
from services.markdown_service import MarkdownService
from services.nuextract_service import NuExtractService
from services.pipeline_service import PipelineService
from services.redactor_service import RedactorService
from services.tsubasa_service import TsubasaService
from services.xml_service import XmlService

ALLOWED_MODES = {"pruned_xml", "text_list"}


class OcrOrchestrator:
    """Orquesta el flujo completo: documento + pipeline -> XML -> Tsubasa -> resultado final."""

    def __init__(self):
        self.xml_orchestrator = XmlOrchestrator()
        self.xml_service = XmlService()
        self.markdown_service = MarkdownService()
        self.pipeline_service = PipelineService()
        self.tsubasa_service = TsubasaService()
        self.cross_encoder_service = CrossEncoderService()
        self.nuextract_service = NuExtractService()
        self.redactor_service = RedactorService()

    def run(
        self,
        input_path: str,
        pipeline: dict,
        mode: str,
        query: str | None = None,
        top_k: int | None = None,
        schema: dict | None = None,
    ) -> str | list[str] | dict:
        if mode not in ALLOWED_MODES:
            raise ValueError(f"Unsupported mode '{mode}'. Allowed: {sorted(ALLOWED_MODES)}")

        xml_path = self.xml_orchestrator.get_xml(input_path)

        extracted_data = self.xml_service.extract_tables(xml_path)
        pipeline = self.pipeline_service.replace_data(pipeline, extracted_data)

        result_data = self.tsubasa_service.execute(pipeline)

        if query:
            result_data = self.cross_encoder_service.rerank(query, result_data, top_k)

        if schema:
            pruned_path = self.xml_service.prune_xml(xml_path, result_data)
            markdown = self.markdown_service.to_markdown(pruned_path)
            prose = self.redactor_service.redact(markdown)
            return self.nuextract_service.extract(prose, schema)

        if mode == "pruned_xml":
            return self.xml_service.prune_xml(xml_path, result_data)

        return self.xml_service.extract_text(xml_path, result_data)
