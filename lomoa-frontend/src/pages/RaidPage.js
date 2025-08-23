import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Plus, X} from 'lucide-react';

// Mock Data
const MOCK_JOINED_RAIDS = [
    { id: 1, name: 'LOMOA 공격대', image: 'https://placehold.co/64x64/a78bfa/ffffff?text=L' },
    { id: 2, name: '깐부 공격대', image: 'https://placehold.co/64x64/7c3aed/ffffff?text=깐' },
    { id: 3, name: '주말 트라이팟', image: 'https://placehold.co/64x64/f87171/ffffff?text=트' },
];

const MOCK_RAID_DETAILS = {
    1: {
        name: 'LOMOA 공격대',
        schedule: {
            '2025-08-20': [{ time: '21:00', title: '카제로스', type: '정기', partyType: '고정', members: ['이뚜덩', '이송정', '이댕두'] }]
        },
        members: [
            {
                id: 1, name: '이뚜덩', class: '도화가', level: 1720, avatar: 'https://placehold.co/48x48/a78bfa/ffffff?text=뚜',
                weeklyRaids: [
                    { name: '카제로스', difficultyName: '하드', gates: [false, false], gold: 7000 },
                    { name: '아브렐슈드', difficultyName: '노말', gates: [false, false, false], gold: 4000 },
                ]
            },
            {
                id: 2, name: '이송정', class: '기상술사', level: 1710, avatar: 'https://placehold.co/48x48/7c3aed/ffffff?text=송',
                weeklyRaids: [
                    { name: '카제로스', difficultyName: '노말', gates: [true, false], gold: 6000 },
                ]
            },
        ]
    }
};

const MOCK_PUBLIC_RAIDS = [
    { id: 101, name: '카제로스 하드 트라이', leader: '로아고수', memberCount: 7, requiredLevel: 1700, description: '마지막 관문 트라이 하실 분들 모집합니다!', image: 'https://placehold.co/300x150/ef4444/ffffff?text=카제로스' },
];

const ALL_AVAILABLE_RAIDS = ['카제로스', '아브렐슈드', '일리아칸', '카양겔', '볼디스'];

// Sub-components for RaidPage

