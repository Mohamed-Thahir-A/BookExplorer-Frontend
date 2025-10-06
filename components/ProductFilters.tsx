"use client";

interface Category {
  id: string;
  title: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
}: ProductFiltersProps) {
  const handlePriceRangeChange = (min: number, max: number) => {
    onPriceRangeChange([min, max]);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'title', label: 'Title A-Z' },
  ];

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Categories</h3>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Categories</option>
          {categories && categories.length > 0 ? (
            categories.map(category => (
              <option key={category.id} value={category.slug || category.title}>
                {category.title}
              </option>
            ))
          ) : (
            <option disabled>No categories available</option>
          )}
        </select>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Price Range</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{getCurrencySymbol('GBP')}{priceRange[0]}</span>
            <span>{getCurrencySymbol('GBP')}{priceRange[1]}</span>
          </div>
          <div className="flex space-x-2">
            <input
              type="number"
              min="0"
              max="100"
              value={priceRange[0]}
              onChange={(e) => handlePriceRangeChange(Number(e.target.value), priceRange[1])}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="Min"
            />
            <span className="flex items-center text-gray-400">-</span>
            <input
              type="number"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={(e) => handlePriceRangeChange(priceRange[0], Number(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="Max"
            />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={priceRange[1]}
            onChange={(e) => handlePriceRangeChange(priceRange[0], parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            onCategoryChange('all');
            onPriceRangeChange([0, 50]);
            onSortChange('newest');
          }}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}

function getCurrencySymbol(currency: string = 'USD') {
  const symbols: { [key: string]: string } = {
    USD: '$',
    GBP: '£',
    EUR: '€',
  };
  return symbols[currency] || currency;
}