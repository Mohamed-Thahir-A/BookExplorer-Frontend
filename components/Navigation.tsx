"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'register' | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    setIsOpen(false);
    setShowSearchHistory(false);
    setShowUserMenu(false);
  }, [pathname]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('bookSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchHistory(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const updatedHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('bookSearchHistory', JSON.stringify(updatedHistory));
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchHistory(false);
      setIsOpen(false);
    }
  };

  const handleSearchHistoryClick = (query: string) => {
    setSearchQuery(query);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setShowSearchHistory(false);
    setIsOpen(false);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('bookSearchHistory');
  };

  const removeSearchHistoryItem = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistory = searchHistory.filter(item => item !== itemToRemove);
    setSearchHistory(updatedHistory);
    localStorage.setItem('bookSearchHistory', JSON.stringify(updatedHistory));
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BE</span>
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">
                  BookExplorer
                </span>
              </Link>
            </div>

         
            

           
            <div className="flex items-center space-x-4">
              
              <div className=" md:flex max-w-lg" ref={searchRef}>
                <form onSubmit={handleSearch} className="w-full relative">
                  <div className="relative flex">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search books, authors, categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowSearchHistory(true)}
                        className="w-full px-4 py-2 pl-10 pr-4 rounded-l-lg border sm:fontsize:small border-gray-300 border-r-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                   <button
                    type="submit"
                    className="bg-white text-blue-600 px-2 md:px-6 py-1 rounded-r-lg border border-l-0 border-gray-300 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm md:text-base"
                  >
                    Search
                  </button>
                  </div>

                
                  {showSearchHistory && searchHistory.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-2 border-b border-gray-100 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                        <button
                          onClick={clearSearchHistory}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {searchHistory.map((item, index) => (
                          <div
                            key={index}
                            onClick={() => handleSearchHistoryClick(item)}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center space-x-3">
                              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-gray-700">{item}</span>
                            </div>
                            <button
                              onClick={(e) => removeSearchHistoryItem(item, e)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
                
              </div>
              

            
              
            </div>
            <div className="hidden lg:flex  items-center space-x-8">
              <Link 
                href="/" 
                className={`font-medium transition-colors ${
                  pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className={`font-medium transition-colors ${
                  pathname.startsWith('/products') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                All Books
              </Link>
              <Link 
                href="/categories" 
                className={`font-medium transition-colors ${
                  pathname.startsWith('/categories') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Categories
              </Link>
            </div>
            {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {getInitials(user.fullName)}
                    </div>
                    <span className="font-medium hidden md:block">{user.first_name}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Wishlist
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowAuthModal('login')}
                    className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowAuthModal('register')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors hidden md:block"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            
          </div>
          

          
          <div className="md:hidden px-4 pb-4 border-b border-gray-200" ref={searchRef}>
            {showSearchHistory && searchHistory.length > 0 && (
              <div className="absolute left-4 right-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-2 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                  <button
                    onClick={clearSearchHistory}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {searchHistory.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleSearchHistoryClick(item)}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </div>
                      <button
                        onClick={(e) => removeSearchHistoryItem(item, e)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {isOpen && (
            <div className=" py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-t border-gray-200 pt-4">
                      <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="font-medium px-4 py-2 rounded-lg text-red-600 hover:bg-gray-100 transition-colors text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowAuthModal('login')}
                      className="font-medium px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-left"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setShowAuthModal('register')}
                      className="font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-left"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center p-2 transition-colors ${
              pathname === '/' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link
            href="/products"
            className={`flex flex-col items-center justify-center p-2 transition-colors ${
              pathname.startsWith('/products') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs mt-1">Books</span>
          </Link>

          <Link
            href="/categories"
            className={`flex flex-col items-center justify-center p-2 transition-colors ${
              pathname.startsWith('/categories') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-xs mt-1">Categories</span>
          </Link>

          <Link
            href="/wishlist"
            className={`flex flex-col items-center justify-center p-2 transition-colors ${
              pathname.startsWith('/wishlist') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs mt-1">Wishlist</span>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 767px) {
          body {
            padding-bottom: 4rem;
          }
        }
      `}</style>

      <LoginModal
        isOpen={showAuthModal === 'login'}
        onClose={() => setShowAuthModal(null)}
        onSwitchToRegister={() => setShowAuthModal('register')}
      />

      <RegisterModal
        isOpen={showAuthModal === 'register'}
        onClose={() => setShowAuthModal(null)}
        onSwitchToLogin={() => setShowAuthModal('login')}
      />
    </>
  );
}