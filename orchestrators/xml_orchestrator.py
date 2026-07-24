import os

from services.pdf_service import PdfService
from services.xmljava_service import XmlJavaService

ALLOWED_EXTENSIONS = {".doc", ".docx", ".xls", ".xlsx", ".pdf"}


class XmlOrchestrator:
    """Convierte doc, docx, xls, xlsx o pdf a XML, pasando primero por PdfService si es necesario."""

    def __init__(self):
        self.pdf_service = PdfService()
        self.xmljava_service = XmlJavaService()

    def get_xml(self, input_path: str) -> str:
        extension = os.path.splitext(input_path)[1].lower()

        if extension not in ALLOWED_EXTENSIONS:
            raise ValueError(f"Unsupported file type '{extension}'. Allowed: {sorted(ALLOWED_EXTENSIONS)}")

        if extension == ".pdf":
            input_path = self.pdf_service.convert_to_docx(input_path)

        return self.xmljava_service.convert(input_path)
