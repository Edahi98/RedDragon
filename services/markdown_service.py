import os
import re

from bs4 import BeautifulSoup


class MarkdownService:
    """Renderiza como Markdown un XML ya podado (la salida de `XmlService.prune_xml`).

    No filtra ni valida nada: asume que el XML que recibe ya contiene únicamente el
    contenido relevante. Su única responsabilidad es la representación en Markdown.
    """

    HEADER_PREFIX = "Columna"

    def _read_file(self, xml_path: str) -> str:
        if not os.path.exists(xml_path):
            raise FileNotFoundError(f"XML file not found: {xml_path}")

        with open(xml_path, "r", encoding="utf-8") as f:
            return f.read()

    def _build_soup(self, xml_content: str) -> BeautifulSoup:
        try:
            return BeautifulSoup(xml_content, "xml")
        except Exception:
            return BeautifulSoup(xml_content, "html.parser")

    def _cell_text(self, elem) -> str:
        # Una celda debe ocupar una sola línea y no puede contener `|` sin escapar,
        # o rompe la tabla al renderizarse.
        text = elem.get_text(separator=" ", strip=True)
        return re.sub(r"\s+", " ", text).replace("|", r"\|").strip()

    def _table_rows(self, table_elem) -> list[list[str]]:
        rows: list[list[str]] = []

        for row_elem in table_elem.find_all("Row"):
            cells = [self._cell_text(col_elem) for col_elem in row_elem.find_all("Col")]
            if any(cells):
                rows.append(cells)

        return rows

    def _pad(self, row: list[str], width: int) -> list[str]:
        # El podado elimina celdas sueltas, no filas completas, así que dos filas de la
        # misma tabla pueden llegar con distinta cantidad de `Col`. Markdown exige que
        # todas las filas tengan el mismo ancho, y el XML podado ya no conserva en qué
        # posición original estaba cada celda superviviente: lo único fiable es su orden
        # relativo. Por eso se rellena por la derecha — mantiene intacto ese orden y no
        # afirma una posición concreta para el hueco, que sería inventada.
        return row + [""] * (width - len(row))

    def _render_row(self, cells: list[str]) -> str:
        return "| " + " | ".join(cells) + " |"

    def _render_table(self, table_elem) -> str:
        rows = self._table_rows(table_elem)
        if not rows:
            return ""

        width = max(len(row) for row in rows)
        header = [f"{self.HEADER_PREFIX} {i + 1}" for i in range(width)]

        lines = [self._render_row(header), self._render_row(["---"] * width)]
        lines += [self._render_row(self._pad(row, width)) for row in rows]

        return "\n".join(lines)

    def _render_paragraph(self, paragraph_elem) -> str:
        text = paragraph_elem.get_text(separator=" ", strip=True)
        return re.sub(r"\s+", " ", text).strip()

    def to_markdown(self, xml_path: str) -> str:
        soup = self._build_soup(self._read_file(xml_path))

        blocks: list[str] = []
        for elem in soup.find_all(["Paragraph", "Table"]):
            block = self._render_table(elem) if elem.name == "Table" else self._render_paragraph(elem)
            if block:
                blocks.append(block)

        return "\n\n".join(blocks)
