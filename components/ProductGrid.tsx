"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, loadMoreProducts } from '../lib/api';

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  image_url: string;
  description: string;
  author: string;
  rating: number;
  review_count: number;
  category?: {
    title: string;
    slug: string;
  };
}

interface ProductGridProps {
  category?: string;
  priceRange?: [number, number];
  sortBy?: string;
}

export default function ProductGrid({ 
  category = 'all', 
  priceRange = [0, 50], 
  sortBy = 'newest' 
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getProducts();
        setProducts(data);
        setHasMore(data.length >= 12);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products from backend');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [category]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const newProducts = await loadMoreProducts(nextPage, category);
      
      if (newProducts.length > 0) {
        setProducts(prev => [...prev, ...newProducts]);
        setCurrentPage(nextPage);
        setHasMore(newProducts.length >= 12);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more products:', err);
      setError('Failed to load more products');
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredProducts = products
    .filter((product: Product) => {
      if (category !== 'all') {
        if (!product.category || product.category.slug !== category) {
          return false;
        }
      }
      const price = product.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'newest':
        default:
          return 0;
      }
    });

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-4 animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-red-500 text-4xl mb-4">❌</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Books</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Books Found</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {products.length === 0 
            ? "No books available in the database. Please check if the API is working correctly."
            : "No books match your current filters. Try adjusting your search criteria."
          }
        </p>
        <Link 
          href="/products"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-block"
        >
          View All Books
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product: Product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group border border-gray-100"
          >
            <div className="  bg-gray-100 overflow-hidden">
              <img 
                src={getSafeImageUrl(product.image_url)}
                alt={product.title || 'Book cover'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = `https://picsum.photos/256/320?random=${product.id}&blur=2`;
                }}
              />
              
              {product.rating && product.rating > 0 && (
                <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                  ⭐  {Number(product.rating).toFixed(1)}
                  {product.review_count && (
                    <span className="ml-1 text-yellow-800">({product.review_count})</span>
                  )}
                </div>
              )}
              
              {product.category && (
                <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                  {product.category.title}
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors min-h-[3rem]">
                {product.title || 'Untitled Book'}
              </h3>
              
              <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                by {product.author || 'Unknown Author'}
              </p>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-green-600 font-bold text-lg">
                    {getCurrencySymbol(product.currency)}{product.price}
                  </span>
                </div>
                
                <Link 
                  href={`/products/${product.id}`}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

     
      {!hasMore && filteredProducts.length > 0 && (
        <div className="text-center py-4">
          <div className="bg-gray-50 rounded-lg p-4 inline-block">
            <p className="text-gray-600">🎉 All books loaded</p>
            <p className="text-gray-500 text-sm mt-1">No more books available</p>
          </div>
        </div>
      )}
    </div>
  );
}



