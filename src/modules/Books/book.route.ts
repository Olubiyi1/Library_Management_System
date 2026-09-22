import { Router } from "express";
import bookController from "./book.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { restrictTo } from "../../middleware/restrictTo.js";
import { AccountType } from "../../generated/prisma/enums.js";

const booksRoute = Router()
booksRoute
    .route("/")
    .get(bookController.findAllBooks)
    .post(authMiddleware,restrictTo(AccountType.ADMIN),bookController.addBook)
    
booksRoute.route("/:bookId")
    .get(bookController.findBook)
    .patch(authMiddleware,restrictTo(AccountType.ADMIN),bookController.updateBook)
    .delete(authMiddleware,restrictTo(AccountType.ADMIN),bookController.deleteBook)

export default booksRoute;