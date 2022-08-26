import { Router, Request, Response } from "express";
import validateBody from "../ValidateBody";
import { TypedRequestBody } from "../TypedExpressIO";
import {
    SavePlotDataValidator,
    SavePlotData,
} from "./PlotInterfaces/SavePlotData";
import { savePlotData } from "./PlotServices/PlotService";

const router = Router();

// Route to this controller: /plot

/**
 * Generate a share link for a given CornerPlot
 */
router.post(
    "",
    validateBody(SavePlotDataValidator),
    (req: TypedRequestBody<SavePlotData>, res: Response) => {
        res.status(200).send(savePlotData(req.body));
    }
);

/**
 * Get data for generating a shared corner plot, given its shared id
 */
router.get("/:id", (req: Request, res: Response, next) => {
    const id = req.params.id;

    // TODO: Add some functionality here
    res.send("In Progress");
});

export default router;
