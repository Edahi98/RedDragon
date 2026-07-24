import os
import subprocess
import time

import requests

BINARY_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "resources", "tsubasa")


class TsubasaService:
    """Levanta el binario resources/tsubasa (servidor) y le envía el JSON del pipeline.

    Singleton: el proceso del binario debe iniciarse una sola vez junto con el
    servidor de RedDragon y detenerse cuando este se apaga.
    """

    _instance: "TsubasaService | None" = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, host: str | None = None, port: int | None = None):
        if getattr(self, "_initialized", False):
            return

        self.host = host or os.environ.get("TSUBASA_HOST", "127.0.0.1")
        self.port = port or int(os.environ.get("TSUBASA_PORT", 5000))
        self._process: subprocess.Popen | None = None
        self._initialized = True

    def start(self) -> None:
        if not os.path.exists(BINARY_PATH):
            raise FileNotFoundError(f"tsubasa binary not found: {BINARY_PATH}")

        self._process = subprocess.Popen(
            [BINARY_PATH, "--host", self.host, "--port", str(self.port)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        self._wait_until_ready()

    def _wait_until_ready(self, timeout: float = 30.0) -> None:
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            try:
                requests.get(f"http://{self.host}:{self.port}/", timeout=1)
                return
            except requests.exceptions.ConnectionError:
                time.sleep(0.5)

        raise TimeoutError(f"tsubasa server did not become ready on {self.host}:{self.port}")

    def stop(self) -> None:
        if self._process is not None:
            self._process.terminate()
            self._process.wait()
            self._process = None

    def execute(self, pipeline: dict) -> list:
        response = requests.post(f"http://{self.host}:{self.port}/execute", json=pipeline)
        response.raise_for_status()
        return self._flatten_values(response.json())

    def _flatten_values(self, result: dict) -> list:
        if "outputs" in result:
            values: list = []
            for payload in result["outputs"].values():
                values.extend(self._payload_values(payload))
            return values

        if "series" in result:
            return self._payload_values(result["series"])

        if "dataframe" in result:
            return self._payload_values(result["dataframe"])

        return [result]

    def _payload_values(self, payload: dict) -> list:
        if "values" in payload:
            return list(payload["values"])

        if "data" in payload:
            values: list = []
            for row in payload["data"]:
                values.extend(row.values())
            return values

        return []
