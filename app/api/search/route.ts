import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const author = searchParams.get('author');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const backendUrl = new URL(`${BACKEND_URL}/api/products`);
    
    if (query) {
      backendUrl.searchParams.append('search', query);
    }
    if (category) {
      backendUrl.searchParams.append('category', category);
    }
    if (author) {
      backendUrl.searchParams.append('author', author);
    }
    backendUrl.searchParams.append('page', page.toString());
    backendUrl.searchParams.append('limit', limit.toString());

    const response = await fetch(backendUrl.toString(), {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error('Backend error');
    
    const data = await response.json();
    
    const transformedData = {
  books: (data.data || []).map((product: { 
    id: string; 
    title: string; 
    author: string; 
    price: number; 
    category?: { title: string }; 
    image_url: string; 
    description?: string; 
    rating?: number; 
    currency?: string 
  }) =>  ({
        id: product.id,
        title: product.title,
        author: product.author,
        price: product.price,
        category: product.category?.title || 'Unknown Category',
        image: product.image_url,
        description: product.description,
        rating: product.rating,
        currency: product.currency
      })),
      total: data.data?.length || 0,
      page,
      totalPages: Math.ceil((data.data?.length || 0) / limit),
      hasNext: page < Math.ceil((data.data?.length || 0) / limit),
      hasPrev: page > 1
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch search results',
        books: [],
        total: 0
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';