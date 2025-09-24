# Social Scheduler Backend (FastAPI - Mock)

This is the backend for the Social Scheduler project, built with **FastAPI**. It provides endpoints for scheduling and managing posts.  

---

## 🚀 Installation

1. Create a virtual environment:

```bash
python -m venv venv
````

2. Activate the virtual environment:

```bash
# On Linux/macOS
source venv/bin/activate

# On Windows
venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

---

## ▶️ Running the Server

1. Navigate to the `app` directory:

```bash
cd app
```

2. Start the FastAPI server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

* The `--reload` flag allows automatic reloading when code changes.
* The server will be accessible at:

```
http://localhost:8000
```

---

## 📂 Uploads

Uploaded files will be served at:

```
http://localhost:8000/uploads/...
```

---

## ⚡ Notes

* This is a **mock backend** for testing and development purposes.
* Make sure the `uploads` directory exists in the project root for file serving.

