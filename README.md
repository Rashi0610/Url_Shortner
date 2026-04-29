[README_URL_Shortener.md](https://github.com/user-attachments/files/27193740/README_URL_Shortener.md)
# 🔗 URL Shortener

A production-grade URL shortening service built with Node.js, PostgreSQL, and Redis — featuring collision-safe ID generation, Redis caching for fast redirects, and a clean RESTful API.

🔗 **GitHub:** [github.com/Rashi0610/UrlShortner](https://github.com/Rashi0610/UrlShortner)

---

## ✨ Features

- ⚡ **~80% faster redirects** via Redis caching layer — frequently accessed URLs are served without hitting the database
- 🔐 **Collision-safe Base62 ID generation** — unique short codes across a 62⁶ key space
- 📊 **Analytics endpoint** — track how many times each short URL has been accessed
- 🧱 **4 RESTful endpoints** with proper HTTP status codes, input validation, and error handling
- 🔧 **Environment-based config** — separate settings for development and production

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Cache | Redis |
| Deployment | Render |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/shorten` | Create a new short URL |
| `GET` | `/api/:shortId` | Resolve a short ID to original URL |
| `GET` | `/:shortId` | Redirect to original URL |
| `GET` | `/api/analytics/:shortId` | Get access count for a short URL |

### Example

**Request:**
```json
POST /api/shorten
{
  "originalUrl": "https://example.com/very/long/url/here"
}
```

**Response:**
```json
{
  "shortUrl": "https://your-domain.com/aB3xYz",
  "shortId": "aB3xYz",
  "originalUrl": "https://example.com/very/long/url/here"
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL
- Redis

### Installation

```bash
git clone https://github.com/Rashi0610/UrlShortner.git
cd UrlShortner
npm install
```

### Environment Setup

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/urlshortener
REDIS_URL=redis://localhost:6379
PORT=5000
BASE_URL=http://localhost:5000
```

### Database Setup

```bash
# Run migrations to create the URLs table
npm run migrate
```

### Start the Server

```bash
npm start
```

Server runs at `http://localhost:5000`

---

## 🏗️ Architecture

```
Request → Express Router
              │
              ├── Redis Cache (hit?) ──► Return URL instantly
              │
              └── PostgreSQL (miss) ──► Fetch, cache, return URL
```

### Why Redis?

Without caching, every redirect requires a full database query. With Redis, popular short URLs are stored in memory and returned in under a millisecond — reducing average redirect latency by ~80%.

### Base62 ID Generation

Short IDs use characters `[A-Z][a-z][0-9]` — 62 possible characters per position. At 6 characters, that's 62⁶ = ~56 billion unique combinations, with collision detection built in.

---

## 📁 Project Structure

```
UrlShortner/
├── routes/
│   └── url.js          # All API route handlers
├── db/
│   ├── postgres.js     # PostgreSQL connection & queries
│   └── redis.js        # Redis client setup
├── utils/
│   └── base62.js       # ID generation logic
├── .env.example
└── index.js            # Entry point
```

---

## 🌐 Deployment

Deployed on [Render](https://render.com) with environment variables configured via the Render dashboard for production and a local `.env` for development.

---

## 📬 Contact

**Rashi Shaha**
- GitHub: [@Rashi0610](https://github.com/Rashi0610)
- Email: rashishaha0610@gmail.com
- LinkedIn: [linkedin.com/in/rashishaha](https://linkedin.com/in/rashishaha)
