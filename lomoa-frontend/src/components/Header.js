import React, { useState } from 'react';
import { Search, User, Sun, Moon } from 'lucide-react';

import lomoaLogoDark from '../assets/image/lomoa_eng_dark.png'; // 다크 모드용 로고
import lomoaLogoLight from '../assets/image/lomoa_eng.png'; // 라이트 모드용 로고

export default function Header({ setCurrentPage, theme, setTheme, onSearch }) {
  const navItems = ['숙제', '공격대', '재련', '생활', '레이드'];
  const [inputValue, setInputValue] = useState('');
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    // left-4, right-4를 제거하고 max-w-screen-xl mx-auto를 추가하여 중앙 정렬 및 여백을 만듭니다.
    <header className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm text-gray-800 dark:text-white p-4 flex items-center justify-between fixed top-4 left-0 right-0 max-w-screen-xl mx-auto z-50 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-lg">
      <div className="flex items-center space-x-8">
        <div 
          className="h-8 w-auto overflow-hidden cursor-pointer" 
          onClick={() => setCurrentPage('home')}
        >
          {/* 2. 테마에 따라 다른 로고 이미지를 보여줍니다. */}
          <img
            src={theme === 'dark' ? lomoaLogoDark : lomoaLogoLight}
            alt="LOMOA Logo"
            className="w-full h-full object-contain" // object-cover 대신 contain을 사용해 이미지가 잘리지 않게 할 수도 있습니다.
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
          <input 
            type="text" 
            placeholder="캐릭터명 검색"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-gray-200 dark:bg-gray-700 rounded-full py-2 pl-4 pr-10 w-40 md:w-56 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-800 dark:text-white" 
          />
          <button onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400">
            <Search className="w-5 h-5" />
          </button>
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