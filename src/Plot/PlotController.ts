import { Router, Request, Response } from "express";
import validateBody from "../ValidateBody";
import { TypedRequestBody } from "../TypedExpressIO";
import {
  SavePlotDataValidator,
  SavePlotData
} from "./PlotInterfaces/SavePlotData";
import { savePlotData, testService } from "./PlotServices/PlotService";

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
router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  // TODO: Add some functionality here
  // res.send(await testService());
  try {
    await testService();
    res.sendStatus(200);
  } catch (e) {
    console.error(e.message);
    res.status(400).send("Error: The query could not be completed");
  }
});

export default router;
