import { nativeString, ptr } from "../native";

// Bun's `ptr()` rejects empty typed arrays (null backing pointer), so pass a
// dummy 1-byte buffer when the input is empty and rely on the length argument.
const EMPTY = new Uint8Array(1);

function ffiPtr(bytes: Uint8Array) {
    return bytes.length === 0 ? ptr(EMPTY) : ptr(bytes);
}

export function levenshtein(a: string, b: string): number {
    const encoder = new TextEncoder();

    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);

    return Number(nativeString.symbols.rk_string_levenshtein(
        ffiPtr(aBytes),
        aBytes.length,
        ffiPtr(bBytes),
        bBytes.length
    ));
}

export function hamming(a: string, b: string): number {
    const encoder = new TextEncoder();

    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);

    if (aBytes.length !== bBytes.length) {
        throw new Error("Strings must have the same length");
    }

    return Number(nativeString.symbols.rk_string_hamming(
        ffiPtr(aBytes),
        aBytes.length,
        ffiPtr(bBytes),
        bBytes.length
    ));
}

export function fuzzyMatch(
    pattern: string,
    text: string
): number | null {
    const encoder = new TextEncoder();

    const patternBytes = encoder.encode(pattern);
    const textBytes = encoder.encode(text);

    const out = new Uint32Array(1);

    const found = nativeString.symbols.rk_string_fuzzy_match(
        ffiPtr(patternBytes),
        patternBytes.length,
        ffiPtr(textBytes),
        textBytes.length,
        ptr(out)
    );

    return found ? out[0]! : null;
}

export function longestCommonSubseq(a: string, b: string): number {
    const encoder = new TextEncoder();

    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);

    return Number(nativeString.symbols.rk_string_longest_common_subseq(
        ffiPtr(aBytes),
        aBytes.length,
        ffiPtr(bBytes),
        bBytes.length
    ));
}

export function longestCommonSubstr(a: string, b: string): number {
    const encoder = new TextEncoder();

    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);

    return Number(nativeString.symbols.rk_string_longest_common_substr(
        ffiPtr(aBytes),
        aBytes.length,
        ffiPtr(bBytes),
        bBytes.length
    ));
}

export function damerauLevenshtein(a: string, b: string): number {
    const encoder = new TextEncoder();

    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);

    return Number(nativeString.symbols.rk_string_damerau_levenshtein(
        ffiPtr(aBytes),
        aBytes.length,
        ffiPtr(bBytes),
        bBytes.length
    ));
}

export function jaroWinkler(a: string, b: string): number {
    const encoder = new TextEncoder();

    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);

    return nativeString.symbols.rk_string_jaro_winkler(
        ffiPtr(aBytes),
        aBytes.length,
        ffiPtr(bBytes),
        bBytes.length
    );
}

export function trigramSimilarity(a: string, b: string): number {
    const encoder = new TextEncoder();

    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);

    return nativeString.symbols.rk_string_trigram_similarity(
        ffiPtr(aBytes),
        aBytes.length,
        ffiPtr(bBytes),
        bBytes.length
    );
}

export function soundex(input: string): string {
    const encoder = new TextEncoder();

    const inputBytes = encoder.encode(input);

    const out = new Uint8Array(4);

    nativeString.symbols.rk_string_soundex(
        ffiPtr(inputBytes),
        inputBytes.length,
        ptr(out)
    );

    return new TextDecoder().decode(out);
}