"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  rating?: number;
  currency?: string;
}

export default function SearchPage() {
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

  const getCurrencySymbol = (currency: string = 'GBP') => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      GBP: '£',
      EUR: '€',
    };
    return symbols[currency] || currency;
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Search Results
        </h1>
        {query && (
          <p className="text-gray-600">
            {loading ? 'Searching for' : 'Results for'} "<span className="font-semibold">{query}</span>"
            {!loading && totalResults > 0 && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {totalResults} book{totalResults !== 1 ? 's' : ''} found
              </span>
            )}
          </p>
        )}
      </div>
      
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching books...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {books.length === 0 && query ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No books found</h3>
              <p className="text-gray-600 mb-4">
                No books found matching "<span className="font-medium">{query}</span>".
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
                  <div 
                    key={book.id} 
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group border border-gray-100"
                  >
                    <div className="h-110 md:90 lg:80 xl:64  bg-gray-100 overflow-hidden">
                      <img 
                        src={getSafeImageUrl(book.image)}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/256/320?random=${book.id}`;
                        }}
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors min-h-[3rem]">
                        {book.title}
                      </h3>
                      
                      <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                        by {book.author || 'Unknown Author'}
                      </p>
                      
                      <p className="text-xs text-gray-600 mb-2 capitalize">
                        {book.category}
                      </p>

                      {book.rating && book.rating > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                            <span className="text-yellow-500 text-sm">⭐</span>
                            <span className="ml-1 text-xs font-semibold text-yellow-700">
                              {Number(book.rating).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-green-600 font-bold text-lg">
                            {getCurrencySymbol(book.currency)}{book.price}
                          </span>
                        </div>
                        
                        <Link 
                          href={`/products/${book.id}`}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}