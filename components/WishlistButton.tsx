'use client';
import { useState, useEffect } from 'react';
import { addToWishlist, removeFromWishlist, checkInWishlist } from '@/lib/api';

interface WishlistButtonProps {
  bookId: string;
  bookData?: any;
  size?: 'sm' | 'md' | 'lg';
}

export default function WishlistButton({ bookId, bookData, size = 'md' }: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await checkInWishlist(bookId);
        setInWishlist(result.inWishlist);
      } catch (error) {
        console.error('Error checking wishlist:', error);
      }
    };
    
    checkStatus();
  }, [bookId]);

  const handleToggleWishlist = async () => {
    setLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(bookId);
        setInWishlist(false);
      } else {
        await addToWishlist(bookId, bookData);
        setInWishlist(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Please login to use wishlist');
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        inWishlist 
          ? 'bg-red-500 text-white' 
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      } ${sizeClasses[size]}`}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {loading ? '...' : inWishlist ? '❤️' : '🤍'}
    </button>
  );
}