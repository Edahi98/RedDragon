import os

from sentence_transformers import CrossEncoder

MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), "models_ai", "jina-reranker-v2-base-multilingual"
)


class CrossEncoderService:
    """Reordena una lista de candidatos por relevancia semántica frente a una query.

    Singleton: el modelo (jina-reranker-v2-base-multilingual) es costoso de cargar,
    así que se carga una sola vez y se reutiliza durante toda la vida del proceso.
    """

    _instance: "CrossEncoderService | None" = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if getattr(self, "_initialized", False):
            return

        self.model = CrossEncoder(
            MODEL_PATH,
            automodel_args={"torch_dtype": "auto"},
            trust_remote_code=True,
        )
        self._initialized = True

    def rerank(self, query: str, candidates: list, top_k: int | None = None) -> list:
        if not candidates:
            return []

        pairs = [[query, str(candidate)] for candidate in candidates]
        scores = self.model.predict(pairs)

        ranked = sorted(zip(candidates, scores), key=lambda pair: pair[1], reverse=True)
        ranked_candidates = [candidate for candidate, _score in ranked]

        if top_k is not None:
            return ranked_candidates[:top_k]

        return ranked_candidates
