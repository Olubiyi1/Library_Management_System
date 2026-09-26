import { asyncHandler } from "../../errorHandlers/asyncHandler.js";
import type { Request, Response } from "express";
import finesService from "./fines.service.js";
import ResponseHandler from "../../utils/ResponseHandler.js";

class FineController {

  getMyFines = asyncHandler(async(req:Request,res:Response)=>{
    const userId = req.user.id

    const allFines = await finesService.getMyFines(userId)

    return ResponseHandler.success(res,"all fines retrieved",allFines)
  })
  
  retrieveFines = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const fines = await finesService.retrieveFines(userId,page,limit);

    return ResponseHandler.success(res, "fines retrieved successfully", fines);
  });
  createFine = asyncHandler(async(req:Request,res:Response)=>{
    const userId = req.user.id
    const borrowingId = req.params.borrowingId as string

    const {amount,reason} = req.body

    const result = await finesService.createFine(userId,borrowingId,amount,reason)

    return ResponseHandler.created(res,"fine created",result)
  })
}
export default new FineController();
