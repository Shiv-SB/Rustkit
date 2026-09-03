# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-09-03

### Added

- Vector operations: add, sub, mul, div, dot, cross, norm, normalize, scale, argmin, argmax, sum, mean, lerp, clamp, abs, min, max, sqrt, reciprocal, l1Norm, lInfNorm, outer, argsort, sort
- Matrix operations: mul, transpose, determinant, inverse, add, sub, trace, eye, scale, hadamard, frobeniusNorm, luDecompose, cholesky, eigenvalues
- Stats: mean, median, variance, stddev, percentile, quantile, covariance, correlation, zscore, histogram, mode, skewness, kurtosis, geometricMean, weightedMean, iqr
- Bitset: create, set, clear, toggle, popcount, and, or, xor, nextSetBit, cardinality
- String: levenshtein, hamming, fuzzyMatch, longestCommonSubseq, longestCommonSubstr, damerauLevenshtein, jaroWinkler, trigramSimilarity, soundex
- Geohash: encode, decode, neighbor, distance, isValid, allNeighbors, bbox
- Crypto: crc32, xxhash64, fnv1a, blake3, murmur3
- Quantile: TDigest, CountMinSketch, BloomFilter, HyperLogLog, MinHash
- Distance: euclidean, manhattan, cosineSimilarity, hammingDistance, jaccardSimilarity, chebyshev
- FFT: fft, ifft, rfft, irfft, convolve, powerSpectrum
- Entropy: shannonEntropy, crossEntropy, klDivergence, mutualInformation
- Quantize: quantizeInt8, dequantizeInt8, quantizeInt4, dequantizeInt4
- Config: runtime introspection of library version, resolved platform, native binary path, and SIMD backend (version, platform, binaryPath, simd)
- NEON SIMD kernels for hot reductions on Apple Silicon
- npm packaging: platform binary resolver, dist bundling, multi-platform build scripts, release orchestrator

### Changed

- `soundex` now throws on empty or non-ASCII-alphabetic input instead of panicking in the native layer
- `tDigestAdd` throws "TDigest is full" when the digest is at capacity; `tDigestQuantile` validates `q` is in `[0, 1]`
- `geohash.encode` validates precision is in `[1, 12]`; `geohash.neighbor` validates direction is in `[0, 7]`
- `fft.rfft` and `fft.powerSpectrum` throw on empty input
- `quantizeInt8`, `quantizeInt4`, and `dequantizeInt8` throw on empty input
- `matrix.eye` validates `n` is a positive integer
- `config.version` is sourced from `rustkit-ffi` (the crate that drives the release)
- Linux binary resolution detects musl at runtime instead of always trying gnu first
- Release pipeline steps now run sequentially and fail fast on non-zero exit codes