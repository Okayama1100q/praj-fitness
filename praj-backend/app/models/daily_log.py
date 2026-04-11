from sqlalchemy import Column, Integer, Float, String, ForeignKey, UniqueConstraint
from app.core.database import Base


class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    date = Column(String, index=True)

    intake = Column(Float)
    burn = Column(Float)
    surplus = Column(Float)

    __table_args__ = (
        UniqueConstraint('user_id', 'date', name='uq_user_date'),
    )