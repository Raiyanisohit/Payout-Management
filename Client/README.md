# Payout Management Frontend

This is the React + Vite frontend for the Payout Management MVP. It talks to a backend at `VITE_API_URL`.

Quick start

1. Install:

```bash
cd Client
npm install
```

2. Create an env file (see `.env.example`):

```
VITE_API_URL=http://your-backend-url/api
```

3. Run in development:

```bash
npm run dev
```

4. Build:

```bash
npm run build
```

Notes
- Login with provided credentials the backend accepts (ops@demo.com / ops123, finance@demo.com / fin123).
- The frontend stores JWT in `localStorage` and attaches `Authorization` header via axios interceptor.
- Role-based UI is only for convenience; backend enforces actual RBAC.
