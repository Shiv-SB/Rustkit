# rustkit

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.4.0. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## potential future layout

crates/
│
├── # Infrastructure
├── rustkit-core
├── rustkit-ffi
├── rustkit-simd
├── rustkit-memory
│
├── # Numerical
├── rustkit-vector
├── rustkit-matrix
├── rustkit-stats
│
├── # Search / AI
├── rustkit-search
├── rustkit-distance
├── rustkit-embedding
│
├── # Data
├── rustkit-columnar
├── rustkit-query
├── rustkit-aggregate
│
├── # Time
├── rustkit-timeseries
│
├── # Text
├── rustkit-text
├── rustkit-bytes
├── rustkit-pattern
├── rustkit-fuzzy
│
├── # Binary
├── rustkit-binary
├── rustkit-parser
│
├── # Data structures
├── rustkit-hash
├── rustkit-bloom
├── rustkit-dedup
│
├── # Media / signal
├── rustkit-signal
├── rustkit-fft
├── rustkit-audio
├── rustkit-image
│
├── # Specialist
├── rustkit-geo
├── rustkit-finance
└── rustkit-montecarlo