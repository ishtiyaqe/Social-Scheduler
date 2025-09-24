# Social Scheduler Project

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black)

This repository contains a **Social Scheduler** project with multiple challenges:

- **Backend**: FastAPI service for scheduling posts, product customization, and analytics.
- **Frontend**: Next.js + React app for UI, previews, and dashboards.  

> Both backend and frontend have separate `README.md` files for detailed instructions.

---

## 📦 Project Structure

```

social-scheduler/
├── backend/        # FastAPI backend (see backend/README.md)
├── frontend/       # Next.js frontend (see frontend/README.md)
└── README.md       # Root overview

```

---

## 🏆 Challenges

### Challenge 1 (Core): AI Agent with Social Posting & Scheduling

**Scenario:**  
Build a lightweight AI-powered agent that can schedule posts across multiple social platforms. Each post must include both text and an image.

**Tasks:**
- Build a **FastAPI service** where a user can submit post content (text + image), target platforms (mock APIs), and scheduled time.
- Store scheduled posts in a **MySQL** (or SQLite) database.
- Use a **background scheduler** (APScheduler, Celery, etc.) to auto-publish at the scheduled time.
- Expose an API to **list all scheduled posts** and their status.

**Stretch Goal (Optional):**
- AI helper to suggest hashtags or best posting time.

---

### Challenge 2 (Mini): Product Customization Preview

**Scenario:**  
Allow a user to add text on top of a product (t-shirt) image and preview it.

**Tasks:**
- **Frontend (Next.js + React):** Simple page with a product image (mocked). User can type text, and it overlays on the image.
- **Backend (FastAPI):** Provide an endpoint to save the customization (product + text) into MySQL.

**Stretch Goal (Optional):**
- Show a small **"My Designs"** list with saved customizations.

---

### Challenge 3 (Mini): Analytics Dashboard

**Scenario:**  
Create a small dashboard showing scheduled post stats and a basic AI-generated insight.

**Tasks:**
- **Backend (FastAPI):** Expose an endpoint with mock summary data (e.g., `posts_published=5`, `scheduled=3`, `failed=1`). Add an endpoint for a simple AI-generated string (mocked with OpenAI or static).
- **Frontend (Next.js + React):** Display a chart (Recharts/Chart.js) for published vs scheduled vs failed, and show the AI insight below.

**Stretch Goal (Optional):**
- Add filters (e.g., posts by platform)

---

## ⚡ Notes

- Python version: **3.11**  
- Frontend and backend are **separately runnable**. Check their `README.md` files for detailed installation and run instructions.  
- The project is modular so that backend and frontend can be developed independently.  

---

## 🔗 Links

- [Backend README](./backend/README.md)  
- [Frontend README](./frontend/README.md)  




