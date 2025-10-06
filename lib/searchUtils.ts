import { Book, SearchResult } from '@/types';

export const searchBooks = (books: Book[], query: string): SearchResult => {
  if (!query.trim()) {
    return { books: [], total: 0 };
  }

  const searchTerm = query.toLowerCase().trim();
  
  const results = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm) ||
    book.author.toLowerCase().includes(searchTerm) ||
    book.category.toLowerCase().includes(searchTerm) ||
    book.description?.toLowerCase().includes(searchTerm)
  );

  return {
    books: results,
    total: results.length
  };
};

export const advancedBookSearch = (
  books: Book[], 
  filters: {
    query?: string;
    category?: string;
    author?: string;
    minPrice?: number;
    maxPrice?: number;
  }
): Book[] => {
  let results = [...books];

  if (filters.query) {
    const searchTerm = filters.query.toLowerCase().trim();
    results = results.filter(book =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.category.toLowerCase().includes(searchTerm) ||
      book.description?.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.category) {
    results = results.filter(book => 
      book.category.toLowerCase() === filters.category?.toLowerCase()
    );
  }

  if (filters.author) {
    results = results.filter(book =>
      book.author.toLowerCase().includes(filters.author?.toLowerCase() || '')
    );
  }

  if (filters.minPrice !== undefined) {
    results = results.filter(book => book.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter(book => book.price <= filters.maxPrice!);
  }

  return results;
};