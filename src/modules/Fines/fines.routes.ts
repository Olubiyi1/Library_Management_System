import { Router } from "express";
import finesController from "./fines.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const fineRoute = Router()

fineRoute.get("/",authMiddleware,finesController.retrieveFines)