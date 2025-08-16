import React, { useState } from 'react';
import { MessageCircle, User, X } from 'lucide-react';

// Mock Data for SocialModal
// 목업 데이터 
const MOCK_FRIENDS_DETAILED = [
  { id: 1, name: '이뚜덩', avatar: 'https://placehold.co/48x48/a78bfa/ffffff?text=뚜', character: '아브렐슈드 도화가 Lv.1720', status: '녜' },
  { id: 2, name: '슬레이붱', avatar: 'https://placehold.co/48x48/7c3aed/ffffff?text=에', character: '카제로스 슬레이어 Lv.1750', status: '돌아와' },
  { id: 3, name: '탄현동붓붓주먹', avatar: 'https://placehold.co/48x48/22c55e/ffffff?text=아', character: '아브렐슈드 도화가 Lv.1760', status: '짱쎈에스더' },
  { id: 4, name: '기무엉', avatar: 'https://placehold.co/48x48/3b82f6/ffffff?text=실', character: '아브렐슈드 발키리 Lv.1755', status: '삥빵뽕' },
];

const MOCK_CHAT_LIST = [
    { friendId: 1, name: '이뚜덩', avatar: './assets/images/user_profile.png', lastMessage: '숙제 다 했어?', time: '17:23', unread: 1 },
    { friendId: 2, name: '탄현동붓붓주먹', avatar: 'https://placehold.co/48x48/7c3aed/ffffff?text=에', lastMessage: '60 가야지', time: '16:50', unread: 0 },
    { friendId: 3, name: '은빛칼날북부대공', avatar: 'https://placehold.co/48x48/22c55e/ffffff?text=아', lastMessage: 'ㅋㅋㅋㅋㅋ', time: '어제', unread: 3 },
];

export default function SocialModal({ isOpen, setIsOpen }) {
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'friends'

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex justify-end items-end p-8" onClick={() => setIsOpen(false)}>
            <div className="w-96 h-[600px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700/50" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700/50">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setActiveTab('chat')} className={`flex items-center space-x-2 p-2 rounded-lg ${activeTab === 'chat' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                            <MessageCircle size={20} />
                            <span>대화 목록</span>
                        </button>
                        <button onClick={() => setActiveTab('friends')} className={`flex items-center space-x-2 p-2 rounded-lg ${activeTab === 'friends' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                            <User size={20} />
                            <span>친구 목록</span>
                        </button>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={20} /></button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto">
                    {activeTab === 'chat' ? (
                        <ul>
                            {MOCK_CHAT_LIST.map(chat => (
                                <li key={chat.friendId} className="flex items-center p-3 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 cursor-pointer">
                                    <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-xl mr-4" />
                                    <div className="flex-grow">
                                        <p className="font-bold">{chat.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                                    </div>
                                    <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                                        <p>{chat.time}</p>
                                        {chat.unread > 0 && (
                                            <span className="mt-1 inline-block bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">{chat.unread}</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul>
                            {MOCK_FRIENDS_DETAILED.map(friend => (
                                <li key={friend.id} className="flex items-center p-3 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 cursor-pointer">
                                    <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-xl mr-4" />
                                    <div className="flex-grow">
                                        <p className="font-bold">{friend.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{friend.character}</p>
                                        <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">{friend.status}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};