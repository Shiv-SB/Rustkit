import { nativeFft, ptr } from "../native";

/**
 * Computes the forward complex FFT in-place on copies of the inputs.
 *
 * @param real - Real component of the input (not mutated).
 * @param imag - Imaginary component of the input (not mutated).
 * @returns The transformed `{ real, imag }` arrays, each the same
 * length as the inputs.
 * @throws {Error} If `real` and `imag` have different lengths.
 */
export function fft(
    real: Float32Array,
    imag: Float32Array
): { real: Float32Array; imag: Float32Array } {
    if (real.length !== imag.length) {
        throw new Error("Vectors must have the same length");
    }

    const outReal = new Float32Array(real);
    const outImag = new Float32Array(imag);

    nativeFft.symbols.rk_fft_fft_f32(
        ptr(outReal),
        ptr(outImag),
        outReal.length
    );

    return { real: outReal, imag: outImag };
}

/**
 * Computes the inverse complex FFT in-place on copies of the inputs.
 *
 * @param real - Real component of the input (not mutated).
 * @param imag - Imaginary component of the input (not mutated).
 * @returns The inverse-transformed `{ real, imag }` arrays, each the
 * same length as the inputs.
 * @throws {Error} If `real` and `imag` have different lengths.
 */
export function ifft(
    real: Float32Array,
    imag: Float32Array
): { real: Float32Array; imag: Float32Array } {
    if (real.length !== imag.length) {
        throw new Error("Vectors must have the same length");
    }

    const outReal = new Float32Array(real);
    const outImag = new Float32Array(imag);

    nativeFft.symbols.rk_fft_ifft_f32(
        ptr(outReal),
        ptr(outImag),
        outReal.length
    );

    return { real: outReal, imag: outImag };
}

/**
 * Computes the FFT of a real-valued signal.
 *
 * @param real - Real input signal of length `n`.
 * @returns The complex spectrum `{ real, imag }` of length
 * `floor(n / 2) + 1`.
 */
export function rfft(
    real: Float32Array
): { real: Float32Array; imag: Float32Array } {
    const outLen = Math.floor(real.length / 2) + 1;
    const realOut = new Float32Array(outLen);
    const imagOut = new Float32Array(outLen);

    nativeFft.symbols.rk_fft_rfft_f32(
        ptr(real),
        ptr(realOut),
        ptr(imagOut),
        real.length
    );

    return { real: realOut, imag: imagOut };
}

/**
 * Computes the inverse of `rfft` for a complex spectrum.
 *
 * The output length is assumed to be `2 * (real.length - 1)`
 * (i.e. the spectrum came from an even-length real signal).
 *
 * @param real - Real component of the spectrum.
 * @param imag - Imaginary component of the spectrum.
 * @returns The real-valued reconstructed signal of length
 * `2 * (real.length - 1)`.
 * @throws {Error} If `real` and `imag` have different lengths or are empty.
 */
export function irfft(
    real: Float32Array,
    imag: Float32Array
): Float32Array {
    if (real.length !== imag.length) {
        throw new Error("Vectors must have the same length");
    }
    if (real.length === 0) {
        throw new Error("Vector must not be empty");
    }

    const out = new Float32Array(2 * (real.length - 1));

    nativeFft.symbols.rk_fft_irfft_f32(
        ptr(real),
        ptr(imag),
        ptr(out),
        real.length
    );

    return out;
}

/**
 * Convolves two real-valued signals via FFT.
 *
 * @param a - First input signal.
 * @param b - Second input signal.
 * @returns The convolution of `a` and `b` with length
 * `a.length + b.length - 1` (empty if either input is empty).
 */
export function convolve(
    a: Float32Array,
    b: Float32Array
): Float32Array {
    if (a.length === 0 || b.length === 0) {
        return new Float32Array(0);
    }

    const out = new Float32Array(a.length + b.length - 1);

    nativeFft.symbols.rk_fft_convolve_f32(
        ptr(a),
        a.length,
        ptr(b),
        b.length,
        ptr(out)
    );

    return out;
}

/**
 * Computes the power spectral density of a real-valued signal.
 *
 * @param real - Real input signal of length `n`.
 * @returns The power spectrum of length `floor(n / 2) + 1`.
 */
export function powerSpectrum(
    real: Float32Array
): Float32Array {
    const outLen = Math.floor(real.length / 2) + 1;
    const out = new Float32Array(outLen);

    nativeFft.symbols.rk_fft_power_spectrum_f32(
        ptr(real),
        ptr(out),
        real.length
    );

    return out;
}
