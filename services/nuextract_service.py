import json
import os

from transformers import AutoModelForCausalLM, AutoTokenizer

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models_ai", "NuExtract-tiny")


class NuExtractService:
    """Extrae datos estructurados de un texto siguiendo un esquema JSON (numind/NuExtract-tiny).

    Singleton: el modelo es costoso de cargar, así que se carga una sola vez
    y se reutiliza durante toda la vida del proceso.
    """

    _instance: "NuExtractService | None" = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if getattr(self, "_initialized", False):
            return

        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        self.model = AutoModelForCausalLM.from_pretrained(MODEL_PATH)
        self.model.eval()
        self._initialized = True

    def extract(self, text: str, schema: dict) -> dict:
        schema_str = json.dumps(schema, indent=4)
        prompt = f"<|input|>\n### Template:\n{schema_str}\n### Text:\n{text}\n<|output|>\n"

        input_ids = self.tokenizer(prompt, return_tensors="pt", truncation=True, max_length=4000)
        output_ids = self.model.generate(**input_ids)
        output = self.tokenizer.decode(output_ids[0], skip_special_tokens=True)

        output_json = output.split("<|output|>")[1].split("<|end-output|>")[0]
        return json.loads(output_json)
