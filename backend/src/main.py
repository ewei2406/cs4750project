from fastapi import FastAPI

from src.deps.lifespan import lifespan
from src.routers import users

app = FastAPI(lifespan=lifespan)

app.include_router(users.router)


@app.get("/")
def hello():
    return {"message": "Hello, World!"}


@app.get("/healthz")
def health_check():
    return {"status": "ok"}
