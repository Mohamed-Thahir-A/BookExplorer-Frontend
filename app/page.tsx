"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories, getProducts } from '../lib/api';

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  image_url: string;
  description: string;
  author: string;
  rating: number;
}

interface Category {
  id: string;
  title: string;
  slug: string;
  product_count: number;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts()
      ]);
      
      setCategories(categoriesData.slice(0, 6));
      setFeaturedProducts(productsData.slice(0, 6));
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please ensure backend is running on port 3001.');
    } finally {
      setLoading(false);
    }
  }
  loadData();
}, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg border border-red-200">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Connection Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing Books
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Real books, real prices from World of Books
          </p>
        </div>
      </section>

    
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Books
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked selection from our collection
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8">
              {featuredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group">
                  <div className="relative h-110 md:h-90 lg:h-80 xl:h-68 bg-gray-200 overflow-hidden">
  <img 
    src={product.image_url || '/placeholder-book.jpg'} 
    alt={product.title}
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
    onError={(e) => {
      e.currentTarget.src = '/placeholder-book.jpg';
    }}
  />
  {product.rating && (
    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
      ⭐ {product.rating}
    </div>
  )}
</div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm md:text-base mb-2 line-clamp-2 h-12">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                      by {product.author || 'Unknown Author'}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-bold text-lg">
                        {product.currency === 'GBP' ? '£' : '$'}{product.price}
                      </span>
                      <Link 
                        href={`/products/${product.id}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Books Available</h3>
              <p className="text-gray-500 mb-6">Please check if backend is returning data.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}