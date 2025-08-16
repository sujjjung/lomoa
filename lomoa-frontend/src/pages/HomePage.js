import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

// Mock Data
const MOCK_WEEKLY_EVENTS = {
  2: [{ time: '16:00', title: '3막 모르둠 하드', participants: ['카제로스', '우엑'] }],
  4: [{ time: '16:00', title: '서막 에키드나 하드', participants: ['카제로스', '깐부'] }],
};
const MOCK_EVENT_IMAGES = [
    'https://placehold.co/200x400/3b82f6/ffffff?text=Event+1',
    'https://placehold.co/200x400/ef4444/ffffff?text=Event+2',
    'https://placehold.co/200x400/22c55e/ffffff?text=Event+3',
];

const MOCK_NOTICES = [
    { 
        id: 1, 
        title: '카멘 익스트림, 4막, 종막 카제로스 레이드 추가',
        summary: '아래 레이드들이 추가되었습니다! - 카멘 익스트림 / 노말 1관...',
        date: '6/23(월) 15:19',
        categoryColor: 'text-red-400'
    },
    { 
        id: 2, 
        title: '도전 출근왕 날짜 계산기 추가',
        summary: '안녕하세요! 50일 도전 출근왕 날짜 계산기가 ...',
        date: '4/22(화) 10:32',
        categoryColor: 'text-blue-400'
    },
    { 
        id: 3, 
        title: '커스텀 휴식게이지 자동 충전 공지',
        summary: '안녕하세요. 커스텀 숙제 데이터 이전 과정에서 정상적이지 ...',
        date: '3/14(금) 09:02',
        categoryColor: 'text-green-400'
    },
];

// HomePage의 서브 컴포넌트들
const WeeklyCalendarCard = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDays = Array(7).fill(0).map((_, i) => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - d.getDay() + i);
        return d;
    });

    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg h-full">
            <div className="flex justify-between items-center mb-6">
                <p className="font-bold text-xl">{`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}</p>
                <div className="flex items-center space-x-2">
                    <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronLeft size={20} /></button>
                    <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronRight size={20} /></button>
                    <button className="p-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Plus size={20} /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-4 text-center">
                {weekDays.map((date, i) => (
                    <div key={i}>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{days[i]}</p>
                        <p className={`font-bold text-lg mt-1 ${new Date().toDateString() === date.toDateString() ? 'text-purple-600 dark:text-purple-400' : ''}`}>{date.getDate()}</p>
                        <div className="mt-4 space-y-2 text-left h-32 overflow-y-auto no-scrollbar">
                            {(MOCK_WEEKLY_EVENTS[i] || []).map((event, idx) => (
                                <div key={idx} className="bg-gray-200 dark:bg-gray-700/50 p-2 rounded-md">
                                    <p className="text-xs font-bold">{event.time} {event.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.participants.join(' • ')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
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
    return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg h-full flex overflow-hidden">
            <div className="w-1/3 flex items-center justify-center p-4">
                <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-md">
                    {MOCK_EVENT_IMAGES.map((src, index) => (
                        <img key={index} src={src} alt={`Event ${index + 1}`} className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentEvent ? 'opacity-100' : 'opacity-0'}`} />
                    ))}
                </div>
            </div>
            <div className="w-2/3 flex flex-col justify-center p-6 space-y-4">
                {MOCK_NOTICES.map(notice => (
                    <div key={notice.id} className="cursor-pointer group">
                        <h3 className="font-bold text-lg truncate group-hover:text-purple-400">{notice.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{notice.summary}</p>
                        <p className={`text-sm font-semibold mt-1 ${notice.categoryColor}`}>{notice.date}</p>
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
