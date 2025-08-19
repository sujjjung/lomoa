import React, { useState } from 'react';
import { X, Lock, User, ArrowLeft, Key } from 'lucide-react';

// 소셜 로그인 버튼 컴포넌트
const SocialButton = ({ provider, icon, bgColor, textColor }) => (
    <button className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg font-bold transition-opacity hover:opacity-80 ${bgColor} ${textColor}`}>
        {icon}
        {provider} 계정으로 로그인
    </button>
);

// 기본 로그인 뷰
const LoginView = ({ setView }) => (
    <>
        <h2 className="text-2xl font-bold text-center mb-2">로그인</h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">LOMOA에 오신 것을 환영합니다!</p>
        <div className="space-y-3">
            <SocialButton provider="Discord" bgColor="bg-[#5865F2]" textColor="text-white" icon={<img src="https://placehold.co/24x24/ffffff/000000?text=D" alt="Discord" className="rounded-full"/>} />
            <SocialButton provider="카카오" bgColor="bg-[#FEE500]" textColor="text-black" icon={<img src="https://placehold.co/24x24/000000/ffffff?text=K" alt="Kakao" className="rounded-full"/>} />
            <SocialButton provider="Google" bgColor="bg-white" textColor="text-black" icon={<img src="https://placehold.co/24x24/ffffff/000000?text=G" alt="Google" className="rounded-full"/>} />
        </div>
        <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="mx-4 text-xs text-gray-500 dark:text-gray-400">또는</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="space-y-2">
            <button onClick={() => setView('emailLogin')} className="w-full py-3 bg-gray-200 dark:bg-gray-700 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                이메일로 로그인
            </button>
            <button onClick={() => setView('register')} className="w-full text-center text-sm text-purple-600 dark:text-purple-400 font-semibold hover:underline pt-2">
                이메일로 회원가입
            </button>
        </div>
    </>
);

// 이메일 로그인 뷰
const EmailLoginView = ({ setView, onLoginSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const username = event.target.username.value;
        const password = event.target.password.value;

        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || '로그인에 실패했습니다.');
            }
            
            onLoginSuccess(data);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
     <>
        <button onClick={() => setView('login')} className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
            <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input name="username" type="text" placeholder="아이디" required className="w-full p-3 pl-10 bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
            <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input name="password" type="password" placeholder="비밀번호" required className="w-full p-3 pl-10 bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
            <button type="submit" disabled={isLoading} className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-purple-400">
                {isLoading ? '로그인 중...' : '로그인'}
            </button>
        </form>
    </>
    );
};

// 회원가입 뷰
const RegisterView = ({ setView }) => {
    const handleRegister = async (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const mainCharacter = event.target.mainCharacter.value;
        const password = event.target.password.value;
        const passwordConfirm = event.target.passwordConfirm.value;
        const apiKey = event.target.apiKey.value;

        if (password !== passwordConfirm) {
            return alert('비밀번호가 일치하지 않습니다.');
        }

        try {
            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, mainCharacter, password, apiKey }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            
            alert('회원가입 성공! 로그인 해주세요.');
            setView('emailLogin');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
    <>
        <button onClick={() => setView('login')} className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ArrowLeft size={20} /></button>
        <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>
        <form className="space-y-4" onSubmit={handleRegister}>
            <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input name="username" type="text" placeholder="아이디" required className="w-full p-3 pl-10 bg-gray-200 dark:bg-gray-700 rounded-lg" /></div>
            <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input name="mainCharacter" type="text" placeholder="대표 캐릭터명" required className="w-full p-3 pl-10 bg-gray-200 dark:bg-gray-700 rounded-lg" /></div>
            <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input name="password" type="password" placeholder="비밀번호" required className="w-full p-3 pl-10 bg-gray-200 dark:bg-gray-700 rounded-lg" /></div>
            <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input name="passwordConfirm" type="password" placeholder="비밀번호 확인" required className="w-full p-3 pl-10 bg-gray-200 dark:bg-gray-700 rounded-lg" /></div>
            <div className="relative"><Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input name="apiKey" type="text" placeholder="로스트아크 API 키 (선택)" className="w-full p-3 pl-10 bg-gray-200 dark:bg-gray-700 rounded-lg" /></div>
            <button type="submit" className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700">회원가입</button>
        </form>
    </>
    );
};

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
    const [view, setView] = useState('login'); // 'login', 'register', 'emailLogin'

    const handleClose = () => {
        setView('login');
        onClose();
    };

    const renderView = () => {
        switch (view) {
            case 'register':
                return <RegisterView setView={setView} />;
            case 'emailLogin':
                return <EmailLoginView setView={setView} onLoginSuccess={onLoginSuccess} />;
            case 'login':
            default:
                return <LoginView setView={setView} />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={handleClose}>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-8 relative" onClick={e => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <X size={20} />
                </button>
                {renderView()}
            </div>
        </div>
    );
}