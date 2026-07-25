# 🐉 RedDragon

> 🏷️ **Categoría:** Intelligent Document Processing (IDP) platform con motor de pipelines de datos embebido.

**RedDragon es la unión de todo**: es el servicio que **consume** a **[TsubasaEngine](https://github.com/Edahi98/TsubasaEngine)** (el motor de ejecución) y a **[Denki Pipeline Designer](https://github.com/Edahi98/DenkiPepelineDesigner)** (de donde viene la lógica de extracción de documentos) — ambos existen como piezas pensadas para ser integradas por RedDragon, no como alternativas o proyectos paralelos.

Un único endpoint (`POST /execute_pipeline`) recibe un documento (`doc`, `docx`, `xls`, `xlsx`, `pdf`) y un pipeline en JSON, y hace de punta a punta lo siguiente:

1. 📄 **Extracción** — convierte el documento a XML (`xmljava`) y, si hace falta, pasa antes por PDF → DOCX.
2. 🔀 **Inyección de datos** — el contenido extraído reemplaza los nodos `"data"` del pipeline.
3. 🪽 **Ejecución** — el pipeline ya completo corre contra **[Tsubasa](https://github.com/Edahi98/TsubasaEngine)** (Polars + scikit-learn + Bokeh sobre un AST), el mismo motor (`tsubasa.exe`) que arranca Denki.
4. ✂️ **Resultado** — el resultado de Tsubasa se usa para podar el XML original o para filtrar su texto, según el `mode` pedido.

Incluye además un frontend mínimo en **React + Vite + TailwindCSS** para probar ese flujo end-to-end sin necesidad del canvas visual de Denki.

![Entorno de pruebas de RedDragon](docs/assets/test-environment.png)

---

## 📐 Arquitectura

RedDragon sigue una **arquitectura en capas estilo MVC**, con dos capas intermedias (`preservices` y `orchestrators`) entre el controller y los services de bajo nivel. Cada capa solo llama hacia abajo, nunca al revés.

```mermaid
graph TD
    Client["🌐 Cliente / Frontend React"] -->|"multipart/form-data<br/>file + pipeline + mode"| Controller

    subgraph API["⚙️ Backend FastAPI"]
        Controller["🎮 controllers/<br/>pipeline_controller.py"]
        Preservice["📁 preservices/<br/>preservice_filemanager.py"]
        Orchestrator["🧭 orchestrators/<br/>ocr_orchestrator.py"]
        XmlOrch["🧭 orchestrators/<br/>xml_orchestrator.py"]
        Services["🔧 services/<br/>pdf · xmljava · xml · pipeline · tsubasa · cross_encoder · nuextract"]
        Model["📦 models/<br/>pipeline_models.py"]
        View["🖼️ views/<br/>pipeline_view.py"]
    end

    Controller --> Preservice
    Controller --> Orchestrator
    Orchestrator --> XmlOrch
    Orchestrator --> Services
    XmlOrch --> Services
    Controller --> View
    View --> Model
    Controller -->|"PipelineResponse (JSON)"| Client

    Services -->|"subprocess"| BinJava["📄 resources/xmljava-docker"]
    Services -->|"HTTP :5000"| BinTsubasa["📊 resources/tsubasa"]
```

### Flujo de `POST /execute_pipeline`

```mermaid
sequenceDiagram
    autonumber
    participant U as 🧑 Cliente
    participant C as 🎮 pipeline_controller
    participant FM as 📁 PreserviceFileManager
    participant OCR as 🧭 OcrOrchestrator
    participant XO as 🧭 XmlOrchestrator
    participant PDF as 🔧 PdfService
    participant XJ as 🔧 XmlJavaService
    participant XS as 🔧 XmlService
    participant MD as 🔧 MarkdownService
    participant PS as 🔧 PipelineService
    participant TS as 🔧 TsubasaService
    participant CE as 🧠 CrossEncoderService
    participant RD as 🧠 RedactorService
    participant NE as 🧩 NuExtractService

    U->>C: file + pipeline (json) + mode [+ query, top_k] [+ schema]
    C->>FM: temp_input_file(contents, extension)
    FM-->>C: input_path (temporal)
    C->>OCR: run(input_path, pipeline, mode)
    OCR->>XO: get_xml(input_path)
    alt extensión .pdf
        XO->>PDF: convert_to_docx(pdf_path)
        PDF-->>XO: docx_path
    end
    XO->>XJ: convert(input_path)
    XJ-->>OCR: xml_path
    OCR->>XS: extract_tables(xml_path)
    XS-->>OCR: extracted_data
    OCR->>PS: replace_data(pipeline, extracted_data)
    PS-->>OCR: pipeline transformado
    OCR->>TS: execute(pipeline)
    TS-->>OCR: result_data (lista de valores)
    opt query presente
        OCR->>CE: rerank(query, result_data, top_k)
        CE-->>OCR: result_data reordenado/filtrado
    end
    alt schema presente
        OCR->>XS: prune_xml(xml_path, result_data)
        XS-->>OCR: ruta xml podado
        OCR->>MD: to_markdown(ruta xml podado)
        MD-->>OCR: texto en markdown (párrafos + tablas)
        OCR->>RD: redact(markdown)
        RD-->>OCR: prosa
        OCR->>NE: extract(prosa, schema)
        NE-->>OCR: JSON estructurado (reemplaza el resultado de mode)
    else mode == pruned_xml
        OCR->>XS: prune_xml(xml_path, result_data)
        XS-->>OCR: ruta xml podado
    else mode == text_list
        OCR->>XS: extract_text(xml_path, result_data)
        XS-->>OCR: lista de strings
    end
    OCR-->>C: resultado final
    C-->>U: 200 PipelineResponse
```

📄 Detalle extendido en [`docs/architecture.md`](docs/architecture.md).

---

## 🗂️ Estructura del proyecto

```
RedDragon/
├── main.py                   # 🚀 bootstrap: FastAPI + lifespan + uvicorn
├── controllers/               # 🎮 rutas HTTP
├── preservices/                # 📁 manejo de archivos temporales
├── orchestrators/               # 🧭 coordinan varios services
├── services/                     # 🔧 lógica atómica (pdf, xml, xmljava, pipeline, tsubasa)
├── models/                        # 📦 schemas Pydantic
├── views/                          # 🖼️ formato de respuesta
├── resources/                       # 📄 binarios (xmljava-docker, tsubasa)
├── models_ai/                        # 🧠 modelos de Hugging Face (no versionado, ver abajo)
├── scripts/start.sh                  # 🐧 arranque nativo en Linux (sin Docker)
├── docs/architecture.md               # 📚 arquitectura detallada
├── frontend/                            # ⚛️ React + Vite + TailwindCSS
│   └── src/
│       ├── components/{atoms,molecules,organisms,templates}/  # 🧩 Atomic Design
│       ├── hooks/                                                # 🪝 lógica reutilizable
│       ├── data/                                                  # 📋 listas/config estáticos
│       └── pages/                                                  # 📄 páginas
└── Dockerfile                                                        # 🐳 build multi-etapa
```

---

## ✅ Requisitos

- 🐍 Python ≥ 3.11 + [`uv`](https://docs.astral.sh/uv/)
- 🟢 Node.js + npm (solo para el frontend)
- 🐳 Docker (opcional, recomendado)
- 🐧 Linux (los binarios en `resources/` son ELF; en Windows solo funcionan dentro de Docker/WSL)
- 🧠 Los modelos de IA locales (ver [🧠 Modelo de reranking](#-modelo-de-reranking-cross-encoder) y [🧩 Modelo de extracción estructurada](#-modelo-de-extracción-estructurada-nuextract) abajo)

---

## 🧠 Modelo de reranking (cross-encoder)

`services/cross_encoder_service.py` usa el modelo **[jina-reranker-v2-base-multilingual](https://huggingface.co/jinaai/jina-reranker-v2-base-multilingual)** vía `sentence-transformers`. No está versionado en este repo (pesa varios GB) — hay que descargarlo aparte y colocarlo en `models_ai/jina-reranker-v2-base-multilingual`:

```bash
# Opción A: git + git-lfs
git clone https://huggingface.co/jinaai/jina-reranker-v2-base-multilingual models_ai/jina-reranker-v2-base-multilingual

# Opción B: huggingface-cli
huggingface-cli download jinaai/jina-reranker-v2-base-multilingual --local-dir models_ai/jina-reranker-v2-base-multilingual
```

> ⚠️ Requiere `transformers` en el rango `>=4.41.0,<5` (ya fijado en `pyproject.toml`) — el código custom del modelo (`trust_remote_code=True`) depende de un símbolo interno que las versiones `5.x` de `transformers` eliminaron.

---

## 🧩 Modelo de extracción estructurada (NuExtract)

`services/nuextract_service.py` usa **[NuExtract-tiny](https://huggingface.co/numind/NuExtract-tiny)** (Qwen2-0.5B fine-tuneado por NuMind) para rellenar un esquema JSON con datos encontrados en un texto. No está versionado en este repo — hay que descargarlo aparte y colocarlo en `models_ai/NuExtract-tiny`:

```bash
# Opción A: git + git-lfs
git clone https://huggingface.co/numind/NuExtract-tiny models_ai/NuExtract-tiny

# Opción B: huggingface-cli
huggingface-cli download numind/NuExtract-tiny --local-dir models_ai/NuExtract-tiny
```

> A diferencia de `jina-reranker`, este modelo usa una arquitectura estándar (`Qwen2ForCausalLM`) — no requiere `trust_remote_code=True` ni depende del pin especial de `transformers`.

---

## ▶️ Cómo levantarlo

### 🐳 Con Docker (recomendado)

```bash
docker build -t reddragon .
docker run -p 8000:8000 -p 5000:5000 reddragon
```

El `Dockerfile` es **multi-etapa**: una etapa `node:22-alpine` compila el frontend (`npm run build`) y la etapa final (Python/uv) copia solo el `dist/` resultante — FastAPI lo sirve como estático en `/`, mientras la API queda en `/execute_pipeline`.

### 🐧 Nativo en Linux (sin Docker)

```bash
bash scripts/start.sh
```

Instala dependencias de Python (`uv sync`) y del frontend, compila el frontend, da permisos de ejecución a los binarios de `resources/` y arranca el servidor.

### 🛠️ Desarrollo (frontend y backend por separado)

```bash
# Backend
uv run main.py

# Frontend (con hot reload, en otra terminal)
cd frontend
npm install
npm run dev
```

---

## ⚙️ Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `REDDRAGON_HOST` | Host de uvicorn | `0.0.0.0` |
| `REDDRAGON_PORT` | Puerto de la API | `8000` |
| `TSUBASA_HOST` | Host del binario `tsubasa` | `127.0.0.1` |
| `TSUBASA_PORT` | Puerto del binario `tsubasa` | `5000` |

---

## 🔌 API

### `POST /execute_pipeline`

`multipart/form-data`:

| Campo | Tipo | Descripción |
|---|---|---|
| `file` | archivo | `doc`, `docx`, `xls`, `xlsx` o `pdf` |
| `pipeline` | string (JSON) | grafo de nodos (`graph.nodes.*`) a ejecutar en Tsubasa. Cada nodo `"data": {}` se reemplaza con `{"dato": [...]}` (columna `"dato"`) — referencia esa columna en tus `select`/`filter`/etc. |
| `mode` | string | `"pruned_xml"` o `"text_list"` |
| `query` | string (opcional) | si se envía, reordena `result_data` por relevancia semántica contra esta query (`services/cross_encoder_service.py`) antes de podar/filtrar |
| `top_k` | int (opcional) | junto con `query`, recorta el resultado reordenado a los `top_k` más relevantes |
| `schema` | string (JSON, opcional) | plantilla de campos a extraer (ej. `{"Nombre": "", "Monto": ""}`). Si se envía, el resultado de Tsubasa se poda contra el XML (`XmlService.prune_xml`), se renderiza en Markdown (`MarkdownService.to_markdown`), se redacta en prosa (`RedactorService.redact`) y `NuExtractService` rellena el esquema contra esa prosa — **ese JSON reemplaza el `result` de `mode`** |

**Respuesta** (`200`):

```json
{
  "filename": "reporte.docx",
  "mode": "text_list",
  "result": ["..."]
}
```

Con `schema` (`result` es el JSON extraído en vez de lo anterior):

```json
{
  "filename": "reporte.docx",
  "mode": "text_list",
  "result": { "Nombre": "...", "Monto": "..." }
}
```

---

## 🔗 Proyectos relacionados

RedDragon es quien **consume** a los dos, no al revés: TsubasaEngine y Denki Pipeline Designer están hechos para ser integrados por RedDragon, que los ensambla dentro de su propio entorno completo — arquitectura en capas (`controllers` → `preservices`/`orchestrators` → `services`), build Docker multi-etapa, script de arranque nativo para Linux y un frontend propio para probarlo.

- 🪽 **[TsubasaEngine](https://github.com/Edahi98/TsubasaEngine)** — el motor de ejecución (`polars_ast`) del que sale el binario `tsubasa`. RedDragon lo consume como una pieza de su arquitectura: lo arranca y gestiona como singleton (`services/tsubasa_service.py`), ligado al ciclo de vida del propio servidor.
- ⚡ **[Denki Pipeline Designer](https://github.com/Edahi98/DenkiPepelineDesigner)** — de aquí sale la lógica de extracción de documentos (`xmljava`, PDF→DOCX) que RedDragon consume en `services/`. Denki la usa dentro de su app de escritorio Electron; RedDragon la integra como parte de su propio backend HTTP.
