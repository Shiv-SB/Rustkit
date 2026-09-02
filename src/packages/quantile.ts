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
    nativeQuantile.symbols.rk_quantile_t_digest_add(
        ptr(digest.means),
        ptr(digest.counts),
        ptr(new Uint32Array([digest.numCentroids])),
        digest.maxCentroids,
        value
    );

    digest.numCentroids++;
}

export function tDigestQuantile(digest: TDigest, q: number): number {
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
    nativeQuantile.symbols.rk_quantile_bloom_filter_insert(
        ptr(bits),
        numBits,
        ptr(item),
        item.length,
        numHashes
    );
}
