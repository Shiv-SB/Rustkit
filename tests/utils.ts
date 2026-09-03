const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function createRandomString(length: number): string {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * 
 * @param min inclusive
 * @param max exclusive
 * @returns 
 */
export function randomInt(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}