import { Response } from "express";

/**
 * Add security headers for all API responses
 *
 * ref: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#security-headers
 * @param res Express response object
 */
export function addResponseHeaders<T>(res: Response<T>) {
    res.set("Cache-Control", "no-store");
    res.set("Content-Security-Policy", "frame-ancestors 'none'");
    res.set("X-Content-Type-Options", "nosniff");
    res.set("X-Frame-Options", "DENY");
}

/**
 * Checks whether an arbitrary value is the the key of an object
 * 
 * Reference: https://stackoverflow.com/a/53521213
 * @param obj Object to check in
 * @param possibleKey Key to check for in obj
 * @returns Boolean indicating whether possibleKey is a key of obj
 */
export function isKeyOf<T extends object>(obj: T, possibleKey: keyof any): possibleKey is keyof T {
    return possibleKey in obj;
  }