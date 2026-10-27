# BombShelters.com Frontend Application

Production-quality, pixel-faithful Next.js 14+ frontend for **BombShelters.com**.

## Architecture & ModularHome Backend Integration
- **Isolated Standalone App**: Runs independently on port `3001` without touching or modifying the ModularHome website codebase.
- **Backend API Integration**: Form submissions (such as the Free Consultation and Quote requests) are handled through `/api/consultation`, which forwards leads to the ModularHome backend API (`http://localhost:3000/api/leads`) with `source: "BombShelters.com"`.
- **Zero CORS Blockers**: Handled server-side through Next.js route handlers, ensuring complete reliability.

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
