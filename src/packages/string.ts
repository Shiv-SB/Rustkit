import { nativeString, ptr } from "../native";

export function levenshtein(a: string, b: string): number {
    const aEncoder = new TextEncoder();
    const bEncoder = new TextEncoder();

    const aBytes = aEncoder.encode(a);
    const bBytes = bEncoder.encode(b);

    return nativeString.symbols.rk_string_levenshtein(
        ptr(aBytes),
        aBytes.length,
        ptr(bBytes),
        bBytes.length
    );
}

export function hamming(a: string, b: string): number {
    const aEncoder = new TextEncoder();
    const bEncoder = new TextEncoder();

    const aBytes = aEncoder.encode(a);
    const bBytes = bEncoder.encode(b);

    if (aBytes.length !== bBytes.length) {
        throw new Error("Strings must have the same length");
    }

    return nativeString.symbols.rk_string_hamming(
        ptr(aBytes),
        aBytes.length,
        ptr(bBytes),
        bBytes.length
    );
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
        ptr(patternBytes),
        patternBytes.length,
        ptr(textBytes),
        textBytes.length,
        ptr(out)
    );

    return found ? out[0] : null;
}

export function longestCommonSubseq(a: string, b: string): number {
    const encoder = new TextEncoder();

    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);

    return nativeString.symbols.rk_string_longest_common_subseq(
        ptr(aBytes),
        aBytes.length,
        ptr(bBytes),
        bBytes.length
    );
}

export function longestCommonSubstr(a: string, b: string): number {
    const encoder = new TextEncoder();

    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);

    return nativeString.symbols.rk_string_longest_common_substr(
        ptr(aBytes),
        aBytes.length,
        ptr(bBytes),
        bBytes.length
    );
}
