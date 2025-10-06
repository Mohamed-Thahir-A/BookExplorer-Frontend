"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getWishlist, removeFromWishlist } from '@/lib/api';

interface WishlistItem {
  id: string;
  book_id: string;
  book_title: string;
  book_author: string;
  book_price?: number;
  book_image?: string;
  book_description?: string;
  created_at: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist();
      console.log('📦 Wishlist data:', data); 
      setWishlist(data);
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      alert(error.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (bookId: string) => {
    try {
      await removeFromWishlist(bookId);
      setWishlist(prev => prev.filter(item => item.book_id !== bookId));
      alert('Removed from wishlist!');
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      alert(error.message || 'Failed to remove from wishlist');
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const getSafeImageUrl = (url: string | undefined) => {
    if (!url || url.includes('placeholder.com')) {
      return `https://picsum.photos/200/300?random=${Math.random()}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 border rounded-lg">
                <div className="w-24 h-32 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <Link 
          href="/categories"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Start adding books to your wishlist!</p>
          <Link 
            href="/categories"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="flex gap-6 p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img 
                src={getSafeImageUrl(item.book_image)}
                alt={item.book_title}
                className="w-24 h-32 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.book_title}
                </h3>
                <p className="text-gray-600 mb-2">by {item.book_author}</p>
                {item.book_price && (
                  <p className="text-lg font-bold text-green-600 mb-2">
                    ${item.book_price}
                  </p>
                )}
                {item.book_description && (
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {item.book_description}
                  </p>
                )}
                <div className="flex gap-4">
                  <Link 
                    href={`/products/${item.book_id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleRemoveFromWishlist(item.book_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}