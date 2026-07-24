FROM node:22-alpine AS frontend-build

WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

COPY frontend/ .
RUN npm run build


FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y python3 curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:${PATH}"

WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --locked

COPY . .
COPY --from=frontend-build /frontend/dist ./frontend/dist

ENV REDDRAGON_HOST=0.0.0.0
ENV REDDRAGON_PORT=8000
ENV TSUBASA_HOST=127.0.0.1
ENV TSUBASA_PORT=5000

EXPOSE 8000 5000

CMD ["uv", "run", "main.py"]