const AddScheduleModal = ({ isOpen, onClose, raidData }) => {
    const [scheduleType, setScheduleType] = useState('정기');
    const [partyType, setPartyType] = useState('고정');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">일정 추가</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={20} /></button>
                </div>
                <div className="grid grid-cols-2 gap-6 text-sm">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            {['정기', '비정기'].map(type => <button key={type} onClick={() => setScheduleType(type)} className={`w-full py-2 rounded-lg ${scheduleType === type ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{type}</button>)}
                        </div>
                        {scheduleType === '정기' ? (
                            <select className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded-lg"><option>매주 수요일</option></select>
                        ) : (
                            <input type="date" className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        )}
                        <input type="time" defaultValue="20:00" className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        <div>
                            <h3 className="font-semibold mb-2">레이드 선택 (다중 선택 가능)</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {ALL_AVAILABLE_RAIDS.map(raid => <button key={raid} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-700/50">{raid}</button>)}
                            </div>
                        </div>
                         <div>
                            <h3 className="font-semibold mb-2">숙련도</h3>
                            <div className="flex gap-2">
                                {['숙련', '트라이', '세미 트라이'].map(level => <button key={level} className="flex-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-700/50">{level}</button>)}
                            </div>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            {['고정', '임시'].map(type => <button key={type} onClick={() => setPartyType(type)} className={`w-full py-2 rounded-lg ${partyType === type ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{type} 파티</button>)}
                        </div>
                        <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg h-64 overflow-y-auto">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold">참여 인원 선택</h3>
                                {partyType === '고정' && <button className="text-xs p-1 bg-purple-600 text-white rounded"><Plus size={12}/></button>}
                            </div>
                            <div className="space-y-2">
                                {raidData.members.map(member => (
                                    <label key={member.id} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
                                        <span>{member.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <button className="w-full mt-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">일정 등록</button>
            </div>
        </div>
    );
};

const RaidSidebar = ({ joinedRaids, onSelect, selectedRaidId }) => (
    <div className="w-20 bg-gray-100 dark:bg-gray-900 h-full flex flex-col items-center py-4 space-y-3 flex-shrink-0">
        <button onClick={() => onSelect(null)} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${!selectedRaidId ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700 hover:bg-purple-400'}`}>
            <Search className={!selectedRaidId ? 'text-white' : ''} />
        </button>
        <div className="w-8 h-px bg-gray-300 dark:bg-gray-700"></div>
        {joinedRaids.map(raid => (
            <div key={raid.id} className="relative">
                <img 
                    src={raid.image} 
                    alt={raid.name} 
                    onClick={() => onSelect(raid.id)}
                    className={`w-14 h-14 rounded-2xl cursor-pointer transition-all ${selectedRaidId === raid.id ? 'ring-4 ring-white' : 'hover:rounded-xl'}`}
                />
            </div>
        ))}
    </div>
);

const RaidDiscoveryView = () => {
    return (
        <div className="flex-grow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">공격대 찾기</h2>
                <div className="relative w-1/2">
                    <input type="text" placeholder="공격대 이름으로 검색..." className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg py-2 pl-4 pr-10 focus:outline-none" />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
            </div>
            <div className="space-y-4">
                {MOCK_PUBLIC_RAIDS.map(raid => (
                    <div key={raid.id} className="bg-gray-200 dark:bg-gray-700/50 rounded-lg flex overflow-hidden">
                        <img src={raid.image} alt={raid.name} className="w-48 h-full object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold text-lg">{raid.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{raid.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs">
                                <span>리더: {raid.leader}</span>
                                <span>인원: {raid.memberCount}/8</span>
                                <span>레벨: {raid.requiredLevel}+</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const RaidDetailView = ({ raid }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const changeWeek = (offset) => setCurrentDate(d => {
        const newDate = new Date(d);
        newDate.setDate(newDate.getDate() + offset * 7);
        return newDate;
    });
    
    const weekDays = Array(7).fill(0).map((_, i) => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - d.getDay() + i);
        return d;
    });

    return (
        <>
            <AddScheduleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} raidData={raid} />
            <div className="flex-grow p-6 space-y-6">
                {/* Weekly Schedule */}
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-2xl">주간 일정</h2>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => changeWeek(-1)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronLeft size={20} /></button>
                            <span className="font-semibold text-sm">{`${currentDate.getFullYear()}.${currentDate.getMonth() + 1}`}</span>
                            <button onClick={() => changeWeek(1)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronRight size={20} /></button>
                            <button onClick={() => setIsModalOpen(true)} className="p-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Plus size={20} /></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                        {weekDays.map(date => <div key={date} className="font-semibold">{date.getDate()}</div>)}
                    </div>
                </div>

                {/* Member Homework Status */}
                <div>
                    <h3 className="font-bold text-xl mb-4 px-2">공격대원 숙제 현황</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {raid.members.map(member => (
                            <div key={member.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full" />
                                        <div>
                                            <p className="font-bold text-lg">{member.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{member.class} Lv.{member.level}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {member.weeklyRaids.map(raid => (
                                        <div key={raid.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-200 dark:bg-gray-700/50">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm">{raid.name} <span className="text-purple-400">{raid.difficultyName}</span></span>
                                                <span className="text-xs font-mono text-yellow-500">{raid.gold.toLocaleString()} G</span>
                                            </div>
                                            <div className="flex gap-1.5">
                                                {raid.gates.map((isCleared, index) => (
                                                    <button key={index} className={`w-7 h-7 rounded-md text-sm font-bold flex items-center justify-center ${isCleared ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                                        {index + 1}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};


export default function RaidPage() {
    const [selectedRaidId, setSelectedRaidId] = useState(1);

    return (
        <div className="flex h-screen">
            <RaidSidebar joinedRaids={MOCK_JOINED_RAIDS} onSelect={setSelectedRaidId} selectedRaidId={selectedRaidId} />
            <div className="flex-grow h-full overflow-y-auto">
                {selectedRaidId ? <RaidDetailView raid={MOCK_RAID_DETAILS[selectedRaidId]} /> : <RaidDiscoveryView />}
            </div>
        </div>
    );
}