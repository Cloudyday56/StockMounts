# StockMounts
<img width="1113" height="833" alt="Screenshot 2025-07-12 at 15 39 23" src="https://github.com/user-attachments/assets/0e5d72d8-ab35-4310-b588-77a8d8bf079b" />

A full-stack application for recording, viewing, and managing trading notes, with integrated stock price prediction using machine learning.

## Features

- Stock price prediction using ML models (Python service)
- Create, view, update, and delete notes with title and content
- Rate limiting to prevent spam (Upstash Redis)
- Modern UI with Tailwind CSS and DaisyUI
- Toast notifications for user feedback

## Technologies Used

**Frontend:**

- React (with Vite)
- React Router v7
- Axios
- Tailwind CSS + DaisyUI
- Chart.js (for visualizations)
- Lucide React Icons
- React Hot Toast

**Backend:**

- Node.js + Express
- MongoDB with Mongoose
- Upstash Redis (rate limiting)
- CORS, dotenv

**Machine Learning Service:**

- Python (Flask or FastAPI)
- scikit-learn, joblib
- Custom-trained models per stock symbol

## Acknowledgments
This proejct's full stack skeleton is based on [Codesistency](https://www.youtube.com/@codesistency)'s [tutorial](https://youtu.be/Ea9rrRj9e0Y?si=mX89W3K_jmX1QWDx)
