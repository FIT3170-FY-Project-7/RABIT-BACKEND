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
    res.set("Content-Type", "application/json");
    res.set("X-Content-Type-Options", "nosniff");
    res.set("X-Frame-Options", "DENY");
}
