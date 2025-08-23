import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import main_1 from '../assets/image/main_1.jpg'
import main_2 from '../assets/image/main_2.jpg'
import main_3 from '../assets/image/main_3.jpg'
import main_4 from '../assets/image/main_4.jpg'
import main_5 from '../assets/image/main_5.jpg'

const MOCK_EVENT_IMAGES = [ main_1, main_2, main_3, main_4, main_5 ];

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

// [수정] 주간 캘린더 카드
const WeeklyCalendarCard = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showContents, setShowContents] = useState({ fieldBoss: true, chaosGate: true });

    const changeWeek = (offset) => {
        setCurrentDate(prev => { const d = new Date(prev); d.setDate(d.getDate() + offset * 7); return d; });
    };

    const EventBadge = ({ title, type }) => {
        const typeStyles = {
            personal: 'bg-green-500/80 text-white',
            fieldBoss: 'bg-red-500/80 text-white',
            chaosGate: 'bg-sky-500/80 text-white', // [수정] 메인 컬러 변경
        };
        // [수정] text-center 추가
        return (
            <div className={`p-1.5 rounded-md text-center ${typeStyles[type] || 'bg-gray-200'}`}>
                <p className="text-xs font-bold truncate">{title}</p>
            </div>
        );
    };

    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDays = Array(7).fill(0).map((_, i) => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - d.getDay() + i);
        return d;
    });

    return (
        <>
            <AddEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddEvent={(e) => {}} />
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg h-full">
                <div className="flex justify-between items-center mb-6">
                    <p className="font-bold text-xl">{`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}</p>
                    <div className="flex items-center space-x-2">
                        <label className="flex items-center cursor-pointer text-sm">
                            <input type="checkbox" checked={showContents.fieldBoss} onChange={() => setShowContents(s => ({...s, fieldBoss: !s.fieldBoss}))} className="sr-only peer" />
                            <div className="w-9 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                            <span className="ml-2 font-semibold">필드보스</span>
                        </label>
                        <label className="flex items-center cursor-pointer text-sm">
                            <input type="checkbox" checked={showContents.chaosGate} onChange={() => setShowContents(s => ({...s, chaosGate: !s.chaosGate}))} className="sr-only peer" />
                            <div className="w-9 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                            <span className="ml-2 font-semibold">카오스게이트</span>
                        </label>
                        <div className="border-l h-5 mx-2 border-gray-300 dark:border-gray-600"></div>
                        <button onClick={() => changeWeek(-1)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronLeft size={20} /></button>
                        <button onClick={() => changeWeek(1)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronRight size={20} /></button>
                        <button onClick={() => setIsModalOpen(true)} className="p-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Plus size={20} /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-4 text-center">
                    {weekDays.map((date, i) => {
                        const dayOfWeek = date.getDay();
                        const weeklyContents = [];
                        if(showContents.fieldBoss && [0, 2, 5].includes(dayOfWeek)) weeklyContents.push({ title: '필드보스', type: 'fieldBoss' });
                        if(showContents.chaosGate && [0, 1, 4, 6].includes(dayOfWeek)) weeklyContents.push({ title: '카오스게이트', type: 'chaosGate' });

                        return (
                            <div key={i}>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{days[i]}</p>
                                <p className={`font-bold text-lg mt-1 ${new Date().toDateString() === date.toDateString() ? 'text-sky-500' : ''}`}>{date.getDate()}</p>
                                <div className="mt-4 space-y-2 text-left h-32 overflow-y-auto no-scrollbar">
                                    {weeklyContents.map((evt, idx) => <EventBadge key={`wc-${idx}`} {...evt} />)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

// 오늘의 콘텐츠 타이머 카드
const TodayContentTimersCard = () => {
    const [contents, setContents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContents = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/lostark/contents');
                if (!response.ok) throw new Error('데이터 로딩 실패');
                const data = await response.json();
                
                const today = new Date();
                if (today.getHours() < 6) {
                    today.setDate(today.getDate() - 1);
                }
                const todayString = today.toISOString().split('T')[0];

                const todayIslands = data
                    .filter(c => c.CategoryName === '모험 섬' && c.StartTimes?.some(time => time.startsWith(todayString)))
                    .slice(0, 3);
                
                setContents(todayIslands);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContents();
    }, []);

    const Countdown = ({ startTimes }) => {
        const [timeLeft, setTimeLeft] = useState(0);

        useEffect(() => {
            const calculateTimeLeft = () => {
                const now = new Date();
                const upcoming = startTimes
                    .map(t => new Date(t))
                    .filter(t => t > now)
                    .sort((a,b) => a - b)[0];
                
                if (upcoming) {
                    return Math.max(0, Math.floor((upcoming - now) / 1000));
                }
                return 0;
            };

            setTimeLeft(calculateTimeLeft());
            const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
            return () => clearInterval(interval);
        }, [startTimes]);

        if (timeLeft <= 0) return <span className="text-lg font-mono font-bold tracking-wider">종료</span>;

        const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
        const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        return <span className="text-lg font-mono font-bold tracking-wider">{`${h}:${m}:${s}`}</span>;
    };
    
    let cardContent;
    if (isLoading) cardContent = <p>정보 로딩 중...</p>;
    else if (error) cardContent = <p className="text-red-400">{error}</p>;
    else if (contents.length === 0) cardContent = <p>오늘 등장하는 모험 섬이 없습니다.</p>;
    else cardContent = contents.map(content => (
        <div key={content.ContentsName} className="flex flex-col items-center text-center">
            <img src={content.ContentsIcon} alt={content.ContentsName} className="w-20 h-20 rounded-full mb-2" />
            <p className="text-sm font-semibold">{content.ContentsName}</p>
            <Countdown startTimes={content.StartTimes} />
        </div>
    ));

    return (
        // [수정] gap-x-8을 gap-x-4로 줄여서 간격 좁힘
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg h-full flex items-center justify-center gap-x-4">
            {cardContent}
        </div>
    );
};

// 공지사항 및 이벤트 카드
const NoticeAndEventsCard = () => {
    const [notices, setNotices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/lostark/notices');
                if (!response.ok) throw new Error('공지사항 로딩 실패');
                const data = await response.json();
                setNotices(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotices();
    }, []);


    const categoryStyles = {
        '공지': 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200',
        '상점': 'bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-200',
        '점검': 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200',
        '이벤트': 'bg-rose-100 dark:bg-rose-800 text-rose-800 dark:text-rose-200',
    };

    // [추가] 현재 보여줄 이미지의 인덱스를 관리하는 상태
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // [추가] 3초마다 이미지를 변경하는 효과
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % MOCK_EVENT_IMAGES.length);
        }, 5000); // 3초마다 변경

        // 컴포넌트가 사라질 때 타이머를 정리합니다.
        return () => clearInterval(timer);
    }, [MOCK_EVENT_IMAGES.length]);

    return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg h-full flex overflow-hidden p-6 gap-6 items-center">
            <div className="w-1/2 flex-shrink-0 relative aspect-[890/508]">
                 {MOCK_EVENT_IMAGES.map((imageSrc, index) => (
                    <img 
                        key={index}
                        src={imageSrc} 
                        alt={`Event ${index + 1}`} 
                        className={`absolute top-0 left-0 w-full h-full object-cover rounded-lg transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`} 
                    />
                 ))}
            </div>
            <div className="w-1/2 flex-grow flex flex-col justify-center space-y-3">
                {isLoading ? <p>공지사항 로딩 중...</p> : notices.map(notice => (
                    <a key={notice.id} href={notice.link} target="_blank" rel="noopener noreferrer" className="cursor-pointer group border-b border-gray-200 dark:border-gray-700/50 pb-3 last:border-b-0">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className={`flex-shrink-0 whitespace-nowrap px-2 py-0.5 rounded-md text-xs font-bold ${categoryStyles[notice.category] || categoryStyles['공지']}`}>
                                    {notice.category}
                                </span>
                                <p className="font-semibold truncate group-hover:text-purple-400">{notice.title}</p>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 pr-4">{notice.date}</span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};


// 메인 HomePage 컴포넌트
export default function HomePage() {
  return (
    // [수정] 페이지별 상단 여백(pt-28) 제거
    <div className="p-4 pt-4 space-y-6">
        <div className="w-full">
            <WeeklyCalendarCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
                <TodayContentTimersCard />
            </div>
            <div className="lg:col-span-3">
                <NoticeAndEventsCard />
            </div>
        </div>
    </div>
  );
};