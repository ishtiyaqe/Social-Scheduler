from sqlalchemy import Column, Integer, String, DateTime, Text, JSON, Float
from sqlalchemy.sql import func
from .database import Base

class ScheduledPost(Base):
    __tablename__ = "scheduled_posts"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    image_path = Column(String, nullable=True)
    platforms = Column(String, nullable=False)  # comma separated like "facebook,twitter"
    scheduled_time = Column(DateTime, nullable=False)
    status = Column(String, default="pending")  # pending, published, failed
    created_at = Column(DateTime, server_default=func.now())
    result = Column(Text, nullable=True)
