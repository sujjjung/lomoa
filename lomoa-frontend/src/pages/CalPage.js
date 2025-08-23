// lomoa-frontend/src/pages/CalPage.js
// 최종 수정: 2025-08-23
// - RaidPage -> CalPage로 이름 변경
// - 레이아웃 및 UI 디자인 개선
// - 메인 컬러 하늘색으로 변경

import React, { useState, useMemo } from 'react';
import { Coins, Edit, Calculator, Gem, Hammer, Home, Search, ShoppingCart, Cuboid, Users } from 'lucide-react';

// --- 서브 컴포넌트들 ---

const CopyableResult = ({ value }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = (e) => {
        e.stopPropagation();
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
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                {copied ? '복사 완료!' : '클릭하여 복사하기'}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
            </div>
            <span className="cursor-pointer font-bold text-lg text-sky-400">{value.toLocaleString()}</span>
        </div>
    );
};

const ResultCard = ({ title, bidValue, details }) => (
    <div className="bg-gray-200 dark:bg-gray-700/50 p-4 rounded-lg">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</p>
        <div className="flex items-center gap-2">
            <CopyableResult value={bidValue} />
            <span className="text-lg font-bold">G</span>
        </div>
        {details && (
            <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600 space-y-1 text-sm">
                {details.map((item, index) => (
                    <div key={index} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                        <span className="font-mono">{item.value.toLocaleString()} G</span>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const AuctionCalculator = () => {
    const [price, setPrice] = useState('');
    const [numPeople, setNumPeople] = useState(8);
    const [customNum, setCustomNum] = useState('');
    const [activeOption, setActiveOption] = useState('8');

    const partySize = useMemo(() => {
        if (activeOption === 'custom') {
            const parsed = parseInt(customNum, 10);
            return isNaN(parsed) ? 0 : parsed;
        }
        return parseInt(activeOption, 10);
    }, [activeOption, customNum]);

    const results = useMemo(() => {
        const itemPrice = parseFloat(price);
        if (isNaN(itemPrice) || itemPrice <= 0 || partySize <= 1) return null;
        const N = partySize;
        const nBreadBid = Math.floor(itemPrice * 0.95 * ((N - 1) / N));
        const recommendedBid = Math.floor(nBreadBid / 1.1);
        const directUseBid = Math.floor(itemPrice * ((N - 1) / N));
        const distributionForNBread = Math.floor((nBreadBid * 0.95) / (N - 1));
        const saleProfitForNBread = Math.floor(itemPrice - nBreadBid - (nBreadBid * 0.05));
        const netProfitForNBread = saleProfitForNBread - distributionForNBread;
        const distributionForRecommended = Math.floor((recommendedBid * 0.95) / (N - 1));
        const saleProfitForRecommended = Math.floor(itemPrice - recommendedBid - (recommendedBid * 0.05));
        const netProfitForRecommended = saleProfitForRecommended - distributionForRecommended;
        const distributionForDirectUse = Math.floor((directUseBid * 0.95) / (N - 1));
        return {
            recommended: { bid: recommendedBid, details: [{ label: '분배금', value: distributionForRecommended }, { label: '판매 차익', value: saleProfitForRecommended }, { label: '손익금', value: netProfitForRecommended }] },
            breakEven: { bid: nBreadBid, details: [{ label: '분배금', value: distributionForNBread }, { label: '판매 차익', value: saleProfitForNBread }, { label: '손익금', value: netProfitForNBread }] },
            directUse: { bid: directUseBid, details: [{ label: '분배금', value: distributionForDirectUse }] }
        };
    }, [price, partySize]);

    const handleOptionChange = (option) => {
        setActiveOption(option);
        if (option !== 'custom') {
            setNumPeople(parseInt(option, 10));
        }
    };
    
    const handleCustomInputChange = (e) => {
        const val = e.target.value;
        setActiveOption('custom');
        setCustomNum(val);
        const parsed = parseInt(val, 10);
        if (!isNaN(parsed) && parsed > 1) {
            setNumPeople(parsed);
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl w-full">
            <div className="space-y-8">
                <div className="w-full md:w-1/3 mx-auto">
                    <div className="relative">
                        <input 
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="거래소 가격 입력"
                            className="w-full p-4 pl-6 text-lg bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-sky-500 transition-colors text-center"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-500 font-bold">G</span>
                    </div>
                </div>

                <div className="flex items-center justify-center space-x-4 text-sm flex-wrap gap-y-2">
                    {['4', '8', '16'].map(num => (
                        <label key={num} className="flex items-center cursor-pointer">
                            <input type="radio" name="partySize" checked={activeOption === num} onChange={() => handleOptionChange(num)} className="w-4 h-4 text-sky-600" />
                            <span className="ml-2">{num}인</span>
                        </label>
                    ))}
                     <label className="flex items-center cursor-pointer">
                        <input type="radio" name="partySize" checked={activeOption === '30'} onChange={() => handleOptionChange('30')} className="w-4 h-4 text-sky-600" />
                        <span className="ml-2">필드보스</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="partySize" checked={activeOption === 'custom'} onChange={() => handleOptionChange('custom')} className="w-4 h-4 text-sky-600" />
                        <input 
                            type="number" 
                            value={customNum}
                            onChange={handleCustomInputChange}
                            className="w-12 ml-2 p-1 text-center bg-gray-200 dark:bg-gray-700 rounded-md"
                        />
                        <span className="ml-1">인</span>
                    </label>
                </div>
            </div>

            {results && (
                <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ResultCard title="추천 입찰가" bidValue={results.recommended.bid} details={results.recommended.details} />
                    <ResultCard title="손익 분기점" bidValue={results.breakEven.bid} details={results.breakEven.details} />
                    <ResultCard title="직접 사용" bidValue={results.directUse.bid} details={results.directUse.details} />
                </div>
            )}
        </div>
    );
};

const PlaceholderCalculator = ({ title }) => (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl w-full flex items-center justify-center h-96">
        <div className="text-center">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">이 기능은 현재 준비 중입니다.</p>
        </div>
    </div>
);

// 메인 CalPage 컴포넌트
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
        <div className="pt-4 space-y-6 w-full">
            <div className="flex justify-center">
                <div className="flex space-x-1 mb-4 border-b border-gray-300 dark:border-gray-700 overflow-x-auto pb-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`flex items-center gap-2 px-4 py-2 font-semibold border-b-2 transition-colors flex-shrink-0 ${
                                activeTab === tab.name
                                    ? 'border-sky-500 text-sky-500'
                                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                        >
                            <tab.icon size={16} />
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="mt-4">
                {activeComponent}
            </div>
        </div>
    );
}