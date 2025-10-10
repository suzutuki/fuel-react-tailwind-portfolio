import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import OrderFormApp from "./OrderFormApp";
import OrderList from "./OrderList";

type PageType = 'home' | 'orderForm' | 'orderList';
// 
const Home: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<PageType>('home');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleStartClick = () => {
        setCurrentPage('orderForm');
    };

    const handleOrderListClick = () => {
        setCurrentPage('orderList');
    };

    const handleBackToHome = () => {
        setCurrentPage('home');
    };

    // ページの表示制御
    if (currentPage === 'orderForm') {
        // OrderFormAppコンポーネントを表示
        return <OrderFormApp onBack={handleBackToHome} />;
    }

    if (currentPage === 'orderList') {
        return (
            <div>
                <div className="bg-white shadow-lg mb-4">
                    <div className="container mx-auto px-6 py-4">
                        <Button onClick={handleBackToHome} variant="outline">
                            ← ホームに戻る
                        </Button>
                    </div>
                </div>
                <OrderList />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className={`bg-white border-b border-gray-200 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <div className="container mx-auto px-4 sm:px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <h1 className="text-xl font-light text-gray-900 tracking-wide">
                                Portfolio
                            </h1>
                        </div>
                        <nav className="hidden md:block">
                            <div className="flex items-center space-x-8">
                                <button
                                    onClick={() => setCurrentPage('home')}
                                    className={`text-gray-500 hover:text-black px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${currentPage === 'home' ? 'border-black text-black' : 'border-transparent hover:border-black'}`}
                                >
                                    ホーム
                                </button>
                                <button
                                    onClick={handleOrderListClick}
                                    className={`text-gray-500 hover:text-black px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${currentPage === 'orderList' ? 'border-black text-black' : 'border-transparent hover:border-black'}`}
                                >
                                    受注一覧
                                </button>
                                <button
                                    onClick={handleStartClick}
                                    className={`text-gray-500 hover:text-black px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${currentPage === 'orderForm' ? 'border-black text-black' : 'border-transparent hover:border-black'}`}
                                >
                                    新規受注
                                </button>
                            </div>
                        </nav>
                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button className="text-gray-500 hover:text-black">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className={`text-center mb-16 sm:mb-20 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-gray-900 mb-6 tracking-tight">
                            Modern Web Architecture
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            モダンな技術スタックで構築された、洗練された効率的でスケーラブルなソリューション
                        </p>
                    </div>
                    {/* Technology Stack */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <div className="group cursor-pointer">
                            <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-none p-6 lg:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="h-16 flex items-center justify-center mb-6">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-all duration-300 group-hover:scale-110">
                                        <span className="text-gray-700 font-mono text-sm">PHP</span>
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3 tracking-wide uppercase">
                                    Laravel
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    エレガントで表現力豊かなフレームワーク
                                </p>
                            </div>
                        </div>

                        <div className="group cursor-pointer">
                            <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-none p-6 lg:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="h-16 flex items-center justify-center mb-6">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-all duration-300 group-hover:scale-110">
                                        <span className="text-gray-700 font-mono text-sm">JSX</span>
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3 tracking-wide uppercase">
                                    React
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    コンポーネントベースのUIライブラリ
                                </p>
                            </div>
                        </div>

                        <div className="group cursor-pointer">
                            <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-none p-6 lg:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="h-16 flex items-center justify-center mb-6">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-all duration-300 group-hover:scale-110">
                                        <span className="text-gray-700 font-mono text-sm">TS</span>
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3 tracking-wide uppercase">
                                    TypeScript
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    型安全なJavaScript開発効率向上
                                </p>
                            </div>
                        </div>

                        <div className="group cursor-pointer">
                            <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-none p-6 lg:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="h-16 flex items-center justify-center mb-6">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-all duration-300 group-hover:scale-110">
                                        <span className="text-gray-700 font-mono text-sm">CSS</span>
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3 tracking-wide uppercase">
                                    Tailwind
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    ユーティリティファーストCSSフレームワーク
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className={`mt-16 sm:mt-20 text-center transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <button
                            onClick={handleStartClick}
                            className="bg-black text-white px-8 sm:px-12 py-3 sm:py-4 text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-all duration-300 border border-black hover:border-gray-800 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            新規受注を開始
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-12 mt-20">
                <div className="container mx-auto px-6">
                    <div className="text-center">
                        <p className="text-gray-400 text-sm tracking-wide">
                            &copy; 2025 Portfolio. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
// Homeコンポーネントをエクスポート
export default Home;
