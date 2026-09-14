import { Router } from "express";
import bookController from "./book.controller.js";

const booksRoute = Router()
booksRoute
    .route("/")
    .get(bookController.findAllBooks)
    .post(bookController.addBook)
    
booksRoute.route("/:id")
    .get(bookController.findBook)
    .patch(bookController.updateBook)
    .delete(bookController.deleteBook)


export default booksRoute;