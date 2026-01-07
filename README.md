# Tymer – Full Stack Dockerized Application

Tymer is a **production-style, fully Dockerized full‑stack application** that can be started with **a single Docker command**. The repository bundles the **frontend, backend, database, and reverse proxy** into a clean, reproducible setup.

---

## 📦 Tech Stack

* **Frontend:** React, Vite, TypeScript ,Tailwind
* **Backend:** Node.js, Express, TypeScript
* **Database:** PostgreSQL
* **Reverse Proxy:** Nginx
* **Containerization:** Docker & Docker Compose

---

## 📁 Project Structure

```
Tymer-docker/
├── Tymer-frontend/        # Frontend source code (React + Vite)
├── Tymer-backend/         # Backend source code (Node.js + TypeScript)
├── nginx/                 # Nginx Dockerfile & configuration
├── db/
│   └── schema.sql         # PostgreSQL schema initialization
├── docker-compose.yml     # Docker orchestration
└── README.md              # Project documentation
```

---

## ⚠️ Prerequisites

Before running the project, ensure the following are installed and running:

* **Docker Desktop**
* **Docker Engine running**
* The following ports are **free on your system**:

  * `80` – Frontend (via Nginx)
  * `3000` – Backend (internal)
  * `5432` – PostgreSQL (internal)

---

## 🔐 Environment Variables (Important)

The **backend requires sensitive environment variables** that are **not committed** to GitHub for security reasons.

### 📌 Setup Instructions

1. You will receive the backend `.env` file **privately (via email)**
2. Place the file at the following location:

```
Tymer-backend/.env
```

3. If a `.env.example` file exists, **replace it** with the provided `.env`

> ⚠️ **Do not rename the file** – it must be exactly `.env`

### Frontend Environment

* Frontend environment variables are **non-sensitive**
* The frontend `.env` file **is already included** in the repository

---

## 🚀 Running the Project

Once Docker is running and the backend `.env` file is placed correctly:

```bash
git clone https://github.com/raji-s-dev/Tymer-docker.git
cd Tymer-docker
docker compose up --build
```

✅ That’s it — no additional commands required.

All services (frontend, backend, database, nginx) will start automatically.

---

## 🌐 Accessing the Application

| Service     | URL                                          |
| ----------- | -------------------------------------------- |
| Frontend    | [http://localhost](http://localhost)         |
| Backend API | [http://localhost/api](http://localhost/api) |
| PostgreSQL  | Internal (Port 5432)                         |

> The backend is accessed **only via Nginx** using the `/api` route.

---

## 🧠 How It Works

### Nginx

* Serves the **frontend static build**
* Proxies all `/api` requests to the backend container
* Acts as a **single entry point** (production-style setup)

### Backend

* Runs inside a Docker container
* Uses environment variables from `.env`
* Connects to PostgreSQL using Docker networking

### Database

* PostgreSQL runs in its own container
* Schema is **auto-initialized** using:

```
db/schema.sql
```

---

## 🛠 Development Notes

* `node_modules` are **not committed** to GitHub
* Dependencies are installed **inside containers**
* Docker volumes are used for database persistence
* Configuration mirrors **real-world production deployments**

---

## 🧪 Stopping the Project

To stop all running containers:

```bash
docker compose down
```

To stop containers **and remove volumes (database reset)**:

```bash
docker compose down -v
```

---

## 🧩 Common Issues

### Port Already in Use

Ensure ports `80`, `3000`, and `5432` are not used by other services.

### Backend Not Starting

* Confirm `.env` exists in `Tymer-backend/`
* Ensure all required environment variables are present

### Docker Build Fails

Try rebuilding without cache:

```bash
docker compose build --no-cache
```

---

## 👤 Author

**Raji S**


---

## ⭐ Final Notes

This repository is designed for:

* Easy local development
* Clean onboarding
* Production‑style Docker deployments

If Docker is running, **one command is all you need** 🚀


