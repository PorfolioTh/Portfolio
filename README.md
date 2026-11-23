# Portfolio frontend

The frontend reads the backend base URL from `VITE_API_URL`.

- Local development: copy `.env.example` to `.env` and use `http://localhost:4000`.
- Production: `.env.production` points to the Render API. Set the same `VITE_API_URL` in the Vercel project's environment variables if you prefer configuring it there; Vercel must rebuild after environment-variable changes.

The backend must allow the exact frontend origin in its `CORS_ORIGIN` environment variable.