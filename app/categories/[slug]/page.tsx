"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation'; 
import { getProducts, scrapeMoreCategoryProducts,  } from '@/lib/api';

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

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  
  const urlPage = parseInt(searchParams.get('page') || '1');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [currentPage, setCurrentPage] = useState(urlPage); 
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setCurrentPage(urlPage);
    setHasMore(true);
    setProducts([]);
    setLoading(true);
  }, [slug, urlPage]); 

  useEffect(() => {
    async function loadCategoryProducts() {
      try {
        setLoading(true);
        const allProducts = await getProducts();
        
        console.log('All products:', allProducts.length);
        console.log('Looking for category:', slug);
        console.log('Current page from URL:', urlPage);

        const categoryProducts = allProducts.filter((product: Product) => {
          const productSlug = product.category?.slug;
          console.log(`Product: ${product.title}, Category: ${productSlug}`);
          return productSlug === slug;
        });

        console.log(`Found ${categoryProducts.length} products for ${slug}`);
        setProducts(categoryProducts);
        setHasMore(categoryProducts.length > 0 || urlPage === 1); 
        
      } catch (err) {
        console.error('Error loading category products:', err);
        setMessage('Error loading products');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadCategoryProducts();
    }
  }, [slug, urlPage]);





  const handleLoadMore = async () => {
    if (scraping || !hasMore) return;

    setScraping(true);
    setMessage('🔄 Scraping fresh books from website...');

    try {
      const nextPage = currentPage + 1;
      
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('page', nextPage.toString());
      router.push(`/categories/${slug}?${newSearchParams.toString()}`, { scroll: false });

      const response = await scrapeMoreCategoryProducts(slug, nextPage, products.length);
      
      console.log('Scraping response:', response);
      
      if (response.products && response.products.length > 0) {
        setProducts(prev => [...prev, ...response.products]);
        setCurrentPage(nextPage);
        setHasMore(response.hasMore);
        setMessage(`✅ ${response.message || `Added ${response.products.length} fresh books!`}`);
        
        setTimeout(() => setMessage(''), 4000);
      } else {
        setHasMore(false);
        setMessage('📚 No more books available for this category');
      }
    } catch (error) {
      console.error('Error scraping more products:', error);
      setMessage('❌ Scraping failed. Please try again.');
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setScraping(false);
    }
  };

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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/categories" 
        className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-4 font-medium"
      >
        ← Back to Categories
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
        {slug.replace(/-/g, ' ')}
      </h1>
      <p className="text-gray-600 mb-6">
        {products.length} book{products.length !== 1 ? 's' : ''} found
      </p>

      
      {message && (
        <div className={`mb-6 p-4 rounded-lg text-center ${
          message.includes('✅') 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : message.includes('❌')
            ? 'bg-red-50 border border-red-200 text-red-700'
            : message.includes('🔄')
            ? 'bg-blue-50 border border-blue-200 text-blue-700'
            : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
        }`}>
          <p className="font-medium">{message}</p>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No Books Found</h3>
          <p className="text-gray-600 mb-4">
            No books found in the "{slug.replace(/-/g, ' ')}" category.
          </p>
          
          
          <button
            onClick={handleLoadMore}
            disabled={scraping}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scraping ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Scraping Books...</span>
              </div>
            ) : (
              'Scrape Books for This Category'
            )}
          </button>
        </div>
      ) : (
        <>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group border border-gray-100"
              >
                <div className="h-110 bg-gray-100 overflow-hidden">
                  <img 
                    src={getSafeImageUrl(product.image_url)}
                    alt={product.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = `https://picsum.photos/256/320?random=${product.id}`;
                    }}
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors min-h-[3rem]">
                    {product.title || 'Untitled Book'}
                  </h3>
                  
                  <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                    by {product.author || 'Unknown Author'}
                  </p>
                  
                  {product.rating && product.rating > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                        <span className="text-yellow-500 text-sm">⭐</span>
                        <span className="ml-1 text-xs font-semibold text-yellow-700">
                          {Number(product.rating).toFixed(1)}
                        </span>
                      </div>
                      {product.review_count && (
                        <span className="text-xs text-gray-500">({product.review_count})</span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-green-600 font-bold text-lg">
                        {getCurrencySymbol(product.currency)}{product.price}
                      </span>
                    </div>
                    
                    <Link 
                      href={`/products/${product.id}`}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

         {hasMore && (
        <div className="text-center border-t pt-8">
          <button
            onClick={handleLoadMore}
            disabled={scraping}
            className="bg-gradient-to-r from-green-600 to-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {scraping ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Scraping Page {currentPage + 1}...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>🚀 Load Page {currentPage + 1}</span>
                <span className="text-green-200 text-sm">(Live Scraping)</span>
              </div>
            )}
          </button>
          
          {!scraping && (
            <p className="text-gray-500 text-sm mt-3">
              Currently on page {currentPage} • Click to scrape page {currentPage + 1}
            </p>
          )}
        </div>
      )}

          {!hasMore && products.length > 0 && (
            <div className="text-center py-4">
              <div className="bg-gray-50 rounded-lg p-4 inline-block">
                <p className="text-gray-600">🎉 All books loaded</p>
                <p className="text-gray-500 text-sm mt-1">No more books available for scraping</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}