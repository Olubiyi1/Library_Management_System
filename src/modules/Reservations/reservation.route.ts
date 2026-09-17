import { Router } from "express"
import ReservationController from "./reservation.controller.js"
const reservationRoute = Router()

reservationRoute.post("/",ReservationController.bookReserve)
reservationRoute.post("/cancel-reservation",ReservationController.bookReservationCancel)