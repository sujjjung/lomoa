import React, { useState, useMemo } from 'react';
import { Coins, Edit, Calculator, Gem, Hammer, Home, Search, ShoppingCart, Cuboid, Users } from 'lucide-react';

// --- 서브 컴포넌트들 ---

const CopyableResult = ({ value }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const textArea = document.createElement('textarea');
        textArea.value = value;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error('클립보드 복사 실패:', err);
        }
        document.body.removeChild(textArea);
    };

    return (
        <div className="relative group inline-block" onClick={handleCopy}>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                {copied ? '복사 완료!' : '클릭하여 복사하기'}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
            </div>
            <span className="cursor-pointer font-bold text-lg text-purple-400">{value.toLocaleString()}</span>
        </div>
    );
};

// 새로운 계산식이 적용된 경매 계산기
const AuctionCalculator = () => {
    const [price, setPrice] = useState('');
    const [numPeople, setNumPeople] = useState(8);

    const results = useMemo(() => {
        const itemPrice = parseFloat(price);
        if (isNaN(itemPrice) || itemPrice <= 0 || numPeople <= 1) return null;

        const N = numPeople;

        // 1. 손익 분기점
        const nBreadBid = Math.floor(itemPrice * 0.95 * ((N - 1) / N));
        // 2. 추천 입찰가
        const recommendedBid = Math.floor(nBreadBid / 1.1);
        // 3. 직접 사용
        const directUseBid = Math.floor(itemPrice * ((N - 1) / N));

        return { nBreadBid, recommendedBid, directUseBid };

    }, [price, numPeople]);

    const handleCustomPeopleInput = () => {
        const customNumber = window.prompt("파티 인원 수를 입력하세요:", numPeople);
        const parsedNumber = parseInt(customNumber, 10);
        if (!isNaN(parsedNumber) && parsedNumber > 1) {
            setNumPeople(parsedNumber);
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 좌측: 입력란 */}
                <div className="space-y-6">
                    <div>
                        <label className="font-bold text-lg">아이템 가격 입력</label>
                        <div className="relative mt-2">
                            <input 
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="거래소 시세"
                                className="w-full p-3 pl-4 pr-10 bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <Coins className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500" size={20} />
                        </div>
                    </div>
                    <div>
                        <label className="font-bold text-lg">파티 인원</label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {[4, 8, 16].map(num => (
                                <button key={num} onClick={() => setNumPeople(num)} className={`py-2 rounded-lg font-semibold ${numPeople === num ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{num}인</button>
                            ))}
                            <button onClick={() => setNumPeople(30)} className={`py-2 rounded-lg font-semibold ${numPeople === 30 ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>필드보스</button>
                            <button onClick={handleCustomPeopleInput} className="py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 flex items-center justify-center gap-1">
                                <Edit size={14} /> 직접
                            </button>
                        </div>
                        <p className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">현재: {numPeople}인</p>
                    </div>
                </div>

                {/* 우측: 결과 표시 */}
                <div className="space-y-4">
                     <h3 className="font-bold text-lg mb-2">계산 결과</h3>
                     {results ? (
                        <div className="space-y-3">
                            <div className="p-3 bg-gray-200 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">추천 입찰가</p>
                                <p><CopyableResult value={results.recommendedBid} /> G</p>
                            </div>
                            <div className="p-3 bg-gray-200 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">손익 분기점</p>
                                <p><CopyableResult value={results.nBreadBid} /> G</p>
                            </div>
                            <div className="p-3 bg-gray-200 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">직접 사용</p>
                                <p><CopyableResult value={results.directUseBid} /> G</p>
                            </div>
                        </div>
                     ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 pt-10">
                            아이템 가격을 입력해주세요.
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

// 다른 계산기들을 위한 임시 컴포넌트
const PlaceholderCalculator = ({ title }) => (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl w-full flex items-center justify-center h-96">
        <div className="text-center">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">이 기능은 현재 준비 중입니다.</p>
        </div>
    </div>
);


// 메인 CalPage 컴포넌트 (탭 UI 적용)
export default function CalPage() {
    const [activeTab, setActiveTab] = useState('경매 계산기');

    const tabs = [
        { name: '경매 계산기', icon: Calculator, component: <AuctionCalculator /> },
        { name: '버스비 계산기', icon: Users, component: <PlaceholderCalculator title="버스비 계산기" /> },
        { name: '재련 계산기', icon: Hammer, component: <PlaceholderCalculator title="재련 계산기" /> },
        { name: '큐브 계산기', icon: Cuboid, component: <PlaceholderCalculator title="큐브 계산기" /> },
        { name: '악세 검색기', icon: Search, component: <PlaceholderCalculator title="악세 검색기" /> },
        { name: '영지 제작', icon: Home, component: <PlaceholderCalculator title="영지 제작 계산기" /> },
        { name: '거래소', icon: ShoppingCart, component: <PlaceholderCalculator title="거래소" /> },
        { name: '재료 계산기', icon: Gem, component: <PlaceholderCalculator title="재료 졸업 계산기" /> },
    ];

    const activeComponent = tabs.find(tab => tab.name === activeTab)?.component;

    return (
        // 모든 페이지와 동일한 레이아웃 적용
        <div className="p-4 pt-28 max-w-4xl mx-auto">
            <div className="flex space-x-1 mb-4 border-b border-gray-300 dark:border-gray-700 overflow-x-auto pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`flex items-center gap-2 px-4 py-2 font-semibold border-b-2 transition-colors flex-shrink-0 ${
                            activeTab === tab.name
                                ? 'border-purple-500 text-purple-500'
                                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                        <tab.icon size={16} />
                        <span>{tab.name}</span>
                    </button>
                ))}
            </div>
            
            <div>
                {activeComponent}
            </div>
        </div>
    );
}