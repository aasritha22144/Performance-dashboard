# Performance Report (template)

## Environment
- Browser: Chrome xx
- Machine: ...

## Benchmarks
- 10k points: FPS avg: ...
- Memory growth (1h): ...
- Interaction latency: ...

## Optimizations implemented
- Canvas rendering with single rAF loop
- Sliding window data buffer
- Virtualized data table
- Optional Web Worker for down-sampling
- Minimal React state for streaming

## Future improvements
- OffscreenCanvas in worker
- WebGL renderer
- Server-side aggregation and streaming via server-sent events