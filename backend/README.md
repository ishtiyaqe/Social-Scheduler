# Backend (FastAPI) for Social Scheduler (mock)

## Install
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

## Run
cd app
uvicorn main:app --reload --host 0.0.0.0 --port 8000

Uploads will be served at http://localhost:8000/uploads/...
