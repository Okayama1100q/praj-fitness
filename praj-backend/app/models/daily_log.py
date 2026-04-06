from sqlalchemy import Column, Integer, Float, String
from app.core.database import Base


class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, unique=True)

    intake = Column(Float)
    burn = Column(Float)
    surplus = Column(Float)