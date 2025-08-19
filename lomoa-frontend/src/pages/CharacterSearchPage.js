import React, { useState } from 'react';
import { BarChart2, User, Check } from 'lucide-react';

// Mock Data based on user-provided images
const MOCK_CHARACTER_DATA = {
  name: '이뚜덩',
  level: 1720,
  attack: 2005,
  expeditionLvl: 270,
  title: '아브렐슈드',
  server: '카단',
  guild: '우애',
  pvp: '18급',
  영지: 'Lv.70 이뚜뚜',
  characterImage: 'https://placehold.co/300x500/1f2937/ffffff?text=Character',
  stats: {
      치명: 487, 특화: 463, 신속: 427
  },
  equipment: [
    { type: '무기', name: '무기 공격력 Lv.5', icon: 'https://placehold.co/48x48/374151/fbbf24?text=W' },
    { type: '투구', name: '무기 공격력 Lv.5', icon: 'https://placehold.co/48x48/374151/9ca3af?text=H' },
    { type: '상의', name: '무기 공격력 Lv.5', icon: 'https://placehold.co/48x48/374151/9ca3af?text=C' },
    { type: '하의', name: '무기 공격력 Lv.5', icon: 'https://placehold.co/48x48/374151/9ca3af?text=P' },
    { type: '장갑', name: '무기 공격력 Lv.5', icon: 'https://placehold.co/48x48/374151/9ca3af?text=G' },
    { type: '어깨', name: '무기 공격력 Lv.5', icon: 'https://placehold.co/48x48/374151/9ca3af?text=S' },
  ],
  accessories: [
    { icon: 'https://placehold.co/48x48/8b5cf6/ffffff?text=N', options: ['세레나데, 신앙, 조화 게이지 획득량 +3.60%', '낙인력 +8.00%', '적에게 주는 피해 +1.20%'] },
    { icon: 'https://placehold.co/48x48/8b5cf6/ffffff?text=E', options: ['세레나데, 신앙, 조화 게이지 획득량 +3.60%', '낙인력 +8.00%', '적에게 주는 피해 +1.20%'] },
    { icon: 'https://placehold.co/48x48/8b5cf6/ffffff?text=E', options: ['세레나데, 신앙, 조화 게이지 획득량 +3.60%', '낙인력 +8.00%', '적에게 주는 피해 +1.20%'] },
    { icon: 'https://placehold.co/48x48/8b5cf6/ffffff?text=R', options: ['세레나데, 신앙, 조화 게이지 획득량 +3.60%', '낙인력 +8.00%', '적에게 주는 피해 +1.20%'] },
    { icon: 'https://placehold.co/48x48/8b5cf6/ffffff?text=R', options: ['세레나데, 신앙, 조화 게이지 획득량 +3.60%', '낙인력 +8.00%', '적에게 주는 피해 +1.20%'] },
    { icon: 'https://placehold.co/48x48/8b5cf6/ffffff?text=B', options: ['세레나데, 신앙, 조화 게이지 획득량 +3.60%', '낙인력 +8.00%', '적에게 주는 피해 +1.20%'] },
    { icon: 'https://placehold.co/48x48/8b5cf6/ffffff?text=S', options: ['구슬동자 Lv.2', '각성 Lv.2', '방어력 감소 Lv.0'] },
  ],
  gems: Array(11).fill({ level: 8, name: '멸화의 보석', icon: 'https://placehold.co/48x48/ef4444/ffffff?text=멸' }),
  tripods: [
    { name: '진화', detail: '1티어 특화 Lv.10', points: '120 포인트' },
    { name: '깨달음', detail: '1티어 지능 가는 달 Lv.1', points: '101 포인트' },
    { name: '도약', detail: '1티어 초월적인 힘 Lv.1', points: '70 포인트' },
  ],
  engravings: [
    { name: '각성', level: 2, icon: 'https://placehold.co/40x40/f97316/ffffff?text=각' },
    { name: '전문의', level: 4, icon: 'https://placehold.co/40x40/22c55e/ffffff?text=전' },
    { name: '중갑 착용', level: 4, icon: 'https://placehold.co/40x40/3b82f6/ffffff?text=중' },
    { name: '마나의 흐름', level: 4, icon: 'https://placehold.co/40x40/8b5cf6/ffffff?text=마' },
    { name: '구슬동자', level: 2, icon: 'https://placehold.co/40x40/ec4899/ffffff?text=구' },
  ],
  avatars: [
      { name: '순결한 영원 덧옷', type: '무기 아바타', icon: 'https://placehold.co/64x64/a78bfa/ffffff?text=A' },
      { name: '황혼의 사제 상의', type: '상의 아바타', icon: 'https://placehold.co/64x64/a78bfa/ffffff?text=A' },
  ],
  skills: [
      { name: '사운드 쇼크', level: 12, tripods: '1-3-1', rune: '질풍', icon: 'https://placehold.co/48x48/be185d/ffffff?text=S' },
      { name: '음파 진동', level: 12, tripods: '3-1-2', rune: '압도', icon: 'https://placehold.co/48x48/be185d/ffffff?text=S' },
  ],
  collectibles: [
      { name: '모코코 씨앗', collected: 1234, total: 1500 },
      { name: '섬의 마음', collected: 99, total: 120 },
  ],
  expedition: [
      { raid: '아브렐슈드', characters: [{ name: '이송정', class: '기상술사', level: 1710, guild: '우애' }, { name: '이댕두', class: '바드', level: 1680, guild: '우애' }] },
      { raid: '카단', characters: [{ name: '배럭캐릭', class: '슬레이어', level: 1650, guild: '우애' }] }
  ]
};

// CharacterSearchPage의 서브 컴포넌트들
const ProfileSidebar = ({ char, activeTab, setActiveTab }) => {
    const menuItems = ['캐릭터 정보', '스킬', '수집', '도표', '아바타', '보유 캐릭터'];
    const menuMap = {'캐릭터 정보': 'info', '스킬': 'skills', '수집': 'collectibles', '도표': 'chart', '아바타': 'avatar', '보유 캐릭터': 'expedition'};

    return (
        <div className="w-64 flex-shrink-0 space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                    <h2 className="text-2xl font-bold">{char.name}</h2>
                </div>
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">템 레벨</span><span>{char.level}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">공격력</span><span>{char.attack}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">원정대</span><span>Lv.{char.expeditionLvl}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">전투</span><span>{char.title}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">서버</span><span>{char.server}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">길드</span><span>{char.guild}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">PVP</span><span>{char.pvp}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">영지</span><span>{char.영지}</span></div>
                </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl text-sm font-semibold">
                {menuItems.map(menu => (
                    <button key={menu} onClick={() => setActiveTab(menuMap[menu])} className={`w-full text-left block p-2 rounded-lg ${activeTab === menuMap[menu] ? 'bg-purple-200 dark:bg-purple-800/50' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{menu}</button>
                ))}
            </div>
        </div>
    );
};

const CharacterInfoView = ({ char }) => (
    <div className="flex-grow bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
        <div className="flex gap-4">
            <div className="w-1/3 space-y-2">{char.equipment.map(item => (<div key={item.type} className="flex items-center gap-3 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><img src={item.icon} alt={item.type} className="w-10 h-10 rounded" /><span className="text-sm">{item.name}</span></div>))}</div>
            <div className="w-1/3 flex items-center justify-center"><img src={char.characterImage} alt="Character" className="max-h-96" /></div>
            <div className="w-1/3 space-y-1">{char.accessories.map((item, index) => (<div key={index} className="flex items-center gap-3 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><img src={item.icon} alt={item.type} className="w-10 h-10 rounded" /><div>{item.options.map((opt, i) => <p key={i} className="text-xs text-green-400">{opt}</p>)}</div></div>))}</div>
        </div>
        <hr className="border-gray-200 dark:border-gray-700 my-6" />
        <div className="space-y-6">
            <div><h3 className="font-bold mb-2">보석</h3><div className="grid grid-cols-11 gap-2">{char.gems.map((gem, i) => <img key={i} src={gem.icon} alt={gem.name} className="w-12 h-12 rounded" />)}</div></div>
            <div className="grid grid-cols-2 gap-8">
                <div><h3 className="font-bold mb-2">트라이포드</h3><div className="grid grid-cols-3 gap-4 text-sm">{char.tripods.map(tp => (<div key={tp.name}><p className="font-semibold">{tp.name} <span className="text-gray-400">{tp.points}</span></p><p className="text-xs">{tp.detail}</p></div>))}</div></div>
                <div><h3 className="font-bold mb-2">각인</h3><div className="space-y-2">{char.engravings.map(eng => (<div key={eng.name} className="flex items-center gap-2 text-sm"><img src={eng.icon} alt={eng.name} className="w-6 h-6 rounded-full" /><span>{eng.name}</span><span className="text-blue-400">Lv.{eng.level}</span></div>))}</div></div>
            </div>
        </div>
    </div>
);

const AvatarView = ({ char }) => (
    <div className="flex-grow bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">아바타</h2>
        <div className="flex gap-6">
            <div className="w-1/2 flex justify-center items-center"><img src={char.characterImage} alt="Character" className="max-h-96" /></div>
            <div className="w-1/2 space-y-3">
                {char.avatars.map(avatar => (
                    <div key={avatar.name} className="flex items-center gap-4 p-2 bg-gray-200 dark:bg-gray-700/50 rounded-lg">
                        <img src={avatar.icon} alt={avatar.name} className="w-16 h-16 rounded" />
                        <div>
                            <p className="font-bold">{avatar.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{avatar.type}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const SkillsView = ({char}) => (
    <div className="flex-grow bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">스킬</h2>
            <div className="flex gap-4 text-sm">
                <span>치명 <span className="font-bold text-purple-400">{char.stats.치명}</span></span>
                <span>특화 <span className="font-bold text-purple-400">{char.stats.특화}</span></span>
                <span>신속 <span className="font-bold text-purple-400">{char.stats.신속}</span></span>
            </div>
        </div>
        <div className="space-y-2">
            {char.skills.map(skill => (
                 <div key={skill.name} className="flex items-center gap-4 p-2 bg-gray-200 dark:bg-gray-700/50 rounded-lg">
                    <img src={skill.icon} alt={skill.name} className="w-12 h-12 rounded" />
                    <div className="flex-grow">
                        <p className="font-bold">{skill.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">트라이포드: {skill.tripods}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs">레벨</p>
                        <p className="font-bold">{skill.level}</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-500 rounded-full" title={`룬: ${skill.rune}`}></div>
                 </div>
            ))}
        </div>
    </div>
);

const CollectiblesView = ({char}) => (
    <div className="flex-grow bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">수집형 포인트</h2>
        <div className="space-y-2">
            {char.collectibles.map(item => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-700/50 rounded-lg">
                    <span className="font-semibold">{item.name}</span>
                    <div className="flex items-center gap-2">
                        <span>{item.collected} / {item.total}</span>
                        <div className="w-6 h-6 flex items-center justify-center bg-green-500 rounded-full text-white"><Check size={16}/></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ChartView = () => (
    <div className="flex-grow bg-gray-100 dark:bg-gray-800 p-6 rounded-xl space-y-6">
        <div>
            <h2 className="text-xl font-bold mb-2">아이템 레벨</h2>
            <div className="h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-700/50 rounded-lg"><BarChart2 className="w-12 h-12 text-gray-400" /></div>
        </div>
        <div>
            <h2 className="text-xl font-bold mb-2">전투력</h2>
            <div className="h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-700/50 rounded-lg"><BarChart2 className="w-12 h-12 text-gray-400" /></div>
        </div>
        <div>
            <h2 className="text-xl font-bold mb-2">원정대 레벨</h2>
            <div className="h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-700/50 rounded-lg"><BarChart2 className="w-12 h-12 text-gray-400" /></div>
        </div>
    </div>
);

const ExpeditionView = ({ char }) => (
    <div className="flex-grow bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">보유 캐릭터</h2>
        <div className="space-y-4">
            {char.expedition.map(raidGroup => (
                <div key={raidGroup.raid}>
                    <h3 className="font-semibold mb-2">{raidGroup.raid}</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {raidGroup.characters.map(c => (
                            <div key={c.name} className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <User className="w-8 h-8 p-1.5 bg-gray-500 rounded-full" />
                                    <div>
                                        <p className="font-bold">{c.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{c.class}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">Lv.{c.level}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{c.guild}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const MainContent = ({ activeTab, char }) => {
    switch (activeTab) {
        case 'info': return <CharacterInfoView char={char} />;
        case 'skills': return <SkillsView char={char} />;
        case 'collectibles': return <CollectiblesView char={char} />;
        case 'chart': return <ChartView />;
        case 'avatar': return <AvatarView char={char} />;
        case 'expedition': return <ExpeditionView char={char} />;
        default: return <CharacterInfoView char={char} />;
    }
};

export default function CharacterSearchPage({ searchQuery }) {
    const [activeTab, setActiveTab] = useState('info');
    const characterData = MOCK_CHARACTER_DATA;

    return (
        <div className="p-4 pt-28">
            <div className="flex gap-6">
                <ProfileSidebar char={characterData} activeTab={activeTab} setActiveTab={setActiveTab} />
                <MainContent activeTab={activeTab} char={characterData} />
            </div>
        </div>
    );
}
