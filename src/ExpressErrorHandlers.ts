import {NextFunction, Request, Response} from "express";
import {addResponseHeaders} from "./utils";
import {BadRequestResponse} from "./RestErrorResponse";
import {InvalidCredentialsError, InvalidSignUpError} from "./User/UserInterfaces/AuthError";
import {LoginData, SignUpData} from "./User/UserInterfaces/Auth";

export function badRequestErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err)
    }
    let errObject = new BadRequestResponse(err.message, req.path);
    addResponseHeaders(res);
    res.status(err.status);
    res.json(errObject);
}

/**
 * Express error handler for invalid login.
 * @param errSignUp
 * @param req
 * @param res
 * @param next
 * @returns
 */
export function invalidCredentialsErrorHandler(err: InvalidCredentialsError, req: Request<LoginData>, res: Response<InvalidCredentialsError>, next: NextFunction) {
    if (res.headersSent || !(err instanceof InvalidCredentialsError)) {
        return next(err)
    }
    addResponseHeaders(res);
    res.status(err.status);
    res.json(err);
}

/**
 * Express error handler for invalid signup.
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns
 */
export function invalidSignUpErrorHandler(err: InvalidSignUpError, req: Request<SignUpData>, res: Response<InvalidSignUpError>, next: NextFunction) {
    if (res.headersSent || !(err instanceof InvalidSignUpError)) {
        return next(err)
    }
    addResponseHeaders(res);
    res.status(err.status);
    res.json(err);
}