import {NextFunction, Request, Response, Router} from "express";
import {addResponseHeaders} from "../utils";
import {createAccount, login} from "./UserServices/FirebaseUserService";
import cors from "cors";
import {
    LoginData,
    LoginDataValidator,
    LoginResponse,
    SignUpData,
    SignUpDataValidator,
    SignUpResponse
} from "./UserInterfaces/Auth";
import {TypedRequestBody} from "../TypedExpressIO";
import validateBody from "../ValidateBody";

const router = Router();

// CORS config
let corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "X-Requested-With"]
};

// User authentication controllers

// Login
// Route: /login
// Input:
//  email: string,
//  password: string,
router.options("/login", cors(corsOptions));
router.post("/login", cors(corsOptions), validateBody(LoginDataValidator), (req: TypedRequestBody<LoginData>, res: Response<LoginResponse>, next: NextFunction) => {
    login(req.body)
        .then((token) => {
            addResponseHeaders(res);
            return res.json({ jwt: token });
        })
        .catch((e) => {
            next(e);
        })
})

// Signup
// Route: /signup
// Input:
//  email: string,
//  displayName: string,
//  password: string,
router.options("/signup", cors(corsOptions));
router.post("/signup", cors(corsOptions), validateBody(SignUpDataValidator), (req: Request<SignUpData>, res: Response<SignUpResponse>, next: NextFunction) => {
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

export default router;
