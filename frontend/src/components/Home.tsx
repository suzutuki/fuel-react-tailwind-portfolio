import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import OrderFormApp from "./OrderFormApp"; // 受注フォームコンポーネントをインポート

const Home: React.FC = () => {
    const [showOrderForm, setShowOrderForm] = useState(false);

    const handleStartClick = () => {
        setShowOrderForm(true);
    };

    // 受注フォームが表示されている場合は、フォームを表示
    if (showOrderForm) {
        return <OrderFormApp />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-lg">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-800">
                                FuelPHP、React、TypeScript、TailwindCSS
                                shadcn/ui
                            </h1>
                        </div>
                        <nav>
                            <div className="flex items-center space-x-4">
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    ホーム
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    About
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Contact
                                </a>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        ようこそ！
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        FuelPHP、React、TypeScript、TailwindCSS
                        shadcn/uiで構築されたアプリケーションです
                    </p>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                                {/* FuelPHP公式アイコン ローカル画像 */}
                                <img
                                    src="/images/fuelphp-icon.png"
                                    alt="FuelPHP"
                                    className="w-10 h-10"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                FuelPHP
                            </h3>
                            <p className="text-gray-600">
                                高速で柔軟なPHPフレームワーク
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                                {/* React公式アイコン ローカル画像 */}
                                <img
                                    src="/images/react-icon.png"
                                    alt="React"
                                    className="w-10 h-10"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                React
                            </h3>
                            <p className="text-gray-600">
                                モダンなUIライブラリ
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                                {/* TypeScript公式アイコン ローカル画像 */}
                                <img
                                    src="/images/typescript-icon.png"
                                    alt="TypeScript"
                                    className="w-10 h-10"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                TypeScript
                            </h3>
                            <p className="text-gray-600">型安全なJavaScript</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                                {/* TailwindCSS公式アイコン ローカル画像 */}
                                <img
                                    src="/images/tailwindcss-icon.png"
                                    alt="TailwindCSS"
                                    className="w-10 h-10"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                TailwindCSS
                            </h3>
                            <p className="text-gray-600">
                                ユーティリティファーストCSS
                            </p>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-12">
                        <Button
                            size="lg"
                            className="px-8 py-3 text-lg font-semibold"
                            onClick={handleStartClick}
                        >
                            始めましょう
                        </Button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-16">
                <div className="container mx-auto px-6">
                    <div className="text-center">
                        <p>
                            &copy; 2024 suzutuki-portfolio. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
