# Performance Dashboard

## Setup

1. npm install
2. npm run dev

Open http://localhost:3000/dashboard

## Notes
- Simulated data: new point every 100ms
- Canvas rendering with shared rAF
- Virtualized table
- Web worker (public/worker/aggregator.js) for down-sampling

## Performance Testing
- Use the FPS counter in the top-right
- Use Chrome DevTools Performance and Memory tabs

## Build for production
- npm run build
- npm start