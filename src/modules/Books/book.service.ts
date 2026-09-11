import AppError from "../../errorHandlers/appError.js";
import prisma from "../../config/prisma.js";
import type{ CreateBookDto } from "./booksDto/createBooks.dto.js";
import { createLabel } from "../../utils/lables.js";
import type { UpdateBookDto } from "./booksDto/updateBook.dto..js";



const BooksServiceLogs = createLabel("BOOKS_SERVICE")
class BookService{

    async findBook(bookId:string){
        const exisitingBook = await prisma.book.findUnique({where:{id:bookId}})
        if(!exisitingBook){
            BooksServiceLogs.warn(`book not found`)
            throw new AppError("Book not found", 404)
        }
        return exisitingBook
    }

    async getAllBooks(){
        const allBooks = await prisma.book.findMany({
            include:{
                author:true
            }
        })
        return allBooks;
    }
    async createBooks(data:CreateBookDto){

        // find if author exists to avoid duplication
        let author = await prisma.author.findFirst({
            where:{
                name : data.author.name
            }
        })

        // if not create the author so as to use the author id
        if(!author){
            author = await prisma.author.create({
                data:{
                    name: data.author.name
                }
            })
        }

        const book = await prisma.book.create({
            data:{
                title:data.title,
                authorId:author.id,
                description:data.description,
                genre:data.genre,
                availability:true
            }
        })
        return book;
    }

    async updateBook(bookId:string,updatedData:UpdateBookDto){
      const updatedBook = await prisma.book.update({
        where:{
            id:bookId
        },
        data:updatedData
      })

      BooksServiceLogs.info(`book with title: ${bookId} updated successfully`)
      return updatedBook;

    }
    async deleteBook(bookId:string){
        const book = await prisma.book.findUnique({where:{
            id:bookId
        }})
        if(!book){
            BooksServiceLogs.warn("Book not found")
            throw new AppError("Book not found",404)
        }
        const deletedBook = await prisma.book.delete({
            where:{id:bookId}
        })
        BooksServiceLogs.info(`book with title: ${deletedBook.title} successfully deleted`)
        return
    }
}

export default new BookService;