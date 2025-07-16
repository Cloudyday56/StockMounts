# StockMounts

<img width="1113" height="833" alt="Screenshot 2025-07-12 at 15 39 23" src="https://github.com/user-attachments/assets/0e5d72d8-ab35-4310-b588-77a8d8bf079b" />

A Dockerized full-stack MERN + Python Machine Learning app for taking trading notes and predicting stock prices.
**Hosted at:** [https://stockmounts.onrender.com](https://stockmounts.onrender.com)

## Features

- Stock price prediction using ML models (Python service)
- Create, view, update, and delete notes with title and content
- Rate limiting to prevent spam (Upstash Redis)
- Modern UI with Tailwind CSS and DaisyUI
- Toast notifications for user feedback
- **Dockerized**: Easily run the entire stack with Docker Compose

## Tech Stack

**Frontend:**

- React (Vite)
- React Router v7
- Axios
- Tailwind CSS + DaisyUI
- Chart.js (visualizations)
- Lucide React Icons
- React Hot Toast

**Backend:**

- Node.js + Express
- MongoDB (Mongoose)
- Upstash Redis (rate limiting)
- CORS, dotenv

**Machine Learning Service:**

- Python (FastAPI)
- scikit-learn, joblib
- Custom-trained models per stock symbol

**DevOps / Infrastructure:**

- **Docker** (multi-container setup)
- Docker Compose
- Nginx (serving frontend & reverse proxy)

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.10+
- MongoDB Atlas account (or local MongoDB)
- Upstash Redis account (for rate limiting)

## Running in Development vs Production

### Development Mode (Local Docker Compose)

1. **Create a `.env` file** in the project root and fill in your MongoDB and Upstash credentials (see the Environment Variables section below).
2. In `docker-compose.yml`, **uncomment** the following lines under the `backend` service:
   ```yaml
   environment:
     - NODE_ENV=development
   command: npm run dev
   volumes:
     - ./backend:/app
   ```
3. In `frontend/nginx.conf`, **uncomment** this line and **comment out** the public URL line (replace with your own backend's public URL if deploying elsewhere):
   ```nginx
   proxy_pass http://backend:5001/api/;
   # proxy_pass https://your-backend-public-url/api/;
   ```
4. Run:
   ```sh
   docker compose up --build
   ```
5. Access the app at http://localhost

### Production Mode (Local or Deployment)

1. **Create a `.env` file** in the project root and fill in your MongoDB and Upstash credentials (see the Environment Variables section below).
2. In `docker-compose.yml`, **comment out** the following lines under the `backend` service:
   ```yaml
   # - NODE_ENV=development
   # command: npm run dev
   # volumes:
   #   - ./backend:/app
   ```
3. In `frontend/nginx.conf`, **uncomment** the public URL line (replace with your own backend's public URL if deploying elsewhere) and **comment out** the local backend line:
   ```nginx
   proxy_pass https://your-backend-public-url/api/;
   # proxy_pass http://backend:5001/api/;
   ```
4. Run:
   ```sh
   docker compose up --build
   ```
5. Access the app at http://localhost (for local production) or at your own deployed public URL if running on a server (replace with your deployment's actual URL).

---

## Environment Variables

You must create a `.env` file in the project root (not committed) with:

```
MONGO_URI=your-mongodb-uri
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
PORT=5001
NODE_ENV=development
```

## Project Structure

```
.
├── backend/         # Node & Express server
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── config/
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
├── frontend/        # React client app
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
├── MLservice/       # Python ML microservice
│   ├── model/
│   ├── trained_models/
│   ├── utils/
│   ├── app.py
│   ├── main.py
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

## Acknowledgments

This project's full stack skeleton is based on [Codesistency](https://www.youtube.com/@codesistency)'s [tutorial](https://youtu.be/Ea9rrRj9e0Y?si=mX89W3K_jmX1QWDx)
