import express from "express"
import authRoute from "./modules/Auth/auth.routes.js"
import booksRoute from "./modules/Books/book.route.js"
import borrowingRoute from "./modules/Borrowings/borrowing.routes.js"

const app = express()
app.use(express.json())
app.use("/api/auth",authRoute)
app.use("/api/books",booksRoute)
app.use("/api/books/borrowing",borrowingRoute)
export default app;