import { Router } from "express"
import ReservationController from "./reservation.controller.js"
import { authMiddleware } from "../../middleware/auth.middleware.js"
const reservationRoute = Router()

reservationRoute.post("/:bookId",authMiddleware,ReservationController.bookReserve)
reservationRoute.post("/cancel-reservation/:bookId",authMiddleware,ReservationController.bookReservationCancel)