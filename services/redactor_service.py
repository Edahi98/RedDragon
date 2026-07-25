import os

from transformers import AutoModelForCausalLM, AutoTokenizer

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models_ai", "Qwen2.5-0.5B-Instruct")

SYSTEM_PROMPT = (
    "Redactas en prosa fluida y natural el contenido de una tabla en Markdown, usando "
    "exactamente los valores de cada fila (texto, número, fecha o cualquier otro tipo de dato), "
    "sin inventar ni omitir ningún valor, columna ni dato adicional. Una fila puede tener "
    "cualquier cantidad de columnas. "
    "Escribe una oración conectada y natural por fila, en su propia línea — no una lista "
    "mecánica de 'Columna 1 es X, Columna 2 es Y' ni fórmulas repetitivas como 'corresponde a'. "
    "Las columnas vienen etiquetadas genéricamente (Columna 1, Columna 2, Columna 3...). Si la "
    "primera fila de datos contiene palabras cortas que parecen ser el nombre real de cada "
    "columna, úsalas al redactar en vez de la etiqueta genérica, y no la describas como un dato "
    "más. Si ninguna fila parece encabezado, no menciones las etiquetas genéricas de columna en "
    "absoluto. "
    "No inventes ningún dato, descripción, opinión, diálogo ni contexto que no esté literalmente "
    "en la tabla (nada de personajes, apariencia física, emociones ni historias de ficción). Solo "
    "redacta con fluidez los datos reales tal cual aparecen. "
    "Si el texto recibido no es una tabla sino un párrafo normal, repítelo tal cual, sin "
    "modificarlo ni resumirlo."
)

EXAMPLE_TABLE_WITH_HEADER = (
    "| Columna 1 | Columna 2 |\n| --- | --- |\n| PRODUCTO | PRECIO |\n| Manzana | 10 |\n| Pan | 5 |"
)
EXAMPLE_PROSE_WITH_HEADER = "Manzana tiene un precio de 10.\nPan tiene un precio de 5."

EXAMPLE_TABLE_NO_HEADER = (
    "| Columna 1 | Columna 2 |\n| --- | --- |\n| ALMA CHONTAL | F |\n| RICARDO AVILA | M |"
)
EXAMPLE_PROSE_NO_HEADER = "ALMA CHONTAL tiene asociado el valor F.\nRICARDO AVILA tiene asociado el valor M."

EXAMPLE_TABLE_NO_HEADER_MULTI = (
    "| Columna 1 | Columna 2 | Columna 3 |\n| --- | --- | --- |\n"
    "| 2024-01-05 | Compra | 1500 |\n| 2024-02-10 | Venta | 800 |"
)
EXAMPLE_PROSE_NO_HEADER_MULTI = (
    "El 2024-01-05 se registró Compra con un valor de 1500.\nEl 2024-02-10 se registró Venta con un valor de 800."
)

EXAMPLE_PARAGRAPH = "Este documento fue generado el 12 de marzo de 2024 por el departamento de finanzas."
EXAMPLE_PARAGRAPH_PROSE = "Este documento fue generado el 12 de marzo de 2024 por el departamento de finanzas."


class RedactorService:
    """Redacta texto narrativo a partir de contenido en Markdown (tablas), para que un
    modelo extractivo (NuExtract) tenga menos ambigüedad al alinear columna y valor.

    Singleton: el modelo es costoso de cargar, así que se carga una sola vez
    y se reutiliza durante toda la vida del proceso.
    """

    _instance: "RedactorService | None" = None

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

    def redact(self, markdown: str) -> str:
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": EXAMPLE_TABLE_WITH_HEADER},
            {"role": "assistant", "content": EXAMPLE_PROSE_WITH_HEADER},
            {"role": "user", "content": EXAMPLE_TABLE_NO_HEADER},
            {"role": "assistant", "content": EXAMPLE_PROSE_NO_HEADER},
            {"role": "user", "content": EXAMPLE_TABLE_NO_HEADER_MULTI},
            {"role": "assistant", "content": EXAMPLE_PROSE_NO_HEADER_MULTI},
            {"role": "user", "content": EXAMPLE_PARAGRAPH},
            {"role": "assistant", "content": EXAMPLE_PARAGRAPH_PROSE},
            {"role": "user", "content": markdown},
        ]
        prompt = self.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)

        input_ids = self.tokenizer(prompt, return_tensors="pt")
        output_ids = self.model.generate(**input_ids, max_new_tokens=1024, do_sample=False)

        output = self.tokenizer.decode(
            output_ids[0][input_ids["input_ids"].shape[1] :], skip_special_tokens=True
        )
        return output.strip()
