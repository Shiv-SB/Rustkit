# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Vector operations: add, sub, mul, div, dot, cross, norm, normalize, scale, argmin, argmax, sum, mean, lerp, clamp, abs, min, max, sqrt, reciprocal, l1Norm, lInfNorm, outer, argsort
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
- NEON SIMD kernels for hot reductions on Apple Silicon
- npm packaging: platform binary resolver, dist bundling, multi-platform build scripts, release orchestrator