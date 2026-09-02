# rustkit

A numeric library for [Bun](https://bun.com), implemented in Rust and exposed through `bun:ffi`. All numeric work happens in Rust — the TypeScript layer is a thin validated wrapper over the native binary.

Modules: vector, matrix, stats, bitset, string, geohash, crypto, quantile, distance, fft, entropy, quantize. Hot kernels (dot products, reductions, element-wise ops) use explicit NEON SIMD on Apple Silicon.

## Install

```bash
bun add rustkit
```

Requires Bun >= 1.4.

## Quickstart

```ts
import { vector, matrix, stats } from "rustkit";

vector.add(new Float32Array([1, 2, 3]), new Float32Array([10, 20, 30]));
// Float32Array(3) [ 11, 22, 33 ]

matrix.mul(new Float32Array([1, 2, 3, 4]), new Float32Array([5, 6, 7, 8]), 2, 2, 2);
// Float32Array(4) [ 19, 22, 43, 50 ]

stats.mean(new Float32Array([1, 2, 3, 4]));
// 2.5
```

## Supported platforms

| Platform | Binary |
|---|---|
| macOS arm64 | `darwin-arm64` |
| macOS x64 | `darwin-x64` |
| Linux x64 (glibc) | `linux-x64-gnu` |
| Linux arm64 (glibc) | `linux-arm64-gnu` |
| Linux x64 (musl) | `linux-x64-musl` |
| Linux arm64 (musl) | `linux-arm64-musl` |

Linux binaries are cross-compiled; verification on native hardware is planned.

## Versioning

`0.x`: minor bumps may break the API. The API stabilizes toward `1.0.0`.

## Usage notes

- Call the TypeScript wrappers, not `dlopen` directly. The wrappers validate inputs; the Rust core asserts preconditions and a panic inside `extern "C"` aborts the process.
- All vector operations are `f32` (`Float32Array`).
- Mutating operations (clamp, sort, zscore) never mutate the caller's array — the wrappers copy first.

## Development

Every `assert!`/`assert_eq!` in rustkit-core must have a corresponding input-validation throw in the TS wrapper (`src/packages/*.ts`) that fires first. Rust must never panic on user input through the published API.

## License

MIT