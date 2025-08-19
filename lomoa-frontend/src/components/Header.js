import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Sun, Moon, LogOut, Settings, RefreshCw } from 'lucide-react';

export default function Header({ setCurrentPage, theme, setTheme, onSearch, isLoggedIn, user, onLoginClick, onProfileClick, onLogout, onRefreshCharacters }) {
  const navItems = ['숙제', '공격대', '재련', '생활', '레이드'];
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  return (
    <header className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm text-gray-800 dark:text-white p-4 flex items-center justify-between fixed top-4 left-0 right-0 max-w-screen-xl mx-auto z-50 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-lg">
      <div className="flex items-center space-x-8">
        <div 
          className="h-8 w-auto overflow-hidden cursor-pointer" 
          onClick={() => setCurrentPage('home')}
        >
          <img
            src={theme === 'dark' ? "https://placehold.co/120x40/transparent/ffffff?text=LOMOA&font=raleway" : "https://placehold.co/120x40/transparent/1f2937?text=LOMOA&font=raleway"}
            alt="LOMOA Logo"
            className="w-full h-full object-contain"
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
        
        <div className="relative" ref={dropdownRef}>
            {isLoggedIn && user ? (
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 p-1.5 pr-4 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <img src={`https://placehold.co/32x32/a78bfa/ffffff?text=${user.mainCharacter ? user.mainCharacter.charAt(0) : '?'}`} alt="User Profile" className="w-8 h-8 rounded-full" />
                    <span className="font-bold text-sm">{user.mainCharacter || '캐릭터 없음'}</span>
                </button>
            ) : (
                <button onClick={onLoginClick} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 text-sm">로그인</button>
            )}

            {isDropdownOpen && isLoggedIn && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-gray-700 rounded-lg shadow-xl py-2">
                    <button onClick={() => { onProfileClick(); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2">
                        <Settings size={16} /> 회원정보 수정
                    </button>
                    <button onClick={() => { onRefreshCharacters(); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2">
                        <RefreshCw size={16} /> 캐릭터 목록 갱신
                    </button>
                    <button onClick={() => { onLogout(); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2">
                        <LogOut size={16} /> 로그아웃
                    </button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};
