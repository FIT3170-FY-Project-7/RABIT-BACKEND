import { Router, Request, Response } from "express";
import validateBody from "../ValidateBody";
import { TypedRequestBody, TypedResponse } from "../TypedExpressIO";
import {
  SavePlotDataValidator,
  SavePlotData
} from "./PlotInterfaces/SavePlotData";
import { savePlotData, getPlotData } from "./PlotServices/PlotService";
import { FullCornerPlotData } from "./PlotInterfaces/GetPlotDataDTOs";

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
      const cornerPlotId = await savePlotData(req.body);
      res.status(200).send({ cornerPlotId });
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
  async (req: Request, res: TypedResponse<FullCornerPlotData>) => {
    try {
      res.status(200).send(await getPlotData(req.params.id));
    } catch (e) {
      console.error(e.message);
      res.status(404).send("Error: Corner plot not found");
    }
  }
);

export default router;
