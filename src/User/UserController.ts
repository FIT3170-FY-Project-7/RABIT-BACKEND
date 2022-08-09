import { Router, Request, Response } from "express";
import { Login, LoginResponse } from "./UserService";

const router = Router();

// User authentication controllers

// Login
// Route: /login
router.post("/login", (req: Request<Login>, res: Response<LoginResponse>) => {
    return { jwt: "" }; // TODO
})

export default router;
