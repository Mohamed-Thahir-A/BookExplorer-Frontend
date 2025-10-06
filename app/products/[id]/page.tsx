"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProducts, addToWishlist, checkInWishlist, removeFromWishlist } from '@/lib/api';

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
  source_url: string;
  category?: {
    title: string;
    slug: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const products = await getProducts();
        const foundProduct = products.find((p: Product) => p.id === id);
        setProduct(foundProduct || null);
        
        if (foundProduct) {
          const wishlistStatus = await checkInWishlist(foundProduct.id);
          setInWishlist(wishlistStatus.inWishlist);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleWishlistToggle = async () => {
    if (!product) return;
    
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        setInWishlist(false);
        setMessage(`✅ "${product.title}" removed from wishlist!`);
      } else {
        const bookData = {
          title: product.title,
          author: product.author,
          description: product.description,
          price: product.price,
          image_url: product.image_url
        };
        
        await addToWishlist(product.id, bookData);
        setInWishlist(true);
        setMessage(`✅ "${product.title}" added to wishlist!`);
      }
    } catch (error: any) {
      console.error('Error updating wishlist:', error);
      setMessage(`❌ ${error.message || 'Failed to update wishlist'}`);
    } finally {
      setWishlistLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getSafeImageUrl = (url: string | undefined) => {
    if (!url || url.includes('placeholder.com') || url === '/placeholder-book.jpg') {
      return `https://picsum.photos/400/500?random=${Math.random()}`;
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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link 
            href="/categories"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/categories" 
        className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6 font-medium"
      >
        ← Back to Categories
      </Link>

      {message && (
        <div className={`mb-6 p-4 rounded-lg text-center ${
          message.includes('✅') 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <p className="font-medium">{message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="  rounded-2xl  overflow-hidden place-items-center">
          <img 
            src={getSafeImageUrl(product.image_url)}
            alt={product.title}
            className=" h-full object-cover shadow-lg "
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-lg text-gray-600 mb-4">by {product.author || 'Unknown Author'}</p>
            
            {product.rating && product.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                  <span className="text-yellow-500">⭐</span>
                  <span className="ml-1 font-semibold text-yellow-700">
                    {Number(product.rating).toFixed(1)}
                  </span>
                </div>
                {product.review_count && (
                  <span className="text-gray-500">({product.review_count} reviews)</span>
                )}
              </div>
            )}

            <div className="text-2xl font-bold text-green-600 mb-6">
              {getCurrencySymbol(product.currency)}{product.price}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || 'No description available.'}
            </p>
          </div>

          {product.category && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Category</h3>
              <Link 
                href={`/categories/${product.category.slug}`}
                className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                {product.category.title}
              </Link>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <a 
              href={product.source_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all text-center"
            >
              🌐 View on Website
            </a>
            
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                inWishlist
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {wishlistLoading ? '...' : inWishlist ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}