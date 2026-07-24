import os

from pdf2docx import Converter


class PdfService:
    """Convierte archivos PDF a DOCX."""

    def convert_to_docx(self, pdf_path: str, output_path: str | None = None) -> str:
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")

        if output_path is None:
            output_path = pdf_path.replace(".pdf", ".docx")

        converter = Converter(pdf_path)
        try:
            converter.convert(output_path)
        finally:
            converter.close()

        return output_path
