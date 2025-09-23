from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from fastapi import Form, UploadFile


class ScheduledPostCreate(BaseModel):
    text: str
    platforms: List[str]
    scheduled_time: datetime
    price: Optional[float] = None   # ✅ added


class ScheduledPostUpdate:
    def __init__(
        self,
        text: str = Form(...),
        price: Optional[float] = Form(None),
        platforms: Optional[str] = Form(None),  # optional comma-separated string
        scheduled_time: Optional[datetime] = Form(None),  # optional datetime
    ):
        self.text = text
        self.price = price
        self.platforms = platforms.split(",") if platforms else None  # convert to list if provided
        self.scheduled_time = scheduled_time


class ScheduledPostOut(BaseModel):
    id: int
    text: str
    image_path: Optional[str]
    platforms: List[str]
    scheduled_time: datetime
    status: str
    result: Optional[str]
    price: Optional[float] = None   # ✅ already here
    created_at: datetime

    class Config:
        orm_mode = True
