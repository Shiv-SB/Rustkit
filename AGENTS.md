# AGENTS.md

## What is this

Rust numeric library (`rustkit-core`) exposed to TypeScript via Bun FFI (`rustkit-ffi`). All numeric work happens in Rust; TypeScript wraps it through `bun:ffi` dlopen.

## Build & verify order

1. **Compile Rust → `bun run compile:rs`** (runs `cargo build --release -p rustkit-ffi`). Must run before tests or anything that calls native code. Output is `target/release/librustkit_ffi.{so,dylib,dll}`.
2. **Tests → `bun test`**. Coverage is always on (`bunfig.toml`).
3. **Typecheck → `bun run typecheck`** (`tsc --noEmit`).
4. **Benchmarks → `bun run bench`** or `bun run bench vector` to filter by name.

There is no linter configured. Rust has no clippy/rustfmt config checked in.

## Architecture

- **`crates/rustkit-core`** — Pure Rust algorithms. Each operation is its own file under `src/<module>/<operation>.rs`. Modules: vector, matrix, stats, bitset, string, geohash, crypto, quantile, distance, fft, entropy, quantize, config.
- **`crates/rustkit-ffi`** — `#[unsafe(no_mangle)] extern "C"` wrappers around core. Builds as `cdylib`. One FFI file per module (`src/vector.rs`, etc.). Naming: `rk_<module>_<function>_<type>`.
- **`src/native.ts`** — `dlopen` binding listing every FFI symbol with its signature. Add new FFI functions here.
- **`src/packages/*.ts`** — TypeScript wrappers that validate inputs then call `native.symbols.*`. One file per module, re-exported from `src/index.ts` (except `config`, which is a named export, not a namespace).

## Gotchas

- **Always rebuild Rust after editing `crates/`** — tests import from `target/release/` and will use stale binaries otherwise.
- **All vector ops are f32 (`Float32Array`)** — not f64. Mismatched types silently corrupt memory.
- **FFI is in-place for clamp/sort** — the Rust side mutates `*mut f32` directly. The TS wrappers copy first (`new Float32Array(a)`) to avoid mutating the caller's array. Follow this pattern for new mutating ops.
- **Null checks in FFI** — core Rust functions do NOT null-check; the FFI layer does. Keep it that way.
- **No Rust tests in CI** — only TS tests exist under `tests/`. If you add Rust unit tests, run `cargo test -p rustkit-core` separately.
- **Rust edition 2024** — uses `#[unsafe(no_mangle)]` syntax, not the older `#[no_mangle]`.

## Adding a new operation

1. Implement algorithm in `crates/rustkit-core/src/<module>/<operation>.rs`, export from the module's `mod.rs`.
2. Add `extern "C"` wrapper in `crates/rustkit-ffi/src/<module>.rs`.
3. Register the FFI symbol in `src/native.ts` with correct arg/return types.
4. Write TS wrapper in `src/packages/<module>.ts`, re-export from `src/index.ts` if needed.
5. Add tests in `tests/<module>.test.ts`.
6. Update the README Modules section and the CHANGELOG.
7. `bun run compile:rs && bun test && bun run typecheck`.
