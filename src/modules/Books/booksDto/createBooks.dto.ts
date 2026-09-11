export interface CreateBookDto {
  title: string;
  author: {
    name: string;
  };
  genre: string;
  description: string;
  totalCopies:number
}