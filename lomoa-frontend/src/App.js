import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

// 컴포넌트와 페이지들을 불러옵니다.
import Header from './components/Header';
import SocialModal from './components/SocialModal';
import HomePage from './pages/HomePage';
import HomeworkPage from './pages/HomeworkPage';
import CharacterSearchPage from './pages/CharacterSearchPage'; // 검색 페이지 import
import RaidPage from './pages/RaidPage'; // 공격대 페이지 import
import PlaceholderPage from './components/PlaceholderPage';

export default function App() {
  // 어떤 페이지를 보여줄지 관리하는 상태
  const [currentPage, setCurrentPage] = useState('home');
  // 소셜 모달창이 열렸는지 관리하는 상태
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  // 다크/라이트 모드 테마를 관리하는 상태
  const [theme, setTheme] = useState('dark');
  // 검색어 상태 추가
  const [searchQuery, setSearchQuery] = useState('');

  // 테마가 변경될 때마다 HTML 전체에 클래스를 적용합니다.
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  // 검색을 처리하는 함수
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage('search'); // 페이지를 'search'로 변경
  };

  // currentPage 상태에 따라 적절한 페이지 컴포넌트를 보여주는 함수
  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case '숙제': return <HomeworkPage />;
      case 'search': return <CharacterSearchPage searchQuery={searchQuery} />; // 검색 페이지 렌더링 로직 추가
      case '공격대': return <RaidPage />; // 공격대 페이지 렌더링
      case '재련': return <PlaceholderPage title="재련 계산기" />;
      case '생활': return <PlaceholderPage title="생활 컨텐츠" />;
      case '레이드': return <PlaceholderPage title="레이드" />;
      default: return <HomePage />;
    }
  };

  return (
    // 앱 전체의 배경색과 글자색을 테마에 맞게 설정합니다.
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen font-sans transition-colors duration-300">
      {/* 헤더는 항상 보입니다. */}
      <Header 
        setCurrentPage={setCurrentPage} 
        theme={theme} 
        setTheme={setTheme}
        onSearch={handleSearch} // 검색 함수를 Header에 전달
      />
      
      {/* 메인 컨텐츠 영역: renderPage 함수가 반환하는 페이지가 여기에 보입니다. */}
      <main className="max-w-screen-xl mx-auto">
        {renderPage()}
      </main>

      {/* 소셜 버튼(+)은 항상 보입니다. */}
      <button 
        onClick={() => setIsSocialModalOpen(true)} 
        className="fixed bottom-8 right-8 bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-30 transition-transform hover:scale-110 border border-gray-200 dark:border-gray-600">
        <Plus className="w-8 h-8" />
      </button>

      {/* 소셜 모달창 컴포넌트 */}
      <SocialModal isOpen={isSocialModalOpen} setIsOpen={setIsSocialModalOpen} />
    </div>
  );
}