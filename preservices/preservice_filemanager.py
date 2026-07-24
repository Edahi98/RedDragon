import tempfile
from contextlib import contextmanager
from pathlib import Path


class PreserviceFileManager:
    """Maneja la escritura y limpieza de archivos temporales antes de pasar por el pipeline."""

    @contextmanager
    def temp_input_file(self, contents: bytes, extension: str):
        with tempfile.TemporaryDirectory() as tmp_dir:
            input_path = str(Path(tmp_dir) / f"input{extension}")
            with open(input_path, "wb") as f:
                f.write(contents)

            yield input_path
