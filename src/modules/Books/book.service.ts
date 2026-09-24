import AppError from "../../errorHandlers/appError.js";
import prisma from "../../config/prisma.js";
import type { CreateBookDto } from "./booksDto/createBooks.dto.js";
import { createLabel } from "../../utils/lables.js";
import type { UpdateBookDto } from "./booksDto/updateBook.dto..js";

const BooksServiceLogs = createLabel("BOOKS_SERVICE");
class BookService {
  async findBook(bookId: string) {
    const exisitingBook = await prisma.book.findFirst({
      where: { id: bookId, isActive: true },
    });
    if (!exisitingBook) {
      BooksServiceLogs.warn(`book not found`);
      throw new AppError("Book not found", 404);
    }
    return exisitingBook;
  }

  // get all books with pagination
 async getAllBooks(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const books = await prisma.book.findMany({
    where: {
      isActive: true,
    },
    include: {
      author: true,
    },
    skip,
    take: limit,
  });

  const total = await prisma.book.count({
    where: {
      isActive: true,
    },
  });

  const totalPages = Math.ceil(total / limit);

  return {
    books,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

  // create books
  async createBooks(data: CreateBookDto) {

     // find if author exists to avoid duplication
    let author = await prisma.author.findFirst({
      where: {
        name: data.author.name,
      },
    });
    
     // if not create the author so as to use the author id
    if (!author) {
      author = await prisma.author.create({
        data: {
          name: data.author.name,
        },
      });
    }
    // find existing book

    const exisitngBook =await prisma.book.findFirst({
      where:{
        title:data.title,
        authorId:author.id
      }
    })

    if(exisitngBook){
      throw new AppError("Book already exists", 409);
    }

    const book = await prisma.book.create({
      data: {
        title: data.title,
        authorId: author.id,
        description: data.description,
        genre: data.genre,
        totalCopies: data.totalCopies,
        availableCopies: data.totalCopies,
      },
    });
    return book;
  }

  async updateBook(bookId: string, updatedData: UpdateBookDto) {
    const book = await prisma.book.findFirst({
      where: { id:bookId,isActive: true },
    });

    // check if book is still active
    if (!book) {
      BooksServiceLogs.warn("Book not found");
      throw new AppError("Book not found", 404);
    }
    const updatedBook = await prisma.book.update({
      where: {
        id: bookId,
      },
      data: updatedData,
    });

    BooksServiceLogs.info(`book with title: ${bookId} updated successfully`);
    return updatedBook;
  }
  async deleteBook(bookId: string) {
    const book = await prisma.book.findFirst({
      where: {
        id: bookId,
        isActive: true,
      },
    });
    if (!book) {
      BooksServiceLogs.warn("Book not found");
      throw new AppError("Book not found", 404);
    }
    const deletedBook = await prisma.book.update({
      where: { id: bookId },
      data: { isActive: false },
    });
    BooksServiceLogs.info(
      `book with title: ${deletedBook.title} successfully deleted`,
    );
    return;
  }
}

export default new BookService();
