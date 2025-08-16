import React from 'react';

export default function PlaceholderPage({ title }) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center p-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h1 className="text-4xl font-bold mb-4">{title}</h1>
                <p className="text-gray-500 dark:text-gray-400">이 페이지는 현재 개발 중입니다.</p>
            </div>
        </div>
    );
};