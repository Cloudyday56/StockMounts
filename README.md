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

### Setup & Running (with Docker Compose)

1. Create `.env` in the project root and fill in your MongoDB and Upstash credentials (see below).
2. Change url in nginx.conf for local development
3. From the project root, run:
   ```sh
   docker compose up --build
   ```
4. Access the app:
   - Frontend: http://localhost/
   - Backend API: http://localhost:5001/
   - ML Service: http://localhost:8000/

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
