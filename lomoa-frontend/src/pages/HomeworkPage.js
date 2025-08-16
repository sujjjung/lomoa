import React, { useState } from 'react';
import { Settings, Trash2, Plus, X, ChevronsDown } from 'lucide-react';

// Mock Data
const ALL_RAIDS = [
  { 
    id: 'kazaros', 
    name: '카제로스',
    difficulties: [
        { id: 'kazaros_normal', name: '노말', gates: 2, gold: [6000, 12000] },
        { id: 'kazaros_hard', name: '하드', gates: 2, gold: [7000, 13000] },
    ]
  },
  { 
    id: 'abrelshud', 
    name: '아브렐슈드',
    difficulties: [
        { id: 'abrelshud_normal', name: '노말', gates: 3, gold: [4000, 5000, 6000] },
        { id: 'abrelshud_hard', name: '하드', gates: 3, gold: [5000, 6000, 7000] },
    ]
  },
  { 
    id: 'illiakan', 
    name: '일리아칸',
    difficulties: [
        { id: 'illiakan_normal', name: '노말', gates: 3, gold: [3000, 4000, 5000] },
        { id: 'illiakan_hard', name: '하드', gates: 3, gold: [3500, 4500, 5500] },
    ]
  },
];

const MOCK_CHARACTERS = [
  {
    id: 1,
    name: '이뚜덩',
    class: '도화가',
    level: 1720,
    avatar: 'https://placehold.co/48x48/a78bfa/ffffff?text=뚜',
    weeklyRaids: [
      { raidId: 'kazaros', difficultyId: 'kazaros_hard', name: '카제로스', difficultyName: '하드', gates: [false, false], gold: [7000, 13000] },
      { raidId: 'abrelshud', difficultyId: 'abrelshud_normal', name: '아브렐슈드', difficultyName: '노말', gates: [false, false, false], gold: [4000, 5000, 6000] },
    ],
    daily: { kurzanRest: 2, guardianRest: 5, kurzanDone: false, guardianDone: false },
    memo: '이번 주 카제로스 1관문은 골드 획득',
    settings: { showWeekly: true, showDaily: true, isGoldCharacter: true }
  },
];



