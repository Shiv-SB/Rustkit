import { nativeQuantile, ptr } from "../native";

/**
 * A t-digest sketch: a compressed representation of a distribution that
 * supports streaming updates and approximate quantile queries.
 */
export interface TDigest {
    /** Centroid means (length `maxCentroids`). */
    means: Float32Array;
    /** Centroid weights (length `maxCentroids`). */
    counts: Float32Array;
    /** Number of centroids currently in use. */
    numCentroids: number;
    /** Maximum number of centroids before the sketch rejects additions. */
    maxCentroids: number;
}

/**
 * Creates an empty t-digest sketch.
 *
 * @param maxCentroids - Maximum number of centroids (default 100).
 * @returns A new empty TDigest.
 */
export function createTDigest(maxCentroids: number = 100): TDigest {
    return {
        means: new Float32Array(maxCentroids),
        counts: new Float32Array(maxCentroids),
        numCentroids: 0,
        maxCentroids,
    };
}

/**
 * Adds a value to a t-digest sketch, merging it into the nearest centroid.
 *
 * @param digest - The t-digest sketch to update.
 * @param value - Value to add.
 * @throws {Error} If the sketch has reached `maxCentroids` centroids.
 */
export function tDigestAdd(digest: TDigest, value: number): void {
    if (digest.numCentroids >= digest.maxCentroids) {
        throw new Error("TDigest is full");
    }

    digest.numCentroids = Number(nativeQuantile.symbols.rk_quantile_t_digest_add(
        ptr(digest.means),
        ptr(digest.counts),
        digest.numCentroids,
        digest.maxCentroids,
        value
    ));
}

/**
 * Estimates the `q`-th quantile of the data added to a t-digest sketch.
 *
 * @param digest - The t-digest sketch to query.
 * @param q - Quantile in `[0, 1]`.
 * @returns The estimated quantile value.
 * @throws {Error} If `q` is outside `[0, 1]`.
 */
export function tDigestQuantile(digest: TDigest, q: number): number {
    if (q < 0 || q > 1) {
        throw new Error("q must be between 0 and 1");
    }

    return nativeQuantile.symbols.rk_quantile_t_digest_quantile(
        ptr(digest.means),
        ptr(digest.counts),
        digest.numCentroids,
        q
    );
}

/**
 * Creates an empty count-min sketch with `depth` hash functions over
 * `width` counters each.
 *
 * @param depth - Number of hash functions.
 * @param width - Number of counters per hash function.
 * @returns A new zeroed Uint32Array of length `depth * width`.
 */
export function createCountMinSketch(
    depth: number,
    width: number
): Uint32Array {
    return new Uint32Array(depth * width);
}

/**
 * Adds an item to a count-min sketch, incrementing its counters.
 *
 * @param table - The sketch from `createCountMinSketch`.
 * @param depth - Number of hash functions.
 * @param width - Number of counters per hash function.
 * @param item - Item bytes to add.
 * @throws {Error} If `depth` or `width` is not positive, or `table` does
 * not have length `depth * width`.
 */
export function countMinSketchAdd(
    table: Uint32Array,
    depth: number,
    width: number,
    item: Uint8Array
): void {
    if (depth <= 0) {
        throw new Error("Depth must be greater than 0");
    }
    if (width <= 0) {
        throw new Error("Width must be greater than 0");
    }
    if (table.length !== depth * width) {
        throw new Error("table must have length depth * width");
    }

    nativeQuantile.symbols.rk_quantile_count_min_sketch_add(
        ptr(table),
        depth,
        width,
        ptr(item),
        item.length
    );
}

/**
 * Creates an empty bloom filter over `numBits` bits.
 *
 * @param numBits - Number of bits in the filter.
 * @returns A new zeroed BigUint64Array of length `ceil(numBits / 64)`.
 */
export function createBloomFilter(numBits: number): BigUint64Array {
    const numWords = Math.ceil(numBits / 64);
    return new BigUint64Array(numWords);
}

/**
 * Inserts an item into a bloom filter, setting `numHashes` bit positions.
 *
 * @param bits - The filter from `createBloomFilter`.
 * @param numBits - Number of bits in the filter.
 * @param item - Item bytes to insert.
 * @param numHashes - Number of hash functions to apply.
 * @throws {Error} If `numBits` or `numHashes` is not positive, or `bits`
 * does not have length `ceil(numBits / 64)`.
 */
export function bloomFilterInsert(
    bits: BigUint64Array,
    numBits: number,
    item: Uint8Array,
    numHashes: number
): void {
    if (numBits <= 0) {
        throw new Error("numBits must be greater than 0");
    }
    if (numHashes <= 0) {
        throw new Error("numHashes must be greater than 0");
    }
    if (bits.length !== Math.ceil(numBits / 64)) {
        throw new Error("bits must have length ceil(numBits / 64)");
    }

    nativeQuantile.symbols.rk_quantile_bloom_filter_insert(
        ptr(bits),
        numBits,
        ptr(item),
        item.length,
        numHashes
    );
}

/**
 * Estimates the frequency of an item in a count-min sketch.
 *
 * @param table - The sketch from `createCountMinSketch`.
 * @param depth - Number of hash functions.
 * @param width - Number of counters per hash function.
 * @param item - Item bytes to query.
 * @returns The minimum count across the item's `depth` counters (an
 * upper bound on the true frequency).
 * @throws {Error} If `depth` or `width` is not positive, or `table` does
 * not have length `depth * width`.
 */
