from sqlalchemy.orm import Session
from . import models
from datetime import datetime
from typing import List

def create_scheduled_post(db: Session, text: str, image_path: str, platforms: List[str], scheduled_time: datetime):
    p = models.ScheduledPost(
        text=text,
        image_path=image_path,
        platforms=",".join(platforms),
        scheduled_time=scheduled_time,
        status="pending"
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

def get_all_posts(db: Session):
    return db.query(models.ScheduledPost).order_by(models.ScheduledPost.created_at.desc()).all()

def get_post(db: Session, post_id: int):
    return db.query(models.ScheduledPost).filter(models.ScheduledPost.id == post_id).first()

def update_post_status(db: Session, post_id: int, status: str, result: str = None):
    p = get_post(db, post_id)
    if not p:
        return None
    p.status = status
    if result:
        p.result = result
    db.add(p)
    db.commit()
    db.refresh(p)
    return p
