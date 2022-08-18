import { NextFunction, Request, Response, Router } from "express";
import { RestErrorResponse } from "../RestErrorResponse";
import { addResponseHeaders } from "../Utils";
import { createAccount, InvalidCredentialsError, InvalidSignUpError, login, Login, LoginResponse, SignUpData, SignUpResponse } from "./UserService";

const router = Router();

class InvalidCredentialsResponse extends RestErrorResponse {
    constructor(error: InvalidCredentialsError, req: Request<Login>) {
        super("/errors/invalid-credentials", "Invalid Credentials", 404, error.message, req.path)
    }
}

class InvalidSignUpResponse extends RestErrorResponse {
    constructor(error: InvalidSignUpError, req: Request<SignUpData>) {
        super("/errors/invalid-signup", "Invalid Sign-Up", 404, error.message, req.path)
    }
}

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

export function invalidCredentialsErrorHandler(err: InvalidCredentialsError, req: Request<Login>, res: Response<InvalidCredentialsResponse>, next: NextFunction) {
    if (res.headersSent) {
        return next(err)
    }
    let errObject = new InvalidCredentialsResponse(err, req);
    addResponseHeaders(res);
    res.status(errObject.status);
    res.json(errObject);

}

// Signup
// Route: /SignUp
// Input:
//  email: string,
//  displayName: string,
//  password: string,
router.post("/SignUp", (req: Request<SignUpData>, res: Response<SignUpResponse>, next: NextFunction) => {
    createAccount(req.body)
        .then((token) => {
            addResponseHeaders(res);
            return res.json({ jwt: token });
        })
        .catch((e) => {
            next(e);
        })
})

export function invalidSignUpErrorHandler(err: InvalidSignUpError, req: Request<SignUpData>, res: Response<InvalidSignUpResponse>, next: NextFunction) {
    if (res.headersSent) {
        return next(err)
    }
    let errObject = new InvalidSignUpResponse(err, req);
    addResponseHeaders(res);
    res.status(errObject.status);
    res.json(errObject);
}

export default router;
