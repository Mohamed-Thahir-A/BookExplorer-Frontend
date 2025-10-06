import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  rating?: number;
  review_count?: number;
  description?: string;
  category?: string;
  in_stock?: boolean;
  currency?: string;
  author?: string;
}

interface ProductCardProps {
  product: Product;
  showDescription?: boolean;
  showCategory?: boolean;
  className?: string;
}

export default function ProductCard({ 
  product, 
  showDescription = false, 
  showCategory = false,
  className = ''
}: ProductCardProps) {
  const formatPrice = (price: number, currency: string = 'USD') => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(price);
    } catch (error) {
      return `${currency} ${price.toFixed(2)}`;
    }
  };

  const getCurrencySymbol = (currency: string = 'USD') => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      GBP: '£',
      EUR: '€',
    };
    return symbols[currency] || currency;
  };

  const renderRating = () => {
    if (!product.rating && product.rating !== 0) return null;
    
    const rating = product.rating || 0;
    
    return (
      <div className="flex items-center" title={`Rating: ${rating} out of 5`}>
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
        {product.review_count && (
          <span className="text-sm text-gray-500 ml-1">({product.review_count})</span>
        )}
      </div>
    );
  };

  const getSafeImageUrl = (url: string | undefined) => {
    if (!url || url.includes('placeholder.com') || url === '/placeholder-book.jpg') {
      return `https://picsum.photos/300/400?random=${product.id}&grayscale`;
    }
    return url;
  };

  return (
    <Link 
      href={`/products/${product.id}`}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden block hover:-translate-y-1 ${className}`}
      aria-label={`View ${product.title} - ${formatPrice(product.price, product.currency)}`}
    >
      <div className="relative h-110 md:90 lg:48 xl:48  bg-gray-100 flex items-center justify-center overflow-hidden">
        <Image 
          src={getSafeImageUrl(product.image_url)} 
          alt={product.title || 'Book cover'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover hover:scale-105 transition-transform duration-300"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://picsum.photos/300/400?random=${product.id}&blur=2`;
          }}
        />
        
        {product.in_stock === false && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            Out of Stock
          </div>
        )}
        
        {product.rating && product.rating > 0 && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
            ⭐ {product.rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="p-4">
        {showCategory && product.category && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.category}</p>
        )}
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors min-h-[3.5rem]">
          {product.title || 'Untitled Book'}
        </h3>
        
        {product.author && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-1">
            by {product.author}
          </p>
        )}
        
       
        <div className="flex justify-between items-center mt-4">
          <span className="text-green-600 font-bold text-lg">
            {formatPrice(product.price, product.currency)}
          </span>
          {renderRating()}
        </div>
      </div>
    </Link>
  );
}