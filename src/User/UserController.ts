/**
 * Controller for user-related endpoints e.g. login
 */
import {NextFunction, Request, Response, Router} from "express";
import {addResponseHeaders} from "../utils";
import {createAccount, login} from "./UserServices/FirebaseUserService";
import cors from "cors";
import databaseConnection from "../databaseConnection";
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
router.options("/login", cors(corsOptions)); // Handle CORS preflight
router.post("/login", cors(corsOptions), validateBody(LoginDataValidator), (req: TypedRequestBody<LoginData>, res: Response<LoginResponse>, next: NextFunction) => {
    login(req.body).then((user) => {return user.getIdToken()})
        .then((token) => {
            addResponseHeaders(res);
            return res.json({ jwt: token });
        })
        .catch((e) => {
            res.status(500);
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
    let userVar, resVar:Response<SignUpResponse>;

    createAccount(req.body)
        .then((user) => {
            userVar = user;
            return user.getIdToken()
        })
        .then((token) => {
            addResponseHeaders(res);
            res.status(201);
            let resVar =  res.json({ jwt: token });
        })
        .catch((e) => {
            console.error("Failed api call to firebase auth.", e);
            res.status(500);
            next(e);
        })

    databaseConnection.query(
        `INSERT INTO rabit_user VALUES(?, ?, ?);`,
        [
            req.body.userVar.id,
            req.body.displayName,
            req.body.email
        ],
        (err) => {
            if (err) {
                console.error("Failed to insert into database", err);
                res.status(500);
                next(err)

            } else {
                const message = "User successfully created";
                res.status(201);
                return resVar;
            }
        }
    );
})

export default router;
