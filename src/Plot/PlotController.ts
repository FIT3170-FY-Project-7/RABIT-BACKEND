import { Router, Request, Response } from "express";
import validateBody from "../ValidateBody";
import { TypedRequestBody, TypedResponse } from "../TypedExpressIO";
import {
  SavePlotDataValidator,
  SavePlotData
} from "./PlotInterfaces/SavePlotData";
import { savePlotData, getPlotData } from "./PlotServices/PlotService";
import { FullCornerPlotConfig } from "./PlotInterfaces/GetPlotDataDTOs";

const router = Router();

// Route to this controller: /plot

/**
 * Generate a share link for a given CornerPlot
 */
router.post(
  "",
  validateBody(SavePlotDataValidator),
  async (req: TypedRequestBody<SavePlotData>, res: Response) => {
    try {
      await savePlotData(req.body);
      res.sendStatus(200);
    } catch (e) {
      console.error(e.message);
      res.status(400).send("Error: The query could not be completed");
    }
  }
);

/**
 * Get data for generating a shared corner plot, given its shared id
 */
router.get(
  "/:id",
  async (req: Request, res: TypedResponse<FullCornerPlotConfig>) => {
    try {
      res.status(200).send(await getPlotData(req.params.id));
    } catch (e) {
      console.error(e.message);
      res.status(404).send("Error: Corner plot not found");
    }
  }
);

export default router;
