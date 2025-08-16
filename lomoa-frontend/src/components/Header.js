import React from 'react';
import { Search, User, Sun, Moon } from 'lucide-react';

export default function Header({ setCurrentPage, theme, setTheme }) {
  const navItems = ['숙제', '공격대', '재련', '생활', '레이드'];
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm text-gray-800 dark:text-white p-4 flex items-center justify-between fixed top-4 left-4 right-4 z-50 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-lg">
      <div className="flex items-center space-x-8">
        <div 
          className="h-8 w-auto overflow-hidden cursor-pointer" 
          onClick={() => setCurrentPage('home')}
        >
          <img
            src={theme === 'dark' ? "https://placehold.co/120x40/transparent/ffffff?text=LOMOA&font=raleway" : "https://placehold.co/120x40/transparent/1f2937?text=LOMOA&font=raleway"}
            alt="LOMOA Logo"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map(name => (
            <button key={name} onClick={() => setCurrentPage(name)} className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <span>{name}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input type="text" className="bg-gray-200 dark:bg-gray-700 rounded-full py-2 pl-4 pr-10 w-40 md:w-56 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-800 dark:text-white" />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 w-5 h-5" />
        </div>
        <button onClick={toggleTheme} className="p-2.5 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="p-2.5 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
            <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};