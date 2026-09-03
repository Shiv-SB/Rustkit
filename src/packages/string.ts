import { nativeString, ptr } from "../native";

// Bun's `ptr()` rejects empty typed arrays (null backing pointer), so pass a
// dummy 1-byte buffer when the input is empty and rely on the length argument.
const EMPTY = new Uint8Array(1);

function ffiPtr(bytes: Uint8Array) {
    return bytes.length === 0 ? ptr(EMPTY) : ptr(bytes);
}

/**
 * Computes the Levenshtein edit distance between two strings.
 *
 * @param a - First string.
 * @param b - Second string.
 * @returns The minimum number of insertions, deletions, and substitutions
 * needed to turn `a` into `b`.
 */
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

/**
 * Computes the Hamming distance between two equal-length strings (number
 * of positions where the characters differ).
 *
 * @param a - First string.
 * @param b - Second string.
 * @returns The number of differing character positions.
 * @throws {Error} If `a` and `b` have different lengths.
 */
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

/**
 * Fuzzy-matches `pattern` against `text`, returning the position of the
 * best subsequence match.
 *
 * @param pattern - Pattern to search for.
 * @param text - Text to search in.
 * @returns The index where the best fuzzy match starts, or `null` if
 * `pattern` does not occur as a subsequence.
 */
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

/**
 * Computes the length of the longest common subsequence of two strings.
 *
 * @param a - First string.
 * @param b - Second string.
 * @returns The LCS length.
 */
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

/**
 * Computes the length of the longest common substring of two strings.
 *
 * @param a - First string.
 * @param b - Second string.
 * @returns The length of the longest contiguous common substring.
 */
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

/**
 * Computes the Damerau-Levenshtein edit distance between two strings,
 * which also allows transpositions of adjacent characters.
 *
 * @param a - First string.
 * @param b - Second string.
 * @returns The minimum edit distance.
 */
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

/**
 * Computes the Jaro-Winkler similarity between two strings.
 *
 * @param a - First string.
 * @param b - Second string.
 * @returns The similarity in `[0, 1]`, where 1 is an exact match.
 */
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

/**
 * Computes the trigram similarity between two strings (fraction of shared
 * character trigrams).
 *
 * @param a - First string.
 * @param b - Second string.
 * @returns The similarity in `[0, 1]`.
 */
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

/**
 * Computes the Soundex code of a name: a letter followed by three digits.
 *
 * @param input - Name to encode, ASCII alphabetic characters only.
 * @returns The 4-character Soundex code.
 * @throws {Error} If `input` is empty or contains non-ASCII-alphabetic
 * characters.
 */
export function soundex(input: string): string {
    if (input.length === 0) {
        throw new Error("Input must not be empty");
    }
    if (!/^[A-Za-z]+$/.test(input)) {
        throw new Error("Input must contain only ASCII alphabetic characters");
    }

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