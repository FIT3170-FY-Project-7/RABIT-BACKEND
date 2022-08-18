import express, { NextFunction, Request, Response } from "express";
import { addResponseHeaders } from "./Utils";

/**
 * API error responses, with structure mostly conforming to RFC 7807.
 *
 * https://www.rfc-editor.org/rfc/rfc7807
 */
export class RestErrorResponse {
    public readonly type: string;
    public readonly title: string;
    public readonly status: number;
    public readonly detail: string;
    public readonly instance: string;

    constructor(type: string, title: string, status: number, detail: string, instance: string) {
        this.type = type;
        this.title = title;
        this.status = status;
        this.detail = detail;
        this.instance = instance;
    }

    toJson(): string {
        return JSON.stringify(this);
    }
}

/**
 * API error for malformed request
 */
class BadRequestResponse extends RestErrorResponse {
    constructor(detail: string, instance: string) {
        super("/errors/bad-request", "Bad Request", 400, detail, instance);
    }
}

export function badRequestErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err)
    }
    let errObject = new BadRequestResponse(err.message, req.path);
    addResponseHeaders(res);
    res.status(err.status);
    res.json(errObject);
}