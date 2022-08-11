import { Router, Request, Response } from "express";
import { RestErrorResponse, BadRequestResponse, sendBadRequest } from "../RestErrorResponse";
import { addResponseHeaders } from "../Utils";
import { InvalidCredentialsError, login, Login, LoginResponse } from "./UserService";

const router = Router();

class InvalidCredentialsResponse extends RestErrorResponse {
    constructor(error: InvalidCredentialsError, req: Request<Login>) {
        super("/errors/invalid-credentials", "Invalid Credentials", 404, error.message, req.path)
    }
}

// User authentication controllers

// Login
// Route: /login
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

export default router;
