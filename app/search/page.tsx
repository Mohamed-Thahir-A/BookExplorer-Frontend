"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  rating?: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setBooks([]);
        setTotalResults(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        setBooks(data.books || []);
        setTotalResults(data.total || 0);
      } catch (err) {
        setError('Error fetching search results. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const getSafeImageUrl = (url: string | undefined) => {
    if (!url || url.includes('placeholder.com') || url === '/placeholder-book.jpg') {
      return `https://picsum.photos/256/320?random=${Math.random()}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">
        Search Results
      </h1>
      {query && (
        <p className="text-gray-600 mb-8">
          {loading ? 'Searching for' : 'Results for'} &quot;<span className="font-semibold">{query}</span>&quot;
          {!loading && totalResults > 0 && (
            <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {totalResults} book{totalResults !== 1 ? 's' : ''} found
            </span>
          )}
        </p>
      )}
      
      {!loading && !error && (
        <>
          {books.length === 0 && query ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No books found</h3>
              <p className="text-gray-600 mb-4">
                No books found matching &quot;<span className="font-medium">{query}</span>&quot;.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Try:</p>
                <ul className="text-sm text-gray-500 list-disc list-inside">
                  <li>Using different keywords</li>
                  <li>Checking for spelling errors</li>
                  <li>Searching by author name</li>
                  <li>Searching by category</li>
                </ul>
              </div>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Enter a search term to find books.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => (
                  <Link 
                    key={book.id}
                    href={`/products/${book.id}`}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-200 block"
                  >
                    <div className="aspect-w-3 aspect-h-4 mb-4">
                      <img 
                        src={getSafeImageUrl(book.image)} 
                        alt={book.title}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
                    <p className="text-gray-600 mb-1">by {book.author}</p>
                    <p className="text-sm text-gray-500 mb-2 capitalize">{book.category}</p>
                    {book.rating && (
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm text-gray-600 ml-1">{book.rating}</span>
                      </div>
                    )}
                    <p className="text-blue-600 font-bold text-lg">${book.price}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}