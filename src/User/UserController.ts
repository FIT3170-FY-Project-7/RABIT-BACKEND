import { Request, Response, Router } from "express";
import { RestErrorResponse, sendBadRequest } from "../RestErrorResponse";
import { addResponseHeaders } from "../Utils";
import { InvalidCredentialsError, InvalidSignUpError, login, Login, LoginResponse, SignUpData, SignUpResponse } from "./UserService";

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
router.post("/login", (req: Request<Login>, res: Response<LoginResponse | InvalidCredentialsResponse>) => {
    try {
        login(req.body)
            .then((token) => {
                addResponseHeaders(res);
                return res.json({ jwt: token });
            })
            .catch((e) => {
                return sendBadRequest(e, req, res);
            })
    } catch (e) {
        if (e instanceof InvalidCredentialsError) {
            let err = new InvalidCredentialsResponse(e, req);
            addResponseHeaders(res);
            res.status(err.status);
            return res.json(err);
        } else {
            return sendBadRequest(e, req, res);
        }
    }
})

// Signup
// Route: /SignUp
// Input:
//  email: string,
//  displayName: string,
//  password: string,
router.post("/SignUp", (req: Request<SignUpData>, res: Response<SignUpResponse | InvalidSignUpResponse>) => {
    try {
        login(req.body)
            .then((token) => {
                addResponseHeaders(res);
                return res.json({ jwt: token });
            })
            .catch((e) => {
                return sendBadRequest(e, req, res);
            })
    } catch (e) {
        if (e instanceof InvalidSignUpError) {
            let err = new InvalidSignUpResponse(e, req);
            addResponseHeaders(res);
            res.status(err.status);
            return res.json(err);
        } else {
            return sendBadRequest(e, req, res);
        }
    }
})

export default router;
