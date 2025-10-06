"use client";

import { useEffect, useState } from 'react';
import ProductGrid from '../../components/ProductGrid';
import ProductFilters from '../../components/ProductFilters';
import { getCategories } from '../../lib/api';

interface Category {
  id: string;
  title: string;
  slug: string;
}

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    }
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Book Collection
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing books with real data sourced directly from World of Books
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:hidden">
            <details className="bg-white rounded-lg shadow-sm p-4">
              <summary className="font-semibold text-lg cursor-pointer">
                📋 Filters & Options
              </summary>
              <div className="mt-4">
                <ProductFilters 
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </div>
            </details>
          </div>

          <div className="hidden lg:block w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Filters & Sorting</h2>
              <ProductFilters 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    All Books
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Real books with live data from World of Books
                  </p>
                </div>
                
              </div>
            </div>

            <ProductGrid 
              category={selectedCategory}
              priceRange={priceRange}
              sortBy={sortBy}
            />
          </div>
        </div>
      </div>
    </div>
  );
}