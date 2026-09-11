import type { AuthRequest } from "../../types/express.js";
import type{ Request,Response } from "express";
import { asyncHandler } from "../../errorHandlers/asyncHandler.js";
import bookService from "./book.service.js";
import ResponseHandler from "../../utils/ResponseHandler.js";

class BooksController{
    findBook = asyncHandler(async(req:Request,res:Response)=>{
        const id = req.params.id as string
        const book = await bookService.findBook(id)
        return ResponseHandler.success(res,"book found",book)
    })
    findAllBooks = asyncHandler(async(_,res:Response)=>{
       const books =  await bookService.getAllBooks()
        return ResponseHandler.success(res,"all books found",books)
    })
    addBook = asyncHandler(async(req:Request,res:Response)=>{
        const book = req.body
        const result = await bookService.createBooks(book)
        return ResponseHandler.success(res,"Book added successfully",result)
    })
    updateBook = asyncHandler(async(req:Request,res:Response)=>{
        const bookId = req.params.id as string
        const data = req.body
        const result = await bookService.updateBook(bookId,data)

        return ResponseHandler.success(res,`book with id: ${bookId} updated successfully`,result)
    })
    deleteBook = asyncHandler(async(req:Request,res:Response)=>{
        await bookService.deleteBook(req.params.id as string)
        return ResponseHandler.success(res,"Book deleted successfully")
    })
}

export default new BooksController