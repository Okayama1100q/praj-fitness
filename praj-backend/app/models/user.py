from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    number = Column(String)
    password_hash = Column(String)
    
    # Biometric Data
    weight = Column(Float)
    height = Column(Float)
    age = Column(Integer)
