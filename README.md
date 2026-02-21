# Tymer – Intelligent Task & Time Management System

Tymer is a **full-stack, production-style task management web application** that enables users to create, schedule, and monitor tasks using dynamic **countdown and count-up timers**.

The application supports **real-time timer tracking, cooldown monitoring, Google Calendar integration, and secure authentication**, all deployed in a fully Dockerized environment.

Tymer is designed to simulate a **real-world scalable SaaS architecture**.

---

## 🚀 Problem Statement

Modern task management tools allow scheduling but lack **dynamic timer intelligence** such as:

- Live countdown tracking  
- Post-completion time tracking  
- Cooldown monitoring  
- Granular time-based execution states  

Tymer solves this by combining:

- Scheduled task automation  
- On-demand task execution  
- Real-time countdown & count-up timers  
- Cross-platform calendar synchronization  

---

## ✨ Core Features

### 🔐 Authentication System

Tymer supports secure multi-method authentication:

- ✅ Google OAuth Login  
- ✅ Email-based Signup / Signin  
- ✅ Gmail OTP Verification  
- 🔒 Secure JWT-based session handling  

---

### 📋 Task Management (Full CRUD)

Users can:

- Create tasks  
- View tasks  
- Update tasks  
- Delete tasks  

Each task contains:

- Category (Scheduled / On-Demand)  
- Duration  
- Start Time  
- Cooldown Period (optional)  
- Execution State  

---

## ⏳ Intelligent Timer System

Tymer includes two dynamic timer mechanisms:

---

### 1️⃣ Countdown Timer (Execution Timer)

#### 🔹 Scheduled Tasks

- User selects future start time  
- Task automatically transitions to **Active state**  
- Countdown begins when scheduled time is reached  
- Reminder is triggered upon activation  
- Full-screen timer view available  

#### 🔹 On-Demand Tasks

- Task remains in **Available state**  
- Countdown starts only when user manually triggers it  
- Runs until duration completes  

**Supported Granularity:**

- Hours  
- Minutes  
- Seconds  

---

### 2️⃣ Count-Up Timer (Post-Completion Tracking)

Once a task is marked as completed:

- A count-up timer starts automatically  
- Tracks time elapsed since completion  
- Helps measure productivity gaps  
- Useful for cooldown monitoring  

This creates a lifecycle:
Available → Active → Completed → Cooldown Tracking


---

## 🗓 Google Calendar Integration

Tymer supports **bidirectional synchronization**:

### Import from Google Calendar

- External calendar events can be imported as scheduled tasks  

### Export to Google Calendar

- Scheduled tasks created in Tymer can be pushed to Google Calendar  

This ensures:

- No task duplication  
- Centralized time management  
- Cross-platform consistency  

---

## 🖥 Dashboard Experience

The landing page presents:

- A tiled layout of all tasks  
- Real-time ticking countdown timers  
- Visual state indicators  
- Smooth transitions between task states  

The interface is optimized for:

- High visibility  
- Time-awareness  
- Productivity tracking  

---

## 🏗 Architecture Overview

Tymer follows a production-style architecture:

- Frontend served via Nginx  
- Backend API routed through reverse proxy  
- PostgreSQL containerized database  
- Environment-based configuration  
- Docker Compose orchestration  

This mirrors real-world deployment practices.

---

## 📦 Tech Stack

### Frontend
- React  
- Vite  
- TypeScript  
- Tailwind CSS  

### Backend
- Node.js  
- Express  
- TypeScript  

### Database
- PostgreSQL  

### Authentication
- Google OAuth  
- Gmail OTP verification  

### Infrastructure
- Docker  
- Docker Compose  
- Nginx Reverse Proxy  

---

## 🐳 Dockerized Deployment

Tymer is fully containerized and runs with a single command.

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



