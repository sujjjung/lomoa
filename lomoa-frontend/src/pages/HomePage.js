import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import main_1 from '../assets/image/main_1.jpg'
import main_2 from '../assets/image/main_2.jpg'
import main_3 from '../assets/image/main_3.jpg'
import main_4 from '../assets/image/main_4.jpg'

// Mock Data - type 추가 (personal, friend, raid)
const MOCK_INITIAL_EVENTS = {
  '2025-08-12': [{ time: '16:00', title: '3막 모르둠 하드', type: 'friend' }],
  '2025-08-14': [{ time: '16:00', title: '2막 아브렐슈드 노말', type: 'friend' }],
  '2025-08-20': [{ time: '20:00', title: '카제로스 공대', type: 'raid' }],
  '2025-08-21': [{ time: '21:00', title: '개인 용무', type: 'personal' }],
  '2025-07-31': [{ time: '18:00', title: '월말정산', type: 'personal' }], // 이전 달 데이터 예시
};
const MOCK_EVENT_IMAGES = [
    main_1,main_2,main_3,main_4
];

const MOCK_NOTICES = [
    { 
        id: 1, 
        category: '공지',
        title: '리샤의 편지에서 카제로스 레이드의 마지막 장과 업데이트 소식을 전합니다.',
        date: '2025.08.14',
    },
    { 
        id: 2, 
        category: '상점',
        title: '8월 13일(수) 신규 상품 및 확률 안내',
        date: '2025.08.13',
    },
    { 
        id: 3, 
        category: '점검',
        title: '8월 13일(수) 업데이트 내역 안내',
        date: '2025.08.13',
    },
];

// HomePage의 서브 컴포넌트들

const AddEventModal = ({ isOpen, onClose, onAddEvent }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('12:00');
    const [title, setTitle] = useState('');
    const [type, setType] = useState('personal');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (date && title) {
            onAddEvent({ date, time, title, type });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">일정 추가</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold">날짜</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">시간</label>
                        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">일정명</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="일정명을 입력하세요" className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">구분</label>
                        <select value={type} onChange={e => setType(e.target.value)} className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="personal">개인</option>
                            <option value="friend">깐부</option>
                            <option value="raid">공격대</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700">추가</button>
                </form>
            </div>
        </div>
    );
};


const WeeklyCalendarCard = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState(MOCK_INITIAL_EVENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const changeWeek = (offset) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + offset * 7);
            return newDate;
        });
    };

    const handleAddEvent = (newEvent) => {
        setEvents(prevEvents => {
            const newEvents = { ...prevEvents };
            if (!newEvents[newEvent.date]) {
                newEvents[newEvent.date] = [];
            }
            newEvents[newEvent.date].push({ time: newEvent.time, title: newEvent.title, type: newEvent.type });
            newEvents[newEvent.date].sort((a, b) => a.time.localeCompare(b.time));
            return newEvents;
        });
    };

    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDays = Array(7).fill(0).map((_, i) => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - d.getDay() + i);
        return d;
    });

    const EventBadge = ({ time, title, type }) => {
        const typeStyles = {
            personal: 'bg-green-500/80 dark:bg-green-500/50 text-white',
            friend: 'bg-blue-500/80 dark:bg-blue-500/50 text-white',
            raid: 'bg-red-500/80 dark:bg-red-500/50 text-white',
        };
        const displayTitle = type === 'friend' ? `[깐부] ${title}` : title;
        return (
            <div className={`p-2 rounded-md ${typeStyles[type] || 'bg-gray-200 dark:bg-gray-700/50'}`}>
                <p className="text-xs font-bold truncate">{time} {displayTitle}</p>
            </div>
        );
    };

    return (
        <>
            <AddEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddEvent={handleAddEvent} />
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg h-full">
                <div className="flex justify-between items-center mb-6">
                    <p className="font-bold text-xl">{`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}</p>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => changeWeek(-1)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronLeft size={20} /></button>
                        <button onClick={() => changeWeek(1)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronRight size={20} /></button>
                        <button onClick={() => setIsModalOpen(true)} className="p-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Plus size={20} /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-4 text-center">
                    {weekDays.map((date, i) => {
                        const dateString = date.toISOString().split('T')[0];
                        const dayEvents = events[dateString] || [];
                        const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                        return (
                            <div key={i}>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{days[i]}</p>
                                <p className={`font-bold text-lg mt-1 ${
                                    new Date().toDateString() === date.toDateString() 
                                        ? 'text-purple-600 dark:text-purple-400' 
                                        : isCurrentMonth 
                                            ? '' 
                                            : 'text-gray-400/50 dark:text-gray-500/50'
                                }`}>{date.getDate()}</p>
                                <div className="mt-4 space-y-2 text-left h-32 overflow-y-auto no-scrollbar">
                                    {dayEvents.map((event, idx) => (
                                        <EventBadge key={idx} time={event.time} title={event.title} type={event.type} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

const ContentTimer = ({ imgSrc, title, time }) => {
    const [timeLeft, setTimeLeft] = useState(time);
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft]);
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };
    return (
        <div className="flex flex-col items-center text-center">
            <img src={imgSrc} alt={title} className="w-20 h-20 rounded-full mb-2 border-2 border-gray-200 dark:border-gray-700" />
            <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
            <p className="text-lg font-mono font-bold tracking-wider">{formatTime(timeLeft)}</p>
        </div>
    );
};

const TodayContentCard = () => (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg h-full flex items-center justify-around">
        <ContentTimer imgSrc="https://placehold.co/80x80/ef4444/ffffff?text=혼돈" title="카오스 게이트" time={9029} />
        <ContentTimer imgSrc="https://placehold.co/80x80/3b82f6/ffffff?text=모험" title="모험섬" time={15929} />
        <ContentTimer imgSrc="https://placehold.co/80x80/22c55e/ffffff?text=보스" title="필드보스" time={4329} />
        <ContentTimer imgSrc="https://placehold.co/80x80/f97316/ffffff?text=유령" title="유령선" time={20029} />
    </div>
);

const NoticeAndEventsCard = () => {
    const [currentEvent, setCurrentEvent] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentEvent(prev => (prev + 1) % MOCK_EVENT_IMAGES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const categoryStyles = {
        '공지': 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200',
        '상점': 'bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-200',
        '점검': 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200',
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg h-full flex overflow-hidden">
            <div className="w-1/3 flex items-center justify-center p-4">
                <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-md">
                    {MOCK_EVENT_IMAGES.map((src, index) => (
                        <img key={index} src={src} alt={`Event ${index + 1}`} className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentEvent ? 'opacity-100' : 'opacity-0'}`} />
                    ))}
                </div>
            </div>
            <div className="w-2/3 flex flex-col justify-center p-6 space-y-3">
                {MOCK_NOTICES.map(notice => (
                    <div key={notice.id} className="cursor-pointer group border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className={`flex-shrink-0 whitespace-nowrap px-2 py-0.5 rounded-md text-xs font-bold ${categoryStyles[notice.category] || categoryStyles['공지']}`}>
                                    {notice.category}
                                </span>
                                <p className="font-semibold truncate group-hover:text-purple-400">{notice.title}</p>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">{notice.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 메인 HomePage 컴포넌트
export default function HomePage() {
  return (
    <div className="p-4 pt-28 space-y-6">
        <div className="w-full">
            <WeeklyCalendarCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TodayContentCard />
            <NoticeAndEventsCard />
        </div>
    </div>
  );
};