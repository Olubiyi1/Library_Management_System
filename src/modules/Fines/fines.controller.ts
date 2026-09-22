import { asyncHandler } from "../../errorHandlers/asyncHandler.js";
import type { Request, Response } from "express";
import finesService from "./fines.service.js";
import ResponseHandler from "../../utils/ResponseHandler.js";

class FineController {
  retrieveFines = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const fines = await finesService.retrieveFines(userId,page,limit);

    return ResponseHandler.success(res, "fines retrieved successfully", fines);
  });
}
export default new FineController();
