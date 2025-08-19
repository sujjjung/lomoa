import React, { useState, useEffect } from 'react';
import { Settings, Trash2, Plus, X, Eye, EyeOff, CheckSquare } from 'lucide-react';

// 서브 컴포넌트들
const AddExpeditionModal = ({ isOpen, onClose, onAdd }) => {
    const [charName, setCharName] = useState('');
    if (!isOpen) return null;
    const handleSubmit = () => {
        if (charName.trim()) {
            onAdd(charName.trim());
            setCharName('');
            onClose();
        }
    };
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">원정대 추가</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={20} /></button></div>
                <div className="space-y-4"><p className="text-sm text-gray-600 dark:text-gray-400">대표 캐릭터명을 입력하세요.</p><div><label className="text-sm font-semibold">대표 캐릭터명</label><input type="text" value={charName} onChange={e => setCharName(e.target.value)} placeholder="캐릭터명" className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" /></div><button onClick={handleSubmit} className="w-full py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700">추가</button></div>
            </div>
        </div>
    );
};

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
    const goldCharacters = (characters || []).filter(c => c.settings.isGoldCharacter && !c.settings.isHidden);

    let totalEarnedGold = 0;
    let totalPossibleGold = 0;

    goldCharacters.forEach(char => {
        (char.weeklyRaids || []).forEach(raid => {
            (raid.gold || []).forEach((gateGold, index) => {
                totalPossibleGold += gateGold;
                if (raid.gates[index]) {
                    totalEarnedGold += gateGold;
                    if (!(raid.more_gold_checked || [])[index]) {
                        totalEarnedGold -= (raid.more_gold_per_gate || [])[index] || 0;
                    }
                }
            });
        });
    });
    
    const percentage = totalPossibleGold > 0 ? (totalEarnedGold / totalPossibleGold) * 100 : 0;

    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-lg h-full">
            <div className="flex justify-between items-center mb-2"><h3 className="font-bold">주간 골드 수익</h3><span className="text-sm font-mono text-yellow-500">{totalEarnedGold.toLocaleString()} / {totalPossibleGold.toLocaleString()} G</span></div>
            <div className="w-full h-2.5 bg-gray-300 dark:bg-gray-700 rounded-full"><div className="h-2.5 bg-yellow-500 rounded-full" style={{ width: `${percentage}%` }}></div></div>
        </div>
    );
};

