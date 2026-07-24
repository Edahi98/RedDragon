import os
from contextlib import asynccontextmanager
from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from controllers.pipeline_controller import router
from services.tsubasa_service import TsubasaService

FRONTEND_DIST = Path(__file__).parent / "frontend" / "dist"

tsubasa_service = TsubasaService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    tsubasa_service.start()
    yield
    tsubasa_service.stop()


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)

if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")


def main():
    host = os.environ.get("REDDRAGON_HOST", "0.0.0.0")
    port = int(os.environ.get("REDDRAGON_PORT", 8000))
    uvicorn.run(app, host=host, port=port)


if __name__ == "__main__":
    main()
