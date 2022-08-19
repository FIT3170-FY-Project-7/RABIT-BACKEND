import { NextFunction, Request, Response, Router } from "express";
import { addResponseHeaders } from "../Utils";
import { createAccount, InvalidCredentialsError, InvalidSignUpError, login, Login, LoginResponse, SignUpData, SignUpResponse } from "./UserService";

const router = Router();

// User authentication controllers

// Login
// Route: /login
// Input:
//  email: string,
//  password: string,
router.post("/login", (req: Request<Login>, res: Response<LoginResponse>, next: NextFunction) => {
    login(req.body)
        .then((token) => {
            addResponseHeaders(res);
            return res.json({ jwt: token });
        })
        .catch((e) => {
            next(e);
        })
})

/**
 * Express error handler for invalid login.
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns
 */
export function invalidCredentialsErrorHandler(err: InvalidCredentialsError, req: Request<Login>, res: Response<InvalidCredentialsError>, next: NextFunction) {
    if (res.headersSent || !(err instanceof InvalidCredentialsError)) {
        return next(err)
    }
    addResponseHeaders(res);
    res.status(err.status);
    res.json(err);
}

// Signup
// Route: /SignUp
// Input:
//  email: string,
//  displayName: string,
//  password: string,
router.post("/signup", (req: Request<SignUpData>, res: Response<SignUpResponse>, next: NextFunction) => {
    createAccount(req.body)
        .then((token) => {
            addResponseHeaders(res);
            res.status(201);
            return res.json({ jwt: token });
        })
        .catch((e) => {
            next(e);
        })
})

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

export default router;