const CharacterSettingsModal = ({ isOpen, onClose, character, onUpdate, allRaids }) => {
    const [settings, setSettings] = useState(character.settings);
    const [raids, setRaids] = useState(character.weeklyRaids);
    const [selectedRaidId, setSelectedRaidId] = useState('');
    const [selectedDifficultyId, setSelectedDifficultyId] = useState('');

    useEffect(() => {
        if (isOpen) {
            setSettings(character.settings);
            setRaids(character.weeklyRaids);
        }
    }, [character, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onUpdate({ type: 'UPDATE_SETTINGS', payload: { characterId: character.id, settings, raids } });
        onClose();
    };
    
    const handleDelete = () => {
        if (window.confirm(`'${character.name}' 캐릭터를 정말 삭제하시겠습니까?`)) {
            onUpdate({ type: 'DELETE_CHARACTER', payload: { characterId: character.id } });
            onClose();
        }
    };

    const handleAddRaid = () => {
        if (!selectedRaidId || !selectedDifficultyId) return;
        const raidInfo = allRaids.find(r => r.id === selectedRaidId);
        const difficultyInfo = raidInfo.difficulties.find(d => d.id === selectedDifficultyId);
        const newRaid = {
            raidId: raidInfo.id,
            difficultyId: difficultyInfo.id,
            name: raidInfo.name,
            difficultyName: difficultyInfo.name,
            gates: Array(difficultyInfo.gates).fill(false),
            gold: difficultyInfo.gold,
            more_gold_per_gate: difficultyInfo.more_gold_per_gate,
            more_gold_checked: Array(difficultyInfo.gates).fill(true),
        };
        setRaids([...raids, newRaid]);
        setSelectedRaidId('');
        setSelectedDifficultyId('');
    };

    const handleRemoveRaid = (difficultyId) => {
        setRaids(raids.filter(r => r.difficultyId !== difficultyId));
    };

    const availableRaids = allRaids.filter(r => !raids.find(rr => rr.raidId === r.id));

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">{character.name} 콘텐츠 관리</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={20} /></button></div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-200 dark:bg-gray-700/50 rounded-lg"><span className="font-semibold text-sm">골드 획득</span><label className="relative inline-flex items-center cursor-pointer mt-2"><input type="checkbox" checked={settings.isGoldCharacter} onChange={(e) => setSettings({...settings, isGoldCharacter: e.target.checked})} className="sr-only peer" /><div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div></label></div>
                        <div className="p-3 bg-gray-200 dark:bg-gray-700/50 rounded-lg"><span className="font-semibold text-sm">캐릭터 숨기기</span><label className="relative inline-flex items-center cursor-pointer mt-2"><input type="checkbox" checked={settings.isHidden} onChange={(e) => setSettings({...settings, isHidden: e.target.checked})} className="sr-only peer" /><div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div></label></div>
                    </div>
                    {/* 콘텐츠 표시 설정 */}
                    <div className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-700/50 rounded-lg">
                        <span className="font-semibold">주간/일일 숙제 표시</span>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={settings.showWeekly} onChange={(e) => setSettings({...settings, showWeekly: e.target.checked})} className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
                                <span>주간</span>
                            </label>
                             <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={settings.showDaily} onChange={(e) => setSettings({...settings, showDaily: e.target.checked})} className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
                                <span>일일</span>
                            </label>
                        </div>
                    </div>
                    <div className="p-3 bg-gray-200 dark:bg-gray-700/50 rounded-lg"><h3 className="font-semibold mb-2">주간 레이드 관리</h3><div className="space-y-2 mb-3">{raids.map(raid => (<div key={raid.difficultyId} className="flex items-center justify-between text-sm"><span>{raid.name} <span className="text-purple-400 font-semibold">{raid.difficultyName}</span></span><button onClick={() => handleRemoveRaid(raid.difficultyId)} className="text-red-500 hover:text-red-700 text-xs">삭제</button></div>))}</div><div className="grid grid-cols-3 gap-2"><select value={selectedRaidId} onChange={(e) => {setSelectedRaidId(e.target.value); setSelectedDifficultyId('');}} className="col-span-1 p-2 bg-gray-50 dark:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-500 focus:outline-none"><option value="">레이드</option>{availableRaids.map(raid => (<option key={raid.id} value={raid.id}>{raid.name}</option>))}</select><select value={selectedDifficultyId} onChange={(e) => setSelectedDifficultyId(e.target.value)} disabled={!selectedRaidId} className="col-span-1 p-2 bg-gray-50 dark:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-500 focus:outline-none disabled:opacity-50"><option value="">난이도</option>{selectedRaidId && allRaids.find(r => r.id === selectedRaidId).difficulties.map(diff => (<option key={diff.id} value={diff.id}>{diff.name}</option>))}</select><button onClick={handleAddRaid} disabled={!selectedDifficultyId} className="col-span-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 dark:disabled:bg-gray-600">추가</button></div></div>
                </div>
                <div className="mt-6 flex gap-2"><button onClick={handleDelete} className="flex-shrink-0 p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"><Trash2 size={20} /></button><button onClick={handleSave} className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">저장</button></div>
            </div>
        </div>
    );
};


const CharacterHomeworkCard = ({ characterData, onUpdate, allRaids }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const data = characterData;

    const toggleGate = (difficultyId, gateIndex) => {
        const raid = data.weeklyRaids.find(r => r.difficultyId === difficultyId);
        const newGates = [...raid.gates];
        newGates[gateIndex] = !newGates[gateIndex];
        onUpdate({ type: 'UPDATE_RAID_PROGRESS', payload: { characterId: data.id, raidId: difficultyId, gate_progress: newGates, more_gold_checked: raid.more_gold_checked } });
    };

    const toggleMoreGold = (difficultyId, gateIndex) => {
        const raid = data.weeklyRaids.find(r => r.difficultyId === difficultyId);
        const newChecked = [...(raid.more_gold_checked || [])];
        newChecked[gateIndex] = !newChecked[gateIndex];
        onUpdate({ type: 'UPDATE_RAID_PROGRESS', payload: { characterId: data.id, raidId: difficultyId, gate_progress: raid.gates, more_gold_checked: newChecked } });
    };
    
    const setRestGauge = (taskRestKey) => {
        const currentRest = data.daily[taskRestKey];
        const newRestStr = prompt(`휴식 게이지를 입력하세요 (0-10):`, currentRest);
        const newRest = parseInt(newRestStr, 10);
        if (!isNaN(newRest) && newRest >= 0 && newRest <= 10) {
            onUpdate({ type: 'UPDATE_DAILY', payload: { characterId: data.id, daily: { ...data.daily, [taskRestKey]: newRest } } });
        }
    };

    const toggleDailyDone = (taskDoneKey, taskRestKey) => {
        const wasDone = data.daily[taskDoneKey];
        const currentRest = data.daily[taskRestKey];
        const newRest = wasDone ? Math.min(10, currentRest + 2) : Math.max(0, currentRest - 2);
        onUpdate({ type: 'UPDATE_DAILY', payload: { characterId: data.id, daily: { ...data.daily, [taskDoneKey]: !wasDone, [taskRestKey]: newRest } } });
    };

    return (
        <>
            <CharacterSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} character={data} onUpdate={onUpdate} allRaids={allRaids} />
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-3"><img src={data.avatar} alt={data.name} className="w-12 h-12 rounded-full" /><div><p className="font-bold text-lg flex items-center gap-1.5">{data.name}{data.settings.isGoldCharacter && <span className="text-yellow-500 text-xs" title="골드 획득 캐릭터">●</span>}</p><p className="text-sm text-gray-500 dark:text-gray-400">{data.class} Lv.{data.level}</p></div></div><button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Settings size={20} /></button></div>
                <div className="space-y-4">
                    {data.settings.showWeekly && (
                    <div>
                        <h4 className="font-semibold text-sm mb-2 text-gray-500 dark:text-gray-400">주간 레이드</h4>
                        <div className="space-y-2">
                            {(data.weeklyRaids || []).map(raid => {
                                const isRaidComplete = (raid.gates || []).every(g => g);
                                return (
                                    <div key={raid.difficultyId} className={`p-2 rounded-lg ${isRaidComplete ? 'bg-gray-200/50 dark:bg-gray-700/20' : 'bg-gray-200 dark:bg-gray-700/50'}`}>
                                        <div className="flex items-center justify-between"><span className={`font-semibold text-sm ${isRaidComplete ? 'line-through text-gray-500' : ''}`}>{raid.name} <span className="text-purple-400">{raid.difficultyName}</span></span><div className="flex gap-1.5">{(raid.gates || []).map((isCleared, index) => (<button key={index} onClick={() => toggleGate(raid.difficultyId, index)} className={`w-7 h-7 rounded-md text-sm font-bold flex items-center justify-center ${isCleared ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>{index + 1}</button>))}</div></div>
                                        {data.settings.isGoldCharacter && <div className="flex justify-end items-center mt-1 gap-2 text-xs">더보기: {(raid.more_gold_checked || []).map((isChecked, i) => <CheckSquare key={i} onClick={() => toggleMoreGold(raid.difficultyId, i)} className={`cursor-pointer ${isChecked ? 'text-yellow-500' : 'text-gray-400'}`} size={16}/>)}</div>}
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
                            <div onClick={() => toggleDailyDone('kurzanDone', 'kurzanRest')} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${data.daily.kurzanDone ? 'bg-gray-200/50 dark:bg-gray-700/20' : 'bg-gray-200 dark:bg-gray-700/50'}`}><span className={`font-semibold text-sm ${data.daily.kurzanDone ? 'line-through text-gray-500' : ''}`}>쿠르잔 전선</span><div className="flex items-center gap-2"><div className="flex gap-0.5">{Array.from({ length: 10 }).map((_, i) => (<div key={i} className={`w-2 h-5 rounded-sm ${i < data.daily.kurzanRest ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>))}</div><button onClick={(e) => { e.stopPropagation(); setRestGauge('kurzanRest'); }} className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"><Settings size={14} /></button></div></div>
                            <div onClick={() => toggleDailyDone('guardianDone', 'guardianRest')} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${data.daily.guardianDone ? 'bg-gray-200/50 dark:bg-gray-700/20' : 'bg-gray-200 dark:bg-gray-700/50'}`}><span className={`font-semibold text-sm ${data.daily.guardianDone ? 'line-through text-gray-500' : ''}`}>가디언 토벌</span><div className="flex items-center gap-2"><div className="flex gap-0.5">{Array.from({ length: 10 }).map((_, i) => (<div key={i} className={`w-2 h-5 rounded-sm ${i < data.daily.guardianRest ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>))}</div><button onClick={(e) => { e.stopPropagation(); setRestGauge('guardianRest'); }} className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"><Settings size={14} /></button></div></div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </>
    );
};

// 메인 HomeworkPage 컴포넌트
export default function HomeworkPage({ characters, setCharacters }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showHidden, setShowHidden] = useState(false);
    const [allRaids, setAllRaids] = useState([]);

    useEffect(() => {
        const fetchAllRaids = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/raids');
                const data = await response.json();
                if (!response.ok) throw new Error('Failed to fetch raids');
                setAllRaids(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAllRaids();
    }, []);

    const handleUpdate = async (action) => {
        const token = localStorage.getItem('userToken');
        const { type, payload } = action;
        let url = '';
        let body = {};
        let method = 'PUT';

        switch (type) {
            case 'UPDATE_SETTINGS':
                url = `http://localhost:8000/api/characters/${payload.characterId}/settings`;
                body = { settings: payload.settings, raids: payload.raids };
                break;
            case 'DELETE_CHARACTER':
                url = `http://localhost:8000/api/characters/${payload.characterId}`;
                method = 'DELETE';
                break;
            case 'UPDATE_RAID_PROGRESS':
                url = `http://localhost:8000/api/character-raids/${payload.characterId}/${payload.raidId}`;
                body = { gate_progress: payload.gate_progress, more_gold_checked: payload.more_gold_checked };
                break;
            case 'UPDATE_DAILY':
                 url = `http://localhost:8000/api/characters/${payload.characterId}/daily`;
                 body = { daily: payload.daily };
                 break;
            default:
                return;
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: method !== 'DELETE' ? JSON.stringify(body) : undefined,
            });
            if (!response.ok) throw new Error('업데이트 실패');
            
            const res = await fetch('http://localhost:8000/api/characters', { headers: { 'Authorization': `Bearer ${token}` } });
            const updatedChars = await res.json();
            setCharacters(updatedChars);
        } catch (error) {
            alert(error.message);
        }
    };
    
    const visibleCharacters = (characters || []).filter(c => showHidden || !c.settings.isHidden);

    return (
        <div className="p-4 pt-28 space-y-6">
            <AddExpeditionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={() => {}} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LifeEnergyTracker />
                <WeeklyGoldTracker characters={characters} />
            </div>
            <div className="flex justify-end">
                <button onClick={() => setShowHidden(!showHidden)} className="flex items-center gap-2 text-sm font-semibold p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                    {showHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    숨긴 캐릭터 {showHidden ? '끄기' : '보기'}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCharacters.map(char => (
                    <div key={char.id} className={`transition-opacity ${char.settings.isHidden ? 'opacity-50' : ''}`}>
                        <CharacterHomeworkCard 
                            characterData={char} 
                            onUpdate={handleUpdate}
                            allRaids={allRaids}
                        />
                    </div>
                ))}
                <div onClick={() => setIsAddModalOpen(true)} className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 transition-colors min-h-[420px]">
                  <Plus size={48} className="text-gray-400 dark:text-gray-500" />
                </div>
            </div>
        </div>
    );
};