export function countMinSketchQuery(
    table: Uint32Array,
    depth: number,
    width: number,
    item: Uint8Array
): number {
    if (depth <= 0) {
        throw new Error("Depth must be greater than 0");
    }
    if (width <= 0) {
        throw new Error("Width must be greater than 0");
    }
    if (table.length !== depth * width) {
        throw new Error("table must have length depth * width");
    }

    return nativeQuantile.symbols.rk_quantile_count_min_sketch_query(
        ptr(table),
        depth,
        width,
        ptr(item),
        item.length
    );
}

/**
 * Checks whether an item may be present in a bloom filter.
 *
 * @param bits - The filter from `createBloomFilter`.
 * @param numBits - Number of bits in the filter.
 * @param item - Item bytes to check.
 * @param numHashes - Number of hash functions to apply.
 * @returns `true` if the item is possibly present (no false negatives),
 * `false` if it is definitely absent.
 * @throws {Error} If `numBits` or `numHashes` is not positive, or `bits`
 * does not have length `ceil(numBits / 64)`.
 */
export function bloomFilterContains(
    bits: BigUint64Array,
    numBits: number,
    item: Uint8Array,
    numHashes: number
): boolean {
    if (numBits <= 0) {
        throw new Error("numBits must be greater than 0");
    }
    if (numHashes <= 0) {
        throw new Error("numHashes must be greater than 0");
    }
    if (bits.length !== Math.ceil(numBits / 64)) {
        throw new Error("bits must have length ceil(numBits / 64)");
    }

    return nativeQuantile.symbols.rk_quantile_bloom_filter_contains(
        ptr(bits),
        numBits,
        ptr(item),
        item.length,
        numHashes
    );
}

/**
 * Creates an empty HyperLogLog sketch with the given precision.
 *
 * @param precision - Register index bits, an integer in `[4, 16]`.
 * @returns A new zeroed Uint8Array of length `2^precision`.
 * @throws {Error} If `precision` is outside `[4, 16]`.
 */
export function hyperloglogCreate(precision: number): Uint8Array {
    if (precision < 4 || precision > 16) {
        throw new Error("Precision must be between 4 and 16");
    }

    const sketch = new Uint8Array(1 << precision);

    nativeQuantile.symbols.rk_quantile_hyperloglog_create(
        precision,
        ptr(sketch),
        sketch.length
    );

    return sketch;
}

/**
 * Adds an item to a HyperLogLog sketch, updating its registers.
 *
 * @param sketch - The sketch from `hyperloglogCreate`.
 * @param item - Item bytes to add.
 * @throws {Error} If `sketch` is empty or its length is not a power of two.
 */
export function hyperloglogAdd(sketch: Uint8Array, item: Uint8Array): void {
    if (sketch.length === 0) {
        throw new Error("Sketch must not be empty");
    }
    if ((sketch.length & (sketch.length - 1)) !== 0) {
        throw new Error("Sketch length must be a power of two");
    }

    nativeQuantile.symbols.rk_quantile_hyperloglog_add(
        ptr(sketch),
        sketch.length,
        ptr(item),
        item.length
    );
}

/**
 * Estimates the number of distinct items added to a HyperLogLog sketch.
 *
 * @param sketch - The sketch from `hyperloglogCreate`.
 * @returns The estimated cardinality.
 * @throws {Error} If `sketch` is empty.
 */
export function hyperloglogEstimate(sketch: Uint8Array): number {
    if (sketch.length === 0) {
        throw new Error("Sketch must not be empty");
    }

    return nativeQuantile.symbols.rk_quantile_hyperloglog_estimate(
        ptr(sketch),
        sketch.length
    );
}

/**
 * Creates an empty MinHash signature of `numHashes` 32-bit hash values.
 *
 * @param numHashes - Number of hash functions, a positive integer.
 * @returns A new Uint32Array signature with all registers set to the
 * maximum value.
 * @throws {Error} If `numHashes` is not positive.
 */
export function minhashCreate(numHashes: number): Uint32Array {
    if (numHashes <= 0) {
        throw new Error("numHashes must be greater than 0");
    }

    const signature = new Uint32Array(numHashes);

    nativeQuantile.symbols.rk_quantile_minhash_create(
        numHashes,
        ptr(signature),
        signature.length
    );

    return signature;
}

/**
 * Folds an item into a MinHash signature, keeping per-register minima.
 *
 * @param signature - The signature from `minhashCreate`.
 * @param item - Item bytes to add.
 * @throws {Error} If `signature` is empty.
 */
export function minhashAdd(signature: Uint32Array, item: Uint8Array): void {
    if (signature.length === 0) {
        throw new Error("Signature must not be empty");
    }

    nativeQuantile.symbols.rk_quantile_minhash_add(
        ptr(signature),
        signature.length,
        ptr(item),
        item.length
    );
}

/**
 * Estimates the Jaccard similarity between two sets from their MinHash
 * signatures.
 *
 * @param a - First signature.
 * @param b - Second signature.
 * @returns The estimated similarity in `[0, 1]` (fraction of matching
 * registers).
 * @throws {Error} If `a` and `b` have different lengths or are empty.
 */
export function minhashSimilarity(a: Uint32Array, b: Uint32Array): number {
    if (a.length !== b.length) {
        throw new Error("Signatures must have the same length");
    }
    if (a.length === 0) {
        throw new Error("Signatures must not be empty");
    }

    return nativeQuantile.symbols.rk_quantile_minhash_similarity(
        ptr(a),
        a.length,
        ptr(b),
        b.length
    );
}
