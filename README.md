# rustkit

A numeric library for [Bun](https://bun.com), implemented in Rust and exposed through `bun:ffi`. All numeric work happens in Rust — the TypeScript layer is a thin validated wrapper over the native binary.

Hot kernels (dot products, reductions, element-wise ops) use explicit SIMD — NEON on AArch64 (Apple Silicon and Linux arm64) — with auto-vectorized scalar fallbacks on other targets.

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

## Modules

### vector

Element-wise and reduction operations on `Float32Array`.

```ts
import { vector } from "rustkit";

vector.add(new Float32Array([1, 2]), new Float32Array([3, 4]));   // [4, 6]
vector.dot(new Float32Array([1, 2, 3]), new Float32Array([4, 5, 6])); // 32
vector.norm(new Float32Array([3, 4]));                             // 5
vector.argsort(new Float32Array([30, 10, 20]));                    // [1, 2, 0]
```

Also: `sub`, `mul`, `div`, `cross`, `normalize`, `scale`, `argmin`, `argmax`, `sum`, `mean`, `lerp`, `clamp`, `abs`, `min`, `max`, `sqrt`, `reciprocal`, `l1Norm`, `lInfNorm`, `outer`.

### matrix

Row-major `Float32Array` matrices with explicit dimensions.

```ts
import { matrix } from "rustkit";

matrix.mul(new Float32Array([1, 2, 3, 4]), new Float32Array([5, 6, 7, 8]), 2, 2, 2);
// [19, 22, 43, 50]

matrix.transpose(new Float32Array([1, 2, 3, 4, 5, 6]), 2, 3);
// [1, 4, 2, 5, 3, 6]

matrix.determinant(new Float32Array([1, 2, 3, 4]), 2);  // -2
matrix.inverse(new Float32Array([1, 2, 3, 4]), 2);      // [-2, 1, 1.5, -0.5]
matrix.eye(3);                                          // [1, 0, 0, 0, 1, 0, 0, 0, 1]
```

Also: `add`, `sub`, `trace`, `scale`, `hadamard`, `frobeniusNorm`, `luDecompose`, `cholesky`, `eigenvalues`.

### stats

Descriptive statistics over `Float32Array`.

```ts
import { stats } from "rustkit";

stats.mean(new Float32Array([1, 2, 3, 4]));        // 2.5
stats.median(new Float32Array([3, 1, 2]));         // 2
stats.variance(new Float32Array([1, 2, 3, 4, 5])); // 2
stats.correlation(new Float32Array([1, 2, 3]), new Float32Array([2, 4, 6])); // 1
stats.histogram(new Float32Array([1, 2, 3, 4, 5]), 5); // Uint32Array(5) [1, 1, 1, 1, 1]
```

Also: `stddev`, `percentile`, `quantile`, `covariance`, `zscore`, `mode`, `skewness`, `kurtosis`, `geometricMean`, `weightedMean`, `iqr`.

### bitset

Fixed-size bit sets backed by `BigUint64Array`.

```ts
import { bitset } from "rustkit";

const bits = bitset.create(128);
bitset.set(bits, 0);
bitset.set(bits, 127);
bitset.popcount(bits);      // 2
bitset.nextSetBit(bits, 1); // 127
```

Also: `clear`, `toggle`, `and`, `or`, `xor`, `cardinality`.

### string

String similarity and matching algorithms.

```ts
import { string } from "rustkit";

string.levenshtein("kitten", "sitting");        // 3
string.hamming("abc", "axc");                   // 1
string.longestCommonSubseq("abcde", "ace");     // 3
string.soundex("Robert");                       // "R163"
string.jaroWinkler("martha", "marhta");         // ~0.961
```

Also: `fuzzyMatch`, `longestCommonSubstr`, `damerauLevenshtein`, `trigramSimilarity`.

### geohash

Geohash encoding, decoding, neighbors, and distance.

```ts
import { geohash } from "rustkit";

geohash.encode(48.8566, 2.3522, 6);            // "u09tvw"
geohash.decode("u09tun");                      // { lat: ~48.86, lng: ~2.29 }
geohash.distance(48.8566, 2.3522, 52.52, 13.405); // ~877 (km)
geohash.isValid("u09tun");                     // true
```

Also: `neighbor`, `allNeighbors`, `bbox`.

### crypto

Non-cryptographic hashes (fast, deterministic).

```ts
import { crypto } from "rustkit";

crypto.crc32(new TextEncoder().encode("hello"));   // 0x3610a686
crypto.xxhash64(new TextEncoder().encode("test")); // bigint
crypto.blake3(new TextEncoder().encode("hello"));  // Uint8Array(32)
crypto.murmur3(new TextEncoder().encode("hello")); // 0x248bfa47
```

Also: `fnv1a`.

### quantile

Streaming sketches for quantiles, cardinality, and set similarity.

```ts
import { quantile } from "rustkit";

const digest = quantile.createTDigest();
quantile.tDigestAdd(digest, 1);
quantile.tDigestAdd(digest, 2);
quantile.tDigestAdd(digest, 3);
quantile.tDigestQuantile(digest, 0.5); // 1.5

const sketch = quantile.hyperloglogCreate(10);
quantile.hyperloglogAdd(sketch, new TextEncoder().encode("item"));
quantile.hyperloglogEstimate(sketch); // ~1
```

Also: `createCountMinSketch`, `countMinSketchAdd`, `countMinSketchQuery`, `createBloomFilter`, `bloomFilterInsert`, `bloomFilterContains`, `minhashCreate`, `minhashAdd`, `minhashSimilarity`.

### distance

Distance and similarity metrics between vectors.

```ts
import { distance } from "rustkit";

distance.euclidean(new Float32Array([0, 0]), new Float32Array([3, 4])); // 5
distance.manhattan(new Float32Array([0, 0]), new Float32Array([3, 4])); // 7
distance.cosineSimilarity(new Float32Array([1, 0]), new Float32Array([5, 0])); // 1
distance.jaccardSimilarity(new Int32Array([1, 2, 3]), new Int32Array([2, 3, 4])); // 0.5
```

Also: `hammingDistance`, `chebyshev`.

### fft

Fast Fourier transforms and spectral analysis.

```ts
import { fft } from "rustkit";

fft.rfft(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]));
// { real: Float32Array(5), imag: Float32Array(5) }

fft.convolve(new Float32Array([1, 2, 3]), new Float32Array([4, 5]));
// Float32Array(4) — length a + b - 1

fft.powerSpectrum(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]));
// Float32Array(5)
```

Also: `fft`, `ifft`, `irfft`.

### entropy

Information-theoretic measures over probability distributions.

```ts
import { entropy } from "rustkit";

entropy.shannonEntropy(new Float32Array([0.5, 0.5])); // 1
entropy.klDivergence(new Float32Array([0.5, 0.5]), new Float32Array([0.9, 0.1])); // > 0
entropy.crossEntropy(new Float32Array([0.5, 0.5]), new Float32Array([0.9, 0.1]));
```

Also: `mutualInformation`.

### quantize

Symmetric int8/int4 quantization with dequantization.

```ts
import { quantize } from "rustkit";

const { quantized, scale } = quantize.quantizeInt8(new Float32Array([0.5, -0.5, 1, -1]));
quantize.dequantizeInt8(quantized, scale); // ≈ original

const packed = quantize.quantizeInt4(new Float32Array([0.5, -0.5, 1, -1]));
// { quantized: Uint8Array(2), scale } — two 4-bit values per byte
```

Also: `dequantizeInt4`.

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