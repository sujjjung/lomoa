import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Settings, Trash2, Plus, X, Eye, EyeOff, Loader, Zap } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// --- 서브 컴포넌트들 ---

// 생명의 기운 트래커
const LifeEnergyTracker = ({ trackers, onUpdate }) => {

    // 10분마다 기운 회복
    useEffect(() => {
        const interval = setInterval(() => {
            const updatedTrackers = trackers.map(tracker => {
                if (tracker.energy >= tracker.max_energy) {
                    return tracker;
                }
                const recoveryAmount = tracker.has_beatrice_blessing ? 33 : 30;
                const newEnergy = Math.min(tracker.max_energy, tracker.energy + recoveryAmount);
                return { ...tracker, energy: newEnergy };
            });
            
            // 변경된 모든 트래커 정보를 한번에 업데이트 (API 호출 최소화)
            // 이 예제에서는 각 트래커를 개별적으로 업데이트합니다.
            updatedTrackers.forEach(tracker => {
                const originalTracker = trackers.find(t => t.id === tracker.id);
                if (originalTracker && originalTracker.energy !== tracker.energy) {
                    onUpdate({ type: 'UPDATE_LIFE_ENERGY', payload: { id: tracker.id, updatedTracker: tracker } });
                }
            });

        }, 600000); // 10분 = 600,000 밀리초

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }, [trackers, onUpdate]);


    const addTracker = () => {
        onUpdate({ type: 'ADD_LIFE_ENERGY' });
    };

    const removeTracker = (id) => {
        onUpdate({ type: 'DELETE_LIFE_ENERGY', payload: { id } });
    };

    const updateTracker = (id, field, value) => {
        const tracker = trackers.find(t => t.id === id);
        const updatedTracker = { ...tracker, [field]: value };
        onUpdate({ type: 'UPDATE_LIFE_ENERGY', payload: { id, updatedTracker } });
    };
    
    // [수정] 설정 버튼 클릭 시 입력한 값으로 변경
    const handleSetEnergy = (id) => {
        const tracker = trackers.find(t => t.id === id);
        if (!tracker) return;

        const amountStr = window.prompt(`'${tracker.character_name}'의 생명의 기운을 입력하세요:`, tracker.energy);
        if (amountStr === null) return;

        const amount = parseInt(amountStr, 10);
        if (!isNaN(amount) && amount >= 0) {
            const newEnergy = Math.min(tracker.max_energy, amount);
            updateTracker(id, 'energy', newEnergy);
        } else {
            alert("유효한 숫자를 입력해주세요.");
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-lg h-full">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">생명의 기운 트래커</h3>
                <button onClick={addTracker} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Plus size={16} /></button>
            </div>
            <div className="space-y-3">
                {trackers.map(tracker => (
                    <div key={tracker.id} className="grid grid-cols-12 gap-3 items-center">
                        <input type="text" value={tracker.character_name} onChange={(e) => updateTracker(tracker.id, 'character_name', e.target.value)} className="col-span-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm" />
                        <div className="col-span-5 flex items-center gap-2">
                             <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full"><div className="h-2 bg-green-500 rounded-full" style={{ width: `${(tracker.energy / tracker.max_energy) * 100}%` }}></div></div>
                            <span className="text-xs w-28 text-right">{tracker.energy.toLocaleString()}/{tracker.max_energy.toLocaleString()}</span>
                        </div>
                        <div className="col-span-3 flex items-center justify-end gap-1">
                            <button onClick={() => updateTracker(tracker.id, 'has_beatrice_blessing', !tracker.has_beatrice_blessing)} className={`p-2 rounded-full ${tracker.has_beatrice_blessing ? 'text-yellow-400 bg-yellow-400/20' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`} title="베아트리스의 축복">
                                <Zap size={14}/>
                            </button>
                            <button onClick={() => handleSetEnergy(tracker.id)} className="p-2 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" title="수동 설정"><Settings size={14}/></button>
                            <button onClick={() => removeTracker(tracker.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full" title="삭제"><Trash2 size={14}/></button>
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
                }
            });
        });
    });
    
    const percentage = totalPossibleGold > 0 ? (totalEarnedGold / totalPossibleGold) * 100 : 0;

    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-lg h-full">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">주간 골드 수익</h3>
                <span className="text-sm font-mono text-yellow-500">{totalEarnedGold.toLocaleString()} / {totalPossibleGold.toLocaleString()} G</span>
            </div>
            <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded-full relative">
                <div className="h-4 bg-yellow-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black dark:text-white mix-blend-screen dark:mix-blend-normal">
                    {percentage.toFixed(1)}%
                </span>
            </div>
        </div>
    );
};

const AddCharacterModal = ({ isOpen, onClose, onAddSuccess }) => {
    const [step, setStep] = useState(1);
    const [charName, setCharName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [roster, setRoster] = useState([]);
    const [selectedChars, setSelectedChars] = useState(new Set());
    const [error, setError] = useState('');

    const resetState = () => {
        setStep(1); setCharName(''); setIsLoading(false); setRoster([]); setSelectedChars(new Set()); setError('');
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleSearchRoster = async () => {
        if (!charName.trim()) return;
        setIsLoading(true); setError('');
        const token = localStorage.getItem('userToken');
        try {
            const response = await fetch('http://localhost:8000/api/characters/find-roster', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ characterName: charName.trim() })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setRoster(data);
            setStep(2);
        } catch (err) {
            setError(err.message || '검색에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleSelection = (char) => {
        const newSelection = new Set(selectedChars);
        if (newSelection.has(char.CharacterName)) {
            newSelection.delete(char.CharacterName);
        } else {
            newSelection.add(char.CharacterName);
        }
        setSelectedChars(newSelection);
    };

    const handleAddCharacters = async () => {
        if (selectedChars.size === 0) return;
        setIsLoading(true); setError('');
        const charactersToAdd = roster.filter(char => selectedChars.has(char.CharacterName));
        const token = localStorage.getItem('userToken');
        try {
            const response = await fetch('http://localhost:8000/api/characters/add-batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ charactersToAdd })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            alert(data.message);
            onAddSuccess();
            handleClose();
        } catch (err) {
            setError(err.message || '추가에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={handleClose}>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">캐릭터 추가</h2>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={20} /></button>
                </div>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                {step === 1 ? (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">원정대를 검색할 대표 캐릭터명을 입력하세요.</p>
                        <input type="text" value={charName} onChange={e => setCharName(e.target.value)} placeholder="대표 캐릭터명" className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        <button onClick={handleSearchRoster} disabled={isLoading} className="w-full py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-purple-400 flex items-center justify-center">
                            {isLoading ? <Loader className="animate-spin" /> : '원정대 검색'}
                        </button>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">추가할 캐릭터를 모두 선택해주세요.</p>
                        <div className="max-h-64 overflow-y-auto space-y-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
                            {roster.map(char => (
                                <label key={char.CharacterName} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-600 rounded-md cursor-pointer">
                                    <input type="checkbox" checked={selectedChars.has(char.CharacterName)} onChange={() => handleToggleSelection(char)} className="w-5 h-5 text-purple-600 rounded" />
                                    <img src={char.CharacterImage || `https://placehold.co/40x40/cccccc/ffffff?text=${char.CharacterName.charAt(0)}`} alt={char.CharacterName} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold">{char.CharacterName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{char.CharacterClassName} / {char.ItemAvgLevel}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setStep(1)} className="w-full py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600">이전</button>
                            <button onClick={handleAddCharacters} disabled={isLoading || selectedChars.size === 0} className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center">
                                {isLoading ? <Loader className="animate-spin" /> : `${selectedChars.size}개 캐릭터 추가`}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// 캐릭터 설정 모달
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

    const assignedRaidNames = new Set(raids.map(raid => raid.name));
    const availableRaids = allRaids.filter(raid => !assignedRaidNames.has(raid.name));

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{character.name} 콘텐츠 관리</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-200 dark:bg-gray-700/50 rounded-lg">
                            <span className="font-semibold text-sm">골드 획득</span>
                            <label className="relative inline-flex items-center cursor-pointer mt-2">
                                <input type="checkbox" checked={settings.isGoldCharacter} onChange={(e) => setSettings({...settings, isGoldCharacter: e.target.checked})} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                        <div className="p-3 bg-gray-200 dark:bg-gray-700/50 rounded-lg">
                            <span className="font-semibold text-sm">캐릭터 숨기기</span>
                            <label className="relative inline-flex items-center cursor-pointer mt-2">
                                <input type="checkbox" checked={settings.isHidden} onChange={(e) => setSettings({...settings, isHidden: e.target.checked})} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                    </div>
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
                                {selectedRaidId && allRaids.find(r => r.id === selectedRaidId)?.difficulties.map(diff => (<option key={diff.id} value={diff.id}>{diff.name}</option>))}
                            </select>
                            <button onClick={handleAddRaid} disabled={!selectedDifficultyId} className="col-span-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 dark:disabled:bg-gray-600">추가</button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex gap-2">
                    <button onClick={handleDelete} className="flex-shrink-0 p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"><Trash2 size={20} /></button>
                    <button onClick={handleSave} className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">저장</button>
                </div>
            </div>
        </div>
    );
};

// 캐릭터 숙제 카드
const CharacterHomeworkCard = ({ characterData, onUpdate, onSettingsClick }) => {
    const consumedRest = useRef({ kurzan: 0, guardian: 0 });
    
    const toggleGate = (difficultyId, gateIndex) => {
        const raid = characterData.weeklyRaids.find(r => r.difficultyId === difficultyId);
        const newGates = [...raid.gates];

        if (newGates[gateIndex]) {
            for (let i = gateIndex + 1; i < newGates.length; i++) {
                if (newGates[i]) return;
            }
            newGates[gateIndex] = false;
        } else {
            for (let i = 0; i < gateIndex; i++) {
                if (!newGates[i]) return;
            }
            newGates[gateIndex] = true;
        }
        onUpdate({ type: 'UPDATE_RAID_PROGRESS', payload: { characterId: characterData.id, raidId: difficultyId, gate_progress: newGates } });
    };
    
    const toggleRaidCompletion = (difficultyId) => {
        const raid = characterData.weeklyRaids.find(r => r.difficultyId === difficultyId);
        const isAllCompleted = raid.gates.every(g => g);
        const newGates = Array(raid.gates.length).fill(!isAllCompleted);
        onUpdate({ type: 'UPDATE_RAID_PROGRESS', payload: { characterId: characterData.id, raidId: difficultyId, gate_progress: newGates } });
    };

    const toggleDailyDone = (task) => {
        const doneKey = `${task}Done`;
        const restKey = `${task}Rest`;

        const isDone = characterData.daily[doneKey];
        const currentRest = characterData.daily[restKey];
        
        let newRest = currentRest;
        const newDone = !isDone;

        if (newDone === true) { // Task를 '완료'로 체크하는 경우
            if (currentRest >= 20) {
                newRest = currentRest - 20;
                // 소모된 휴식 게이지 양(20)을 Ref에 기록
                consumedRest.current[task] = 20;
            } else {
                // 보너스를 받지 않았으므로 소모된 게이지는 0
                consumedRest.current[task] = 0;
            }
        } else { // Task를 '미완료'로 체크 해제하는 경우 (실행 취소)
            // Ref에 기록된, 이전에 소모했던 휴식 게이지 양만큼만 되돌려줌
            newRest = Math.min(100, currentRest + consumedRest.current[task]);
            // 기록 초기화
            consumedRest.current[task] = 0;
        }

        const newDailyState = {
            ...characterData.daily,
            [doneKey]: newDone,
            [restKey]: newRest
        };
        onUpdate({ type: 'UPDATE_DAILY', payload: { characterId: characterData.id, daily: newDailyState } });
    };

    const handleSetRestGauge = (task) => {
        const restKey = `${task}Rest`;
        const currentRest = characterData.daily[restKey];
        const taskName = task === 'kurzan' ? '쿠르잔 전선' : '가디언 토벌';

        const amountStr = window.prompt(`'${taskName}'의 휴식 게이지를 입력하세요 (0 ~ 100, 10 단위):`, currentRest);
        if (amountStr === null) return;

        const amount = parseInt(amountStr, 10);
        if (!isNaN(amount) && amount >= 0 && amount <= 100 && amount % 10 === 0) {
            const newDailyState = {
                ...characterData.daily,
                [restKey]: amount
            };
            onUpdate({ type: 'UPDATE_DAILY', payload: { characterId: characterData.id, daily: newDailyState } });
        } else {
            alert("0에서 100 사이의 10 단위 숫자만 입력해주세요.");
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <img src={characterData.avatar || `https://placehold.co/48x48/cccccc/ffffff?text=${characterData.name.charAt(0)}`} alt={characterData.name} className="w-12 h-12 rounded-full" />
                    <div>
                        <p className="font-bold text-lg flex items-center gap-1.5">
                            {characterData.name}
                            {characterData.settings.isGoldCharacter && <span className="text-yellow-500 text-xs" title="골드 획득 캐릭터">●</span>}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{characterData.class} Lv.{characterData.level}</p>
                    </div>
                </div>
                <button onClick={() => onSettingsClick(characterData)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Settings size={20} /></button>
            </div>
            <div className="space-y-4">
                {characterData.settings.showWeekly && (
                    <div>
                    <h4 className="font-semibold text-sm mb-2 text-gray-500 dark:text-gray-400">주간 레이드</h4>
                    <div className="space-y-2">
                        {(characterData.weeklyRaids || []).map(raid => {
                            const isRaidComplete = raid.gates.every(g => g);
                            const totalRaidGold = (raid.gold || []).reduce((a, b) => a + b, 0);
                            return (
                                <div key={raid.difficultyId} className={`p-2 rounded-lg ${isRaidComplete ? 'bg-gray-200/50 dark:bg-gray-700/20' : 'bg-gray-200 dark:bg-gray-700/50'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span onClick={() => toggleRaidCompletion(raid.difficultyId)} className={`font-semibold text-sm cursor-pointer ${isRaidComplete ? 'line-through text-gray-500' : ''}`}>{raid.name} <span className="text-purple-400">{raid.difficultyName}</span></span>
                                            <span className="text-xs font-mono text-yellow-500">{totalRaidGold.toLocaleString()} G</span>
                                        </div>
                                        <div className="flex gap-1.5">{raid.gates.map((isCleared, index) => (<button key={index} onClick={() => toggleGate(raid.difficultyId, index)} className={`w-7 h-7 rounded-md text-sm font-bold flex items-center justify-center ${isCleared ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>{index + 1}</button>))}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                )}
                {characterData.settings.showDaily && (
                <div>
                    <h4 className="font-semibold text-sm mb-2 text-gray-500 dark:text-gray-400">일일 숙제</h4>
                    <div className="space-y-2">
                        <div onClick={() => toggleDailyDone('kurzan')} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${characterData.daily.kurzanDone ? 'bg-gray-200/50 dark:bg-gray-700/20' : 'bg-gray-200 dark:bg-gray-700/50'}`}>
                            <span className={`font-semibold text-sm ${characterData.daily.kurzanDone ? 'line-through text-gray-500' : ''}`}>쿠르잔 전선</span>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5" title={`휴식 게이지: ${characterData.daily.kurzanRest}`}>
                                    {Array.from({ length: 10 }).map((_, i) => (<div key={i} className={`w-2 h-5 rounded-sm ${i*10 < characterData.daily.kurzanRest ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>))}
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); handleSetRestGauge('kurzan'); }} className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
                                    <Settings size={14} />
                                </button>
                            </div>
                        </div>
                        <div onClick={() => toggleDailyDone('guardian')} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${characterData.daily.guardianDone ? 'bg-gray-200/50 dark:bg-gray-700/20' : 'bg-gray-200 dark:bg-gray-700/50'}`}>
                            <span className={`font-semibold text-sm ${characterData.daily.guardianDone ? 'line-through text-gray-500' : ''}`}>가디언 토벌</span>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5" title={`휴식 게이지: ${characterData.daily.guardianRest}`}>
                                    {Array.from({ length: 10 }).map((_, i) => (<div key={i} className={`w-2 h-5 rounded-sm ${i*10 < characterData.daily.guardianRest ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>))}
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); handleSetRestGauge('guardian'); }} className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
                                    <Settings size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

// --- 메인 HomeworkPage 컴포넌트 ---
export default function HomeworkPage({ characters, setCharacters, fetchCharacters }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showHidden, setShowHidden] = useState(false);
    const [allRaids, setAllRaids] = useState([]);
    const [editingCharacter, setEditingCharacter] = useState(null);
    const [lifeEnergyTrackers, setLifeEnergyTrackers] = useState([]);

    const fetchLifeEnergy = useCallback(async () => {
        const token = localStorage.getItem('userToken');
        if (!token) return;
        try {
            const response = await fetch('http://localhost:8000/api/life-energy', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('생명의 기운 정보 로딩 실패');
            const data = await response.json();
            setLifeEnergyTrackers(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        const fetchAllRaids = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/raids');
                if (!response.ok) throw new Error('Failed to fetch raids');
                const data = await response.json();
                setAllRaids(data);
            } catch (error) { console.error(error); }
        };
        fetchAllRaids();
        fetchLifeEnergy();
    }, [fetchLifeEnergy]);

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
                body = { gate_progress: payload.gate_progress };
                break;
            case 'UPDATE_DAILY':
                url = `http://localhost:8000/api/characters/${payload.characterId}/daily`;
                body = { daily: payload.daily };
                break;
            case 'ADD_LIFE_ENERGY':
                url = `http://localhost:8000/api/life-energy`;
                method = 'POST';
                body = {};
                break;
            case 'UPDATE_LIFE_ENERGY':
                url = `http://localhost:8000/api/life-energy/${payload.id}`;
                body = payload.updatedTracker;
                break;
            case 'DELETE_LIFE_ENERGY':
                url = `http://localhost:8000/api/life-energy/${payload.id}`;
                method = 'DELETE';
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
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: '알 수 없는 오류' }));
                console.error('업데이트 실패:', errorData.message);
            }
            if (type.includes('LIFE_ENERGY')) {
                fetchLifeEnergy();
            } else {
                fetchCharacters();
            }
        } catch (error) {
            console.error(error.message);
            if (type.includes('LIFE_ENERGY')) {
                fetchLifeEnergy();
            } else {
                fetchCharacters();
            }
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        const items = Array.from(characters);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setCharacters(items);
        const orderedIds = items.map(item => item.id);
        const token = localStorage.getItem('userToken');
        try {
            await fetch('http://localhost:8000/api/characters/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ orderedIds }),
            });
        } catch (error) {
            console.error("순서 저장 실패:", error);
            fetchCharacters();
        }
    };

    const visibleCharacters = (characters || []).filter(c => showHidden || !c.settings.isHidden);

    return (
        <div className="p-4 pt-28 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LifeEnergyTracker trackers={lifeEnergyTrackers} onUpdate={handleUpdate} />
                <WeeklyGoldTracker characters={characters} />
            </div>

            <AddCharacterModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAddSuccess={() => {
                    fetchCharacters();
                    fetchLifeEnergy();
                }}
            />
            
            {editingCharacter && (
                <CharacterSettingsModal
                    isOpen={!!editingCharacter}
                    onClose={() => setEditingCharacter(null)}
                    character={editingCharacter}
                    onUpdate={handleUpdate}
                    allRaids={allRaids}
                />
            )}

            <div className="flex justify-end">
                <button onClick={() => setShowHidden(!showHidden)} className="flex items-center gap-2 text-sm font-semibold p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                    {showHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    숨긴 캐릭터 {showHidden ? '끄기' : '보기'}
                </button>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="characters">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {visibleCharacters.map((char, index) => (
                                <Draggable key={char.id} draggableId={String(char.id)} index={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={char.settings.isHidden ? 'opacity-50' : ''}>
                                            <CharacterHomeworkCard 
                                                characterData={char} 
                                                onUpdate={handleUpdate}
                                                onSettingsClick={setEditingCharacter}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            <div onClick={() => setIsAddModalOpen(true)} className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 transition-colors min-h-[420px]">
                              <Plus size={48} className="text-gray-400 dark:text-gray-500" />
                            </div>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};