// HomeworkPage의 서브 컴포넌트들
const LifeEnergyTracker = () => {
    const [trackers, setTrackers] = useState([
        { id: 1, charName: '이뚜덩', energy: 8540, maxEnergy: 12000 },
        { id: 2, charName: '이송정', energy: 3200, maxEnergy: 10000 },
    ]);

    const addTracker = () => {
        const newTracker = { id: Date.now(), charName: '캐릭터명 입력', energy: 0, maxEnergy: 10000 };
        setTrackers([...trackers, newTracker]);
    };

    const removeTracker = (id) => {
        setTrackers(trackers.filter(t => t.id !== id));
    };

    const updateTracker = (id, field, value) => {
        setTrackers(trackers.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const handleConsume = (id) => {
        const tracker = trackers.find(t => t.id === id);
        const amountStr = prompt(`${tracker.charName}에서 소모할 생명의 기운을 입력하세요:`, "1000");
        const amount = parseInt(amountStr, 10);
        if (!isNaN(amount) && amount > 0) {
            updateTracker(id, 'energy', Math.max(0, tracker.energy - amount));
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-lg h-full">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">생명의 기운 트래커</h3>
                <button onClick={addTracker} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Plus size={16} />
                </button>
            </div>
            <div className="space-y-3">
                {trackers.map(tracker => (
                    <div key={tracker.id} className="grid grid-cols-12 gap-3 items-center">
                        <input type="text" value={tracker.charName} onChange={(e) => updateTracker(tracker.id, 'charName', e.target.value)} className="col-span-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <div className="col-span-6 flex items-center gap-2">
                             <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full">
                                <div className="h-2 bg-green-500 rounded-full" style={{ width: `${(tracker.energy / tracker.maxEnergy) * 100}%` }}></div>
                            </div>
                            <span className="text-xs w-28 text-right">{tracker.energy.toLocaleString()}/{tracker.maxEnergy.toLocaleString()}</span>
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-2">
                            <button onClick={() => handleConsume(tracker.id)} className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg">소모</button>
                            <button onClick={() => removeTracker(tracker.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WeeklyGoldTracker = ({ characters }) => {
    const goldCharacters = characters.filter(c => c.settings.isGoldCharacter);

    const totalPossibleGold = goldCharacters.reduce((total, char) => {
        return total + char.weeklyRaids.reduce((raidTotal, raid) => {
            return raidTotal + raid.gold.reduce((gateTotal, g) => gateTotal + g, 0);
        }, 0);
    }, 0);

    const totalEarnedGold = goldCharacters.reduce((total, char) => {
        return total + char.weeklyRaids.reduce((raidTotal, raid) => {
            return raidTotal + raid.gold.reduce((gateTotal, g, index) => {
                return raid.gates[index] ? gateTotal + g : gateTotal;
            }, 0);
        }, 0);
    }, 0);
    
    const percentage = totalPossibleGold > 0 ? (totalEarnedGold / totalPossibleGold) * 100 : 0;

    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-lg h-full">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">주간 골드 수익</h3>
                <span className="text-sm font-mono text-yellow-500">{totalEarnedGold.toLocaleString()} / {totalPossibleGold.toLocaleString()} G</span>
            </div>
            <div className="w-full h-2.5 bg-gray-300 dark:bg-gray-700 rounded-full">
                <div className="h-2.5 bg-yellow-500 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const CharacterSettingsModal = ({ isOpen, onClose, character, onSave }) => {
    const [settings, setSettings] = useState(character.settings);
    const [raids, setRaids] = useState(character.weeklyRaids);
    const [selectedRaidId, setSelectedRaidId] = useState('');
    const [selectedDifficultyId, setSelectedDifficultyId] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ ...character, settings, weeklyRaids: raids });
        onClose();
    };
    
    const handleAddRaid = () => {
        if (!selectedRaidId || !selectedDifficultyId) return;

        const raidInfo = ALL_RAIDS.find(r => r.id === selectedRaidId);
        const difficultyInfo = raidInfo.difficulties.find(d => d.id === selectedDifficultyId);

        const newRaid = {
            raidId: raidInfo.id,
            difficultyId: difficultyInfo.id,
            name: raidInfo.name,
            difficultyName: difficultyInfo.name,
            gates: Array(difficultyInfo.gates).fill(false),
            gold: difficultyInfo.gold,
        };
        setRaids([...raids, newRaid]);
        setSelectedRaidId('');
        setSelectedDifficultyId('');
    };

    const handleRemoveRaid = (difficultyId) => {
        setRaids(raids.filter(r => r.difficultyId !== difficultyId));
    };

    const availableRaids = ALL_RAIDS.filter(r => !raids.find(rr => rr.raidId === r.id));

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{character.name} 콘텐츠 관리</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={20} /></button>
                </div>
                
                <div className="space-y-4">
                    {/* ... 골드 획득, 콘텐츠 표시 설정 UI (기존과 동일) ... */}
                    
                    {/* 주간 레이드 관리 */}
                    <div className="p-3 bg-gray-200 dark:bg-gray-700/50 rounded-lg">
                        <h3 className="font-semibold mb-2">주간 레이드 관리</h3>
                        <div className="space-y-2 mb-3">
                            {raids.map(raid => (
                                <div key={raid.difficultyId} className="flex items-center justify-between text-sm">
                                    <span>{raid.name} <span className="text-purple-400 font-semibold">{raid.difficultyName}</span></span>
                                    <button onClick={() => handleRemoveRaid(raid.difficultyId)} className="text-red-500 hover:text-red-700 text-xs">삭제</button>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <select value={selectedRaidId} onChange={(e) => {setSelectedRaidId(e.target.value); setSelectedDifficultyId('');}} className="col-span-1 p-2 bg-gray-50 dark:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-500 focus:outline-none">
                                <option value="">레이드</option>
                                {availableRaids.map(raid => (<option key={raid.id} value={raid.id}>{raid.name}</option>))}
                            </select>
                            <select value={selectedDifficultyId} onChange={(e) => setSelectedDifficultyId(e.target.value)} disabled={!selectedRaidId} className="col-span-1 p-2 bg-gray-50 dark:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-500 focus:outline-none disabled:opacity-50">
                                <option value="">난이도</option>
                                {selectedRaidId && ALL_RAIDS.find(r => r.id === selectedRaidId).difficulties.map(diff => (<option key={diff.id} value={diff.id}>{diff.name}</option>))}
                            </select>
                            <button onClick={handleAddRaid} disabled={!selectedDifficultyId} className="col-span-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 dark:disabled:bg-gray-600">추가</button>
                        </div>
                    </div>
                </div>

                <button onClick={handleSave} className="mt-6 w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">저장</button>
            </div>
        </div>
    );
};


const CharacterHomeworkCard = ({ characterData, onUpdate }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const data = characterData;

    const toggleAllGates = (e, difficultyId) => {
        e.preventDefault();
        const raid = data.weeklyRaids.find(r => r.difficultyId === difficultyId);
        const areAllGatesCleared = raid.gates.every(g => g);
        const newRaids = data.weeklyRaids.map(r => r.difficultyId === difficultyId ? { ...r, gates: r.gates.map(() => !areAllGatesCleared) } : r);
        onUpdate({ ...data, weeklyRaids: newRaids });
    };

    const toggleGate = (difficultyId, gateIndex) => {
        const newData = JSON.parse(JSON.stringify(data));
        const raid = newData.weeklyRaids.find(r => r.difficultyId === difficultyId);
        const currentGateState = raid.gates[gateIndex];
        if (!currentGateState) { for (let i = 0; i < gateIndex; i++) { if (!raid.gates[i]) return; } } 
        else { for (let i = gateIndex + 1; i < raid.gates.length; i++) { if (raid.gates[i]) return; } }
        raid.gates[gateIndex] = !currentGateState;
        onUpdate(newData);
    };
    
    const calculateRemainingGold = (raid) => raid.gold.reduce((total, gold, index) => raid.gates[index] ? total : total + gold, 0);

    const setRestGauge = (taskRestKey) => {
        const currentRest = data.daily[taskRestKey];
        const newRestStr = prompt(`휴식 게이지를 입력하세요 (0-10):`, currentRest);
        const newRest = parseInt(newRestStr, 10);
        if (!isNaN(newRest) && newRest >= 0 && newRest <= 10) {
            onUpdate({ ...data, daily: { ...data.daily, [taskRestKey]: newRest } });
        }
    };

    const toggleDailyDone = (taskDoneKey, taskRestKey) => {
        const wasDone = data.daily[taskDoneKey];
        const currentRest = data.daily[taskRestKey];
        const newRest = wasDone ? Math.min(10, currentRest + 2) : Math.max(0, currentRest - 2);
        onUpdate({ ...data, daily: { ...data.daily, [taskDoneKey]: !wasDone, [taskRestKey]: newRest } });
    };

    return (
        <>
            <CharacterSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} character={data} onSave={onUpdate} />
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <img src={data.avatar} alt={data.name} className="w-12 h-12 rounded-full" />
                        <div>
                            <p className="font-bold text-lg flex items-center gap-1.5">
                                {data.name}
                                {data.settings.isGoldCharacter && <span className="text-yellow-500 text-xs" title="골드 획득 캐릭터">●</span>}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{data.class} Lv.{data.level}</p>
                        </div>
                    </div>
                    <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Settings size={20} /></button>
                </div>
                <div className="space-y-4">
                    {data.settings.showWeekly && (
                    <div>
                        <h4 className="font-semibold text-sm mb-2 text-gray-500 dark:text-gray-400">주간 레이드</h4>
                        <div className="space-y-2">
                            {data.weeklyRaids.map(raid => {
                                const isRaidComplete = raid.gates.every(g => g);
                                const remainingGold = calculateRemainingGold(raid);
                                return (
                                    <div key={raid.difficultyId} onContextMenu={(e) => toggleAllGates(e, raid.difficultyId)} className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${isRaidComplete ? 'bg-gray-200/50 dark:bg-gray-700/20' : 'bg-gray-200 dark:bg-gray-700/50'}`}>
                                        <div className="flex flex-col">
                                            <span className={`font-semibold text-sm ${isRaidComplete ? 'line-through text-gray-500 dark:text-gray-500' : ''}`} title="우클릭 시 전체 클리어/해제">
                                                {raid.name} <span className="text-purple-400">{raid.difficultyName}</span>
                                            </span>
                                            {data.settings.isGoldCharacter && <span className={`text-xs font-mono ${isRaidComplete ? 'text-gray-500' : 'text-yellow-500'}`}>{remainingGold.toLocaleString()} G</span>}
                                        </div>
                                        <div className="flex gap-1.5">{raid.gates.map((isCleared, index) => (<button key={index} onClick={(e) => {e.stopPropagation(); toggleGate(raid.difficultyId, index)}} className={`w-7 h-7 rounded-md text-sm font-bold flex items-center justify-center ${isCleared ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>{index + 1}</button>))}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    )}
                    {data.settings.showDaily && (
                     <div>
                        <h4 className="font-semibold text-sm mb-2 text-gray-500 dark:text-gray-400">일일 숙제</h4>
                        <div className="space-y-2">
                            <div onClick={() => toggleDailyDone('kurzanDone', 'kurzanRest')} onContextMenu={(e) => {e.preventDefault(); toggleDailyDone('kurzanDone', 'kurzanRest')}} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${data.daily.kurzanDone ? 'bg-gray-200/50 dark:bg-gray-700/20' : 'bg-gray-200 dark:bg-gray-700/50'}`}>
                                <span className={`font-semibold text-sm ${data.daily.kurzanDone ? 'line-through text-gray-500 dark:text-gray-500' : ''}`}>쿠르잔 전선</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">{Array.from({ length: 10 }).map((_, i) => (<div key={i} className={`w-2 h-5 rounded-sm ${i < data.daily.kurzanRest ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>))}</div>
                                    <button onClick={(e) => { e.stopPropagation(); setRestGauge('kurzanRest'); }} className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"><Settings size={14} /></button>
                                </div>
                            </div>
                            <div onClick={() => toggleDailyDone('guardianDone', 'guardianRest')} onContextMenu={(e) => {e.preventDefault(); toggleDailyDone('guardianDone', 'guardianRest')}} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${data.daily.guardianDone ? 'bg-gray-200/50 dark:bg-gray-700/20' : 'bg-gray-200 dark:bg-gray-700/50'}`}>
                                <span className={`font-semibold text-sm ${data.daily.guardianDone ? 'line-through text-gray-500 dark:text-gray-500' : ''}`}>가디언 토벌</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">{Array.from({ length: 10 }).map((_, i) => (<div key={i} className={`w-2 h-5 rounded-sm ${i < data.daily.guardianRest ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>))}</div>
                                    <button onClick={(e) => { e.stopPropagation(); setRestGauge('guardianRest'); }} className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"><Settings size={14} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </>
    );
};

// 메인 HomeworkPage 컴포넌트
export default function HomeworkPage() {
    const [characters, setCharacters] = useState(MOCK_CHARACTERS);

    const handleUpdateCharacter = (updatedCharacter) => {
        setCharacters(characters.map(c => c.id === updatedCharacter.id ? updatedCharacter : c));
    };

    return (
        <div className="p-4 pt-28 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LifeEnergyTracker />
                <WeeklyGoldTracker characters={characters} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map(char => (
                    <CharacterHomeworkCard key={char.id} characterData={char} onUpdate={handleUpdateCharacter} />
                ))}
            </div>
        </div>
    );
};