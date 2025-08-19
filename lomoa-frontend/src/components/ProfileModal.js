import React, { useState, useEffect } from 'react';
import { X, Lock, Key } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, user, onUpdate }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [apiKey, setApiKey] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // 모달이 열리거나 user 정보가 변경될 때마다
    // API 키 상태를 최신 정보로 동기화합니다.
    useEffect(() => {
        if (isOpen && user) {
            setApiKey(user.apiKey || '');
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (newPassword && newPassword !== confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        onUpdate({ newPassword: newPassword || null, apiKey });
        onClose();
    };

    const handleValidateApiKey = async () => {
        if (!apiKey) return alert('API 키를 입력해주세요.');
        try {
            const response = await fetch('http://localhost:8000/api/validate-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey, characterName: user.mainCharacter })
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            alert('API 키 확인 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex gap-2">
                        <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === 'profile' ? 'bg-purple-600 text-white' : ''}`}>회원 정보 수정</button>
                        <button onClick={() => setActiveTab('api')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === 'api' ? 'bg-purple-600 text-white' : ''}`}>API 키 관리</button>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={20} /></button>
                </div>
                
                <div className="p-6 space-y-4">
                    {activeTab === 'profile' && (
                        <div>
                            <h3 className="font-bold mb-4">비밀번호 변경</h3>
                            <div className="space-y-3">
                                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="password" placeholder="새 비밀번호" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 pl-10 bg-gray-200 dark:bg-gray-700 rounded-lg" /></div>
                                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="password" placeholder="새 비밀번호 확인" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 pl-10 bg-gray-200 dark:bg-gray-700 rounded-lg" /></div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'api' && (
                         <div>
                            <h3 className="font-bold mb-2">로스트아크 API 키</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                로스트아크 개발자 센터에서 발급받은 API 키를 입력하세요. 원정대 정보를 자동으로 불러올 수 있습니다.
                            </p>
                            <div className="flex gap-2">
                                <div className="relative flex-grow"><Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="text" placeholder="API 키를 입력하세요" value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full p-3 pl-10 bg-gray-200 dark:bg-gray-700 rounded-lg" /></div>
                                <button onClick={handleValidateApiKey} className="px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-semibold">키 확인</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={handleSave} className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">저장</button>
                </div>
            </div>
        </div>
    );
}