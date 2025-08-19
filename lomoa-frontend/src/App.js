import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';

// 컴포넌트와 페이지들을 불러옵니다.
import Header from './components/Header'; // 헤더
import SocialModal from './components/SocialModal'; // 대화창
import AuthModal from './components/AuthModal'; // 로그인
import ProfileModal from './components/ProfileModal'; // 프로필
import HomePage from './pages/HomePage'; // 메인
import HomeworkPage from './pages/HomeworkPage'; // 숙제
import CharacterSearchPage from './pages/CharacterSearchPage'; // 캐릭터 검색창
import RaidPage from './pages/RaidPage'; // 레이드
import PlaceholderPage from './components/PlaceholderPage'; // 이게모지?

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 어떤 페이지를 보여줄지 관리하는 상태
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false); // 소셜 모달창이 열렸는지 관리하는 상태
  const [theme, setTheme] = useState('dark'); // 다크/라이트 모드 테마를 관리하는 상태
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태 추가

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

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

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    setCharacters([]);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    alert('로그아웃되었습니다.');
  }, []);

  const fetchCharactersFromDB = useCallback(async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
        const response = await fetch('http://localhost:8000/api/characters', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setCharacters(data);
    } catch (error) {
        console.error("캐릭터 정보 불러오기 실패:", error);
        // 실패 시 로그아웃 대신 에러 메시지만 표시
        alert('캐릭터 정보를 불러오는 데 실패했습니다. 다시 로그인해주세요.');
        handleLogout();
    }
  }, [handleLogout]);

  useEffect(() => {
    const checkUserStatus = async () => {
        const token = localStorage.getItem('userToken');
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (token && userData) {
            setIsLoggedIn(true);
            setUser(userData);
            await fetchCharactersFromDB();
        }
        setIsLoading(false);
    };
    checkUserStatus();
  }, [fetchCharactersFromDB]);

  const handleLoginSuccess = (data) => {
    setIsLoggedIn(true);
    setUser(data.user);
    localStorage.setItem('userToken', data.token);
    localStorage.setItem('userData', JSON.stringify(data.user));
    setIsAuthModalOpen(false);
    fetchCharactersFromDB();
  };
  
  const handleUpdateUser = async (updateData) => {
    const token = localStorage.getItem('userToken');
    if (!token) return alert('로그인이 필요합니다.');

    try {
        const response = await fetch('http://localhost:8000/api/user/update', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        
        alert('성공적으로 업데이트되었습니다.');
        
        const updatedUser = { ...user, apiKey: updateData.apiKey };
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        
        if (updatedUser.apiKey) {
            fetchCharactersFromDB();
        }
    } catch (error) {
        alert(error.message);
    }
  };

  const handleRefreshCharacters = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return alert('로그인이 필요합니다.');
    try {
        const response = await fetch('http://localhost:8000/api/characters/refresh', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        alert(data.message);
        fetchCharactersFromDB();
    } catch (error) {
        alert(error.message);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case '숙제': return <HomeworkPage characters={characters} setCharacters={setCharacters} />;
      case 'search': return <CharacterSearchPage searchQuery={searchQuery} />;
      case '공격대': return <RaidPage />;
      case '재련': return <PlaceholderPage title="재련 계산기" />;
      case '생활': return <PlaceholderPage title="생활 컨텐츠" />;
      case '레이드': return <PlaceholderPage title="레이드" />;
      default: return <HomePage />;
    }
  };

  if (isLoading) {
      return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">로딩 중...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen font-sans transition-colors duration-300">
      <Header 
        setCurrentPage={setCurrentPage} 
        theme={theme} 
        setTheme={setTheme}
        onSearch={handleSearch}
        isLoggedIn={isLoggedIn}
        user={user} 
        onLoginClick={() => setIsAuthModalOpen(true)}
        onProfileClick={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
        onRefreshCharacters={handleRefreshCharacters}
      />
      <main className="max-w-screen-xl mx-auto">
        {renderPage()}
      </main>
      <button onClick={() => setIsSocialModalOpen(true)} className="fixed bottom-8 right-8 bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-30 transition-transform hover:scale-110 border border-gray-200 dark:border-gray-600">
        <Plus className="w-8 h-8" />
      </button>
      <SocialModal isOpen={isSocialModalOpen} setIsOpen={setIsSocialModalOpen} />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={user}
        onUpdate={handleUpdateUser}
      />
    </div>
  );
}