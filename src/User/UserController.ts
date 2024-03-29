/**
 * Controller for user-related endpoints e.g. login
 */
 import cors from "cors";
import { NextFunction, Request, Response, Router } from "express";
import { User } from "firebase/auth";
import databaseConnection from "../databaseConnection";
import { TypedRequestBody } from "../TypedExpressIO";
import { addResponseHeaders } from "../utils";
import validateBody from "../ValidateBody";
import {
    LoginData,
    LoginDataValidator,
    LoginResponse,
    SignUpData,
    SignUpDataValidator,
    SignUpResponse
} from "./UserInterfaces/Auth";
import { createAccount, login } from "./UserServices/FirebaseUserService";
 
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
     let userVar:User, resVar:Response<SignUpResponse>;
 
     createAccount(req.body)
         .then((user) => {
             userVar = user;
             return user.getIdToken()
         })
         .then((token) => {
             //addResponseHeaders(res);
             //res.status(201);
             resVar = res.json({ jwt: token });
         })
         .then(() => {
             databaseConnection.query(
                 `INSERT INTO rabit_user VALUES(?, ?, ?);`,
                 [
                     userVar.uid,
                     req.body.displayName,
                     req.body.email
                 ]
             );
             return resVar;
         })
         .catch((e) => {
             console.error("Failed api call to firebase auth.", e);
             res.status(500);
             next(e);
         })
 })
 
 export default router;