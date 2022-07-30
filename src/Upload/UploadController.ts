import { Router, Request, Response } from "express";
const router = Router();

// Route to this controller: /upload

router.get("/", (req: Request, res: Response, next) => {
    res.send("tests")
})

export default router;