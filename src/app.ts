import express from "express"
import authRoute from "./modules/Auth/auth.routes.js"
import booksRoute from "./modules/Books/book.route.js"
import borrowingRoute from "./modules/Borrowings/borrowing.routes.js"
import paymentRoute from "./modules/Payment/payment.route.js"
import cookieParser from "cookie-parser"

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRoute)
app.use("/api/books",booksRoute)
app.use("/api/books/borrowing",borrowingRoute)
app.use("/api/",paymentRoute)
export default app;