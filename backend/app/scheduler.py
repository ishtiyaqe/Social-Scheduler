# scheduler.py
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.executors.pool import ThreadPoolExecutor
from datetime import datetime, timezone, timedelta
from .database import SessionLocal
from .crud import get_all_posts, get_post, update_post_status
from .mock_social import post_to_platform
import threading

scheduler = None
lock = threading.Lock()


def publish_job(post_id: int):
    """Run the post publishing job."""
    db = SessionLocal()
    try:
        post = get_post(db, post_id)
        if not post or post.status == "published":
            return

        text = post.text
        image_path = post.image_path
        platforms = post.platforms.split(",") if post.platforms else []

        results = []
        all_ok = True
        for p in platforms:
            ok, msg = post_to_platform(p, text, image_path)
            results.append(f"{p}: {msg}")
            if not ok:
                all_ok = False

        status = "published" if all_ok else "failed"
        update_post_status(db, post_id, status, result="; ".join(results))

    finally:
        db.close()


def schedule_existing_posts():
    """Schedule all pending posts from DB on startup."""
    global scheduler
    db = SessionLocal()
    try:
        posts = get_all_posts(db)
        now = datetime.now(timezone.utc)
        for p in posts:
            if p.status in ["pending", "scheduled"] and p.scheduled_time:
                dt = p.scheduled_time
                # make sure scheduled_time is UTC-aware
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=timezone.utc)
                # only schedule future jobs
                if dt > now:
                    try:
                        scheduler.add_job(
                            publish_job,
                            'date',
                            run_date=dt,
                            args=[p.id],
                            id=f"post_{p.id}",
                            misfire_grace_time=3600  # allow 1 hour to run missed jobs
                        )
                    except Exception:
                        pass
    finally:
        db.close()


def schedule_post(post_id: int, run_time):
    """Schedule a single new post."""
    dt = run_time
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)

    scheduler.add_job(
        publish_job,
        'date',
        run_date=dt,
        args=[post_id],
        id=f"post_{post_id}",
        misfire_grace_time=3600
    )


def check_missed_posts():
    """Mark any pending posts whose scheduled time has passed as failed."""
    db = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        posts = get_all_posts(db)
        for p in posts:
            if p.status == "pending" and p.scheduled_time:
                dt = p.scheduled_time
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=timezone.utc)
                if dt + timedelta(seconds=5) < now:  # add small buffer
                    update_post_status(db, p.id, status="failed", result="Missed scheduled time")
    finally:
        db.close()


def start_scheduler():
    """Start the background scheduler and periodic checks."""
    global scheduler
    if scheduler:
        return scheduler

    executors = {'default': ThreadPoolExecutor(10)}
    scheduler = BackgroundScheduler(timezone=timezone.utc, executors=executors)
    scheduler.start()

    # Schedule existing posts
    schedule_existing_posts()

    # Periodic job: check for missed posts every 60 seconds
    scheduler.add_job(
        check_missed_posts,
        'interval',
        seconds=60,
        id="check_missed_posts"
    )

    return scheduler
