# BombShelters.com Frontend Application

Production-quality, pixel-faithful Next.js 14+ frontend for **BombShelters.com**.

## Architecture & ModularHome Backend Integration
- **Isolated Standalone App**: Runs independently on port `3001` without touching or modifying the ModularHome website codebase.
- **Backend API Integration**: Form submissions (such as the Free Consultation and Quote requests) are handled through `/api/consultation`, which forwards leads to the ModularHome backend API (`/api/leads`) with `source: "BombShelters.com"`.
- **Zero CORS Blockers**: Handled server-side through Next.js route handlers, ensuring complete reliability.

## Environment Configuration

Configuration variables are documented in `.env.example`.

| Variable | Scope | Description | Default |
| :--- | :--- | :--- | :--- |
| `MODULARHOME_API_URL` | Server-side (Preferred) | Base URL of the ModularHome backend API | `http://localhost:3000` |
| `NEXT_PUBLIC_MODULARHOME_API_URL` | Public / Fallback | Backward-compatible fallback API URL | `http://localhost:3000` |

To override for local development, copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

## Getting Started

### 1. Install Dependencies
```bash
cd bombshelters-app
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
The application will start on [http://localhost:3001](http://localhost:3001).

### 3. Build for Production
```bash
npm run build
npm run start
```
