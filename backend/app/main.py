import os
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import SessionLocal, engine, Base
from .scheduler import start_scheduler, schedule_post
from .schemas import ScheduledPostUpdate
from typing import List
import shutil
from pathlib import Path
from collections import Counter
from datetime import datetime, timezone
from app.models import ScheduledPost
from app.database import SessionLocal
from typing import Optional


# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Social Scheduler (Mock)")

# CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Start scheduler on app startup
@app.on_event("startup")
def startup_event():
    start_scheduler()

@app.post("/posts/", response_model=schemas.ScheduledPostOut)
async def create_post(
    text: str = Form(...),
    platforms: str = Form(...),   # comma-separated from frontend
    scheduled_time: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # parse scheduled time iso
    try:
        scheduled_dt = datetime.fromisoformat(scheduled_time).astimezone(timezone.utc)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid scheduled_time format. Use ISO format.")
    image_path = None
    if image:
        # save image
        filename = f"{int(datetime.utcnow().timestamp())}_{image.filename}"
        dest = UPLOAD_DIR / filename
        with open(dest, "wb") as f:
            shutil.copyfileobj(image.file, f)
        image_path = f"/uploads/{filename}"
    platforms_list = [p.strip() for p in platforms.split(",") if p.strip()]
    new = crud.create_scheduled_post(db, text=text, image_path=image_path, platforms=platforms_list, scheduled_time=scheduled_dt)
    # schedule job
    schedule_post(new.id, new.scheduled_time)
    # return as schema
    out = schemas.ScheduledPostOut(
        id=new.id,
        text=new.text,
        image_path=new.image_path,
        platforms=new.platforms.split(",") if new.platforms else [],
        scheduled_time=new.scheduled_time,
        status=new.status,
        result=new.result,
        created_at=new.created_at
    )
    return out

@app.get("/posts/", response_model=List[schemas.ScheduledPostOut])
def list_posts(db: Session = Depends(get_db)):
    posts = crud.get_all_posts(db)
    result = []
    for p in posts:
        result.append(schemas.ScheduledPostOut(
            id=p.id,
            text=p.text,
            image_path=p.image_path,
            platforms=p.platforms.split(",") if p.platforms else [],
            scheduled_time=p.scheduled_time,
            status=p.status,
            result=p.result,
            price=p.price,
            created_at=p.created_at
        ))
    return result


@app.put("/posts/{post_id}")
def update_post(
    post_id: int,
    text: str = Form(...),
    price: Optional[float] = Form(None),
    platforms: Optional[str] = Form(None),  # optional comma-separated string
    scheduled_time: Optional[str] = Form(None),  # optional ISO datetime string
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    try:
        scheduled_dt = datetime.fromisoformat(scheduled_time).astimezone(timezone.utc)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid scheduled_time format. Use ISO format.")
    

    post = db.query(ScheduledPost).filter(ScheduledPost.id == post_id).first()
    if not post:
        return {"error": "Post not found"}

    # Always update text
    post.text = text

    # Update optional fields only if provided
    if price is not None:
        post.price = price

    if platforms is not None:
        post.platforms = platforms  # store as comma-separated string

    if scheduled_dt:
        try:
            post.scheduled_time = scheduled_dt
        except ValueError:
            return {"error": "Invalid scheduled_time format"}

    # Handle image upload
    if image:
        file_location = f"uploads/{image.filename}"
        with open(file_location, "wb") as f:
            f.write(image.file.read())
        post.image_path = "/" + file_location

    db.commit()
    db.refresh(post)
    return post


@app.get("/posts/{post_id}", response_model=schemas.ScheduledPostOut)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.ScheduledPost).filter(models.ScheduledPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return schemas.ScheduledPostOut(
        id=post.id,
        text=post.text,
        image_path=post.image_path,
        platforms=post.platforms.split(",") if post.platforms else [],
        scheduled_time=post.scheduled_time,
        status=post.status,
        result=post.result,
        price=post.price,
        created_at=post.created_at
    )

# Mini challenge 2 endpoint to save customization
@app.post("/customizations/")
def save_customization(
    product: str = Form(...),
    text: str = Form(...),
    price: float = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_path = None
    if image:
        filename = f"{int(datetime.utcnow().timestamp())}_{image.filename}"
        dest = UPLOAD_DIR / filename
        with open(dest, "wb") as f:
            shutil.copyfileobj(image.file, f)
        image_path = f"/uploads/{filename}"

    new = crud.create_scheduled_post(
        db,
        text=f"Customization for {product}: {text}",
        image_path=image_path,
        platforms=["custom"],
        scheduled_time=datetime.utcnow(),
        price=price
    )
    return {"ok": True, "id": new.id}


# Analytics (challenge 3)
@app.get("/analytics/")
def analytics(db: Session = Depends(get_db)):
    now = datetime.utcnow()

    # Count statuses
    published_count = db.query(models.ScheduledPost).filter(models.ScheduledPost.status == "published").count()
    failed_count = db.query(models.ScheduledPost).filter(models.ScheduledPost.status == "failed").count()

    # Scheduled posts: include "pending" and "scheduled" that are in the future
    scheduled_count = db.query(models.ScheduledPost).filter(
        models.ScheduledPost.status.in_(["pending", "scheduled"]),
        models.ScheduledPost.scheduled_time > now
    ).count()

    # --- Dynamic AI insight ---
    future_posts = db.query(models.ScheduledPost).filter(
        models.ScheduledPost.status.in_(["pending", "scheduled"]),
        models.ScheduledPost.scheduled_time > now
    ).all()

    # Count by weekday and hour
    timeline_counter = Counter()
    for post in future_posts:
        dt = post.scheduled_time
        weekday = dt.strftime("%A")  # Monday, Tuesday, etc.
        hour = dt.hour
        timeline_counter[(weekday, hour)] += 1

    if timeline_counter:
        # Find most common slot
        (best_day, best_hour), _ = timeline_counter.most_common(1)[0]
        ai_insight = f"Most scheduled posts are on {best_day}s around {best_hour}:00 UTC."
    else:
        ai_insight = "No scheduled posts to generate timeline insight yet."

    return {
        "published": published_count,
        "scheduled": scheduled_count,
        "failed": failed_count,
        "ai_insight": ai_insight
    }
