export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  rating?: number;
  stock?: number;
  featured?: boolean;
}

export interface SearchResult {
  books: Book[];
  total: number;
  page?: number;
  totalPages?: number;
}