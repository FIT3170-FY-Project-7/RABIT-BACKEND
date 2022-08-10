import { Router, Request, Response } from "express";

import validateType from "../ValidateType";
import { ShareGenerateValidator, ShareGenerate } from "./ShareInterfaces/ShareGenerate";
import { generateShareURL } from "./ShareServices/ShareService";

const router = Router();

// Route to this controller: /share

/**
 * Generate a share link for a given CornerPlot
 */
router.post("", (req: Request, res: Response, next) => {
    try {
        // Validate the request body
        const body = validateType(
            req.body,
            ShareGenerateValidator
        ) as ShareGenerate;

        res.status(200).send(generateShareURL(body));
    } catch (e) {
        // TODO: Work out how to handle error messages
        res.status(400).send(e.message);
    }
});

/**
 * Get data for generating a shared corner plot, given its shared id
 */
router.get("/:id", (req: Request, res: Response, next) => {
    const id = req.params.id;

    // TODO: Add some functionality here
    res.send("In Progress");
});

export default router;
