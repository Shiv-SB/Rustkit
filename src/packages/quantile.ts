import { nativeQuantile, ptr } from "../native";

export interface TDigest {
    means: Float32Array;
    counts: Float32Array;
    numCentroids: number;
    maxCentroids: number;
}

export function createTDigest(maxCentroids: number = 100): TDigest {
    return {
        means: new Float32Array(maxCentroids),
        counts: new Float32Array(maxCentroids),
        numCentroids: 0,
        maxCentroids,
    };
}

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

export function createCountMinSketch(
    depth: number,
    width: number
): Uint32Array {
    return new Uint32Array(depth * width);
}

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

export function createBloomFilter(numBits: number): BigUint64Array {
    const numWords = Math.ceil(numBits / 64);
    return new BigUint64Array(numWords);
}

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

export function hyperloglogEstimate(sketch: Uint8Array): number {
    if (sketch.length === 0) {
        throw new Error("Sketch must not be empty");
    }

    return nativeQuantile.symbols.rk_quantile_hyperloglog_estimate(
        ptr(sketch),
        sketch.length
    );
}

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
