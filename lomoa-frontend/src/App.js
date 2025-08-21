import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import HomeworkPage from './pages/HomeworkPage';
import RaidPage from './pages/RaidPage';
import CharacterSearchPage from './pages/CharacterSearchPage';
import PlaceholderPage from './components/PlaceholderPage';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import SocialModal from './components/SocialModal';

export default function App() {
    // --- 상태 관리 ---
    const [theme, setTheme] = useState('dark');
    const [currentPage, setCurrentPage] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');

    // 인증 관련 상태
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // 모달 관련 상태
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

    // 데이터 상태
    const [characters, setCharacters] = useState([]);

    // --- useEffect 훅 ---

    // 테마 적용
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // 로그인 상태 확인 (앱 시작 시 1회 실행)
    useEffect(() => {
        const storedToken = localStorage.getItem('userToken');
        const storedUser = localStorage.getItem('userData');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    // 캐릭터 데이터 불러오기 (로그인 상태 변경 시)
    const fetchCharacters = useCallback(async () => {
        const currentToken = localStorage.getItem('userToken');
        if (!currentToken) {
            setCharacters([]);
            return;
        };
        try {
            const response = await fetch('http://localhost:8000/api/characters', {
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });
            if (!response.ok) {
                 if (response.status === 401) { // 토큰 만료 시
                    handleLogout();
                }
                throw new Error('캐릭터 정보 로딩 실패');
            }
            const data = await response.json();
            setCharacters(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchCharacters();
    }, [isLoggedIn, fetchCharacters]);

    // 로그인 성공 처리
    const handleLoginSuccess = (data) => {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setIsLoggedIn(true);
        setIsAuthModalOpen(false);
        setCurrentPage('숙제'); // 로그인 후 숙제 페이지로 이동
    };

    // 로그아웃 처리
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
        setCurrentPage('home'); // 로그아웃 후 홈으로 이동
    };

    // 회원정보 업데이트 처리
    const handleUpdateUser = async (updateData) => {
        try {
            const response = await fetch('http://localhost:8000/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            alert('정보가 성공적으로 업데이트되었습니다.');
            const updatedUser = { ...user, apiKey: updateData.apiKey };
            setUser(updatedUser);
            localStorage.setItem('userData', JSON.stringify(updatedUser));
            setIsProfileModalOpen(false);
        } catch (error) {
            alert(error.message);
        }
    };
    
    // 캐릭터 검색 처리
    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage('search');
    };

    // 페이지 렌더링
    const renderPage = () => {
        if (!isLoggedIn && currentPage === '숙제') {
             return <HomePage />; // 비로그인 시 숙제 페이지 접근하면 홈으로
        }
        if (currentPage === 'search') {
            return <CharacterSearchPage searchQuery={searchQuery} />;
        }
        switch (currentPage) {
            case 'home':
                return <HomePage />;
            case '숙제':
                return <HomeworkPage characters={characters} setCharacters={setCharacters} fetchCharacters={fetchCharacters} />;
            case '공격대':
                return <RaidPage />;
            case '재련':
            case '생활':
            case '레이드':
                return <PlaceholderPage title={currentPage} />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
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
                onRefreshCharacters={fetchCharacters}
            />
            <main className="max-w-screen-xl mx-auto">
                {renderPage()}
            </main>
            
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />
            {user && (
                <ProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    user={user}
                    onUpdate={handleUpdateUser}
                />
            )}
            <SocialModal isOpen={isSocialModalOpen} setIsOpen={setIsSocialModalOpen} />

            <button 
                onClick={() => setIsSocialModalOpen(true)}
                className="fixed bottom-8 right-8 bg-purple-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700 transition-transform hover:scale-110"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a2 2 0 01-2 2H9.5a.5.5 0 000 1H13a3 3 0 003-3V7a1 1 0 10-2 0z" />
                </svg>
            </button>
        </div>
    );
}