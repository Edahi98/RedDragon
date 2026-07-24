import os
import subprocess

BINARY_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "resources", "xmljava-docker")


class XmlJavaService:
    """Ejecuta el binario resources/xmljava-docker para convertir un archivo de entrada a XML."""

    def convert(self, input_path: str, output_path: str | None = None) -> str:
        if not os.path.exists(BINARY_PATH):
            raise FileNotFoundError(f"xmljava-docker binary not found: {BINARY_PATH}")

        if not os.path.exists(input_path):
            raise FileNotFoundError(f"Input file not found: {input_path}")

        if output_path is None:
            output_path = os.path.splitext(input_path)[0] + ".xml"

        result = subprocess.run(
            [BINARY_PATH, input_path, output_path],
            capture_output=True,
            text=True,
        )

        if result.returncode != 0:
            raise RuntimeError(f"xmljava-docker failed: {result.stderr.strip()}")

        return output_path
