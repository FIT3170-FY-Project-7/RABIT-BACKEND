import {NextFunction, Request, Response} from "express";
import {addResponseHeaders} from "./utils";
import {BadRequestResponse} from "./RestErrorResponse";
import {InvalidCredentialsError, InvalidSignUpError} from "./User/UserInterfaces/AuthError";
import {LoginData, SignUpData} from "./User/UserInterfaces/Auth";

/**
 * Express error handler for JSON parse errors and any other errors that should be notified to the client but is not
 * handled by the other error handlers.
 * @param err Error instance of the type that should be handled by this handler
 * @param req Express request
 * @param res Express response
 * @param next callback to next function
 */
export function badRequestErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err)
    }
    let errObject = new BadRequestResponse(err.message, req.path);
    addResponseHeaders(res);

    console.error(err.stack)

    res.status(errObject.status);
    res.json(errObject);
}

/**
 * Express error handler for invalid login.
 * @param err Error instance of the type that should be handled by this handler
 * @param req Express login request
 * @param res Express login response
 * @param next callback to next function
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
 * @param err Error instance of the type that should be handled by this handler
 * @param req Express signup request
 * @param res Express signup response
 * @param next callback to next function
 */
export function invalidSignUpErrorHandler(err: InvalidSignUpError, req: Request<SignUpData>, res: Response<InvalidSignUpError>, next: NextFunction) {
    if (res.headersSent || !(err instanceof InvalidSignUpError)) {
        return next(err)
    }
    addResponseHeaders(res);
    res.status(err.status);
    res.json(err);
}