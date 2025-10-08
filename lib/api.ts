const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bookexplorer-backend-4hg3.onrender.com';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

async function fetchWithTimeout(url: string, options: FetchOptions = {}) {
  const { timeout = 8000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function extractData(response: any) {
  if (Array.isArray(response)) return response;
  if (response.data) return response.data;
  if (response.products) return response.products;
  if (response.categories) return response.categories;
  return response;
}

export async function getProducts(): Promise<any[]> {
  try {
    console.log('Fetching products from /api/products');
    const response = await fetch('https://bookexplorer-backend-4hg3.onrender.com/api/products');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Raw API response:', data);
    console.log('✅ Total products in response:', data.data?.length || 0);
    
    if (data.data && data.data.length > 0) {
      const categories = [...new Set(data.data.map((p: any) => p.category?.slug).filter(Boolean))];
      console.log('✅ Available categories in API response:', categories);
      
      const categoryCounts: { [key: string]: number } = {};
      data.data.forEach((product: any) => {
        if (product.category?.slug) {
          categoryCounts[product.category.slug] = (categoryCounts[product.category.slug] || 0) + 1;
        }
      });
      console.log('✅ Category counts:', categoryCounts);
      
      console.log('✅ First 5 products with categories:', 
        data.data.slice(0, 5).map((p: any) => ({
          title: p.title,
          category: p.category?.slug || 'none'
        }))
      );
    }
    
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function loadMoreCategoryProducts(slug: string, page: number): Promise<any> {
  try {
    console.log(`Loading more products for category ${slug}, page ${page}`);
    
    const response = await fetch(`https://bookexplorer-backend-4hg3.onrender.com/api/categories/load-more/${slug}?page=${page}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load more products: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Load more response:', data);
    
    return data.data || { products: [], hasMore: false };
  } catch (error) {
    console.error(`❌ Failed to load more products for ${slug}:`, error);
    throw error;
  }
}

export async function scrapeMoreCategoryProducts(slug: string, page: number, currentCount: number = 0): Promise<any> {
  try {
    console.log(`Scraping more products for category: ${slug}, page: ${page}, current count: ${currentCount}`);
    
    const response = await fetch(`https://bookexplorer-backend-4hg3.onrender.com/api/categories/load-more/${slug}?page=${page}&currentCount=${currentCount}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Scraping failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Scraping response:', data);
    
    return data.data || { 
      products: [], 
      hasMore: false, 
      message: '',
      stats: { totalScraped: 0, newProducts: 0, duplicates: 0 }
    };
  } catch (error) {
    console.error(`❌ Failed to scrape category ${slug}:`, error);
    throw error;
  }
}

export async function addToWishlist(bookId: string, bookData?: any): Promise<any> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to add to wishlist');
    }

    console.log('Adding to wishlist:', bookId);
    
    const response = await fetch('https://bookexplorer-backend-4hg3.onrender.com/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        book_id: bookId,
        ...(bookData && {
          book_title: bookData.title,
          book_author: bookData.author,
          book_description: bookData.description,
          book_price: bookData.price,
          book_image: bookData.image_url
        })
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add to wishlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
}

export async function getWishlist(): Promise<any[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to view wishlist');
    }

    const response = await fetch('https://bookexplorer-backend-4hg3.onrender.com/api/wishlist', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch wishlist');
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
}

export async function removeFromWishlist(bookId: string): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to remove from wishlist');
    }

    const response = await fetch('https://bookexplorer-backend-4hg3.onrender.com', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ book_id: bookId }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove from wishlist');
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
}

export async function checkInWishlist(bookId: string): Promise<{ inWishlist: boolean }> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { inWishlist: false };
    }

    const response = await fetch(`https://bookexplorer-backend-4hg3.onrender.com/api/wishlist/check/${bookId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      return { inWishlist: false };
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return { inWishlist: false };
  }
}

export async function loadMoreProducts(page: number, category?: string): Promise<any[]> {
  try {
    console.log(`Loading more products - Page: ${page}, Category: ${category || 'all'}`);
    
    let url = `https://bookexplorer-backend-4hg3.onrender.com/api/products?page=${page}&limit=12`;
    if (category && category !== 'all') {
      url += `&category=${category}`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load more products: ${response.status}`);
    }
    
    const data = await response.json();
    const products = data.data || data.products || [];
    
    console.log(`✅ Loaded ${products.length} more products`);
    return products;
  } catch (error) {
    console.error('❌ Failed to load more products:', error);
    throw error;
  }
}


export async function getCategories(): Promise<any[]> {
  try {
    console.log('Fetching categories from /api/categories');
    
    const response = await fetchWithTimeout(`/api/categories`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const categories = extractData(data);
    
    console.log('✅ Categories fetched:', Array.isArray(categories) ? categories.length : 0, 'items');
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error('❌ Failed to fetch categories:', error);
    return [];
  }
}

export async function getCategory(slug: string): Promise<any> {
  try {
    console.log('Fetching category:', slug);
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/categories/slug/${slug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.error(`Category with slug ${slug} not found`);
        return null;
      }
      throw new Error(`Failed to fetch category: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const category = extractData(data);
    
    console.log('✅ Category fetched:', category?.title);
    return category;
  } catch (error) {
    console.error(`❌ Failed to fetch category ${slug}:`, error);
    return null;
  }
}

export async function getProduct(id: string): Promise<any> {
  try {
    console.log('Fetching product:', id);
    
    const response = await fetchWithTimeout(`/api/products/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.error(`Product with id ${id} not found`);
        return null;
      }
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const product = extractData(data);
    
    console.log('✅ Product fetched:', product?.title);
    return product;
  } catch (error) {
    console.error(`❌ Failed to fetch product ${id}:`, error);
    return null;
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/health`, {
      timeout: 3000,
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
  
}
