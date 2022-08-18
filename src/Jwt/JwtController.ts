import { JsonWebKey } from "crypto";
import { Request, Response, Router } from "express";
import { exportPublickey } from "./JwtService";
import { jwtKey } from "..";
import { addResponseHeaders } from "../Utils";

const router = Router();

export default router;

// Returns public key used for JWT
router.get("/public-key", (req: Request, res: Response<JsonWebKey>) => {
    addResponseHeaders(res);
    return res.json(exportPublickey(jwtKey.publicKey));
});
