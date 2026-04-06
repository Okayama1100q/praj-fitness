from fastapi import FastAPI
from app.api.routes import router

from app.core.database import engine, Base
from app.models import daily_log

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(router)