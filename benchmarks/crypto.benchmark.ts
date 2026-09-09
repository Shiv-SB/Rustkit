import { crypto as rustCrypto } from "../src/index";
import { bench, summary, run } from "mitata";

const rust_blake3 = rustCrypto.blake3;
const rust_crc32 = rustCrypto.crc32;
const rust_fnv1a = rustCrypto.fnv1a;
const rust_murmur3 = rustCrypto.murmur3;
const rust_xxhash64 = rustCrypto.xxhash64;

const bun_blake2b = new Bun.CryptoHasher("blake2b256");
const bun_blake2s = new Bun.CryptoHasher("blake2s256");
const bun_crc32 = Bun.hash.crc32;
const bun_murmur3 = Bun.hash.murmur32v3;
const bun_xxhash64 = Bun.hash.xxHash64;

const input = new TextEncoder().encode(crypto.randomUUID() + crypto.randomUUID());

summary(() => {
    bench("rustkit blake3", () => {
        rust_blake3(input);
    });

    bench("Bun blake2b", () => {
        bun_blake2b.digest(input);
    });

    bench("Bun blake2s", () => {
        bun_blake2s.digest(input);
    });
});

summary(() => {
    bench("rustkit crc32", () => {
        rust_crc32(input);
    });

    bench("Bun crc32", () => {
        bun_crc32(input);
    });
});

summary(() => {
    bench("rustkit xxhash64", () => {
        rust_xxhash64(input);
    });

    bench("Bun xxhash64", () => {
        bun_xxhash64(input);
    });
});

summary(() => {
    bench("rustkit murmur3", () => {
        rust_murmur3(input);
    });

    bench("Bun murmur3", () => {
        bun_murmur3(input);
    });
});

summary(() => {
    bench("rustkit fnv1a", () => {
        rust_fnv1a(input);
    });
});

await run();
