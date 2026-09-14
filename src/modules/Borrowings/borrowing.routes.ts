import { Router } from "express";
import borrowingController from "./borrowing.controller.js";

const borrowingRoute = Router();

borrowingRoute.post("/", borrowingController.borrowBook);
borrowingRoute.post("/return", borrowingController.returnBook);
borrowingRoute.patch("/return/approve/:borrowingId",borrowingController.approveBookReturn);
borrowingRoute.patch("/renew",borrowingController.renewBook)

export default borrowingRoute;