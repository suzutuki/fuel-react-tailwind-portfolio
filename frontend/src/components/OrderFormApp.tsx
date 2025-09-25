import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Package, Plus } from "lucide-react";
import { useOrderForm } from "@/hooks/useOrderForm";
import { BasicInfoSection } from "@/components/sections/BasicInfoSection";
import { PropertyInfoSection } from "@/components/sections/PropertyInfoSection";
import { DeliveryInfoSection } from "@/components/sections/DeliveryInfoSection";
import { ContactMethodSection } from "@/components/sections/ContactMethodSection";
import { OrderDetailCard } from "@/components/order/OrderDetailCard";

interface OrderFormAppProps {
    onBack?: () => void;
}

const OrderFormApp: React.FC<OrderFormAppProps> = ({ onBack }) => {
    const [currentTab, setCurrentTab] = useState("basic");
    const {
        formData,
        orderDetails,
        isLoading,
        saveStatus,
        handleInputChange,
        handleDetailChange,
        addOrderDetail,
        removeOrderDetail,
        resetForm,
        submitForm,
        saveDraft,
        clearDraft,
    } = useOrderForm();

    const handleReset = () => {
        if (
            confirm(
                "入力内容をすべてリセットしますか？\n\n※フォームで入力した内容が全て消えます。"
            )
        ) {
            resetForm();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="text-gray-500 hover:text-black px-4 py-2 text-sm font-medium transition-colors duration-200 border border-gray-300 hover:border-black"
                                >
                                    ← ホームに戻る
                                </button>
                            )}
                            <div>
                                <h1 className="text-2xl font-light text-gray-900 tracking-wide flex items-center gap-3">
                                    <Package className="h-6 w-6 text-gray-600" />
                                    受注新規登録
                                </h1>
                                <p className="text-gray-600 text-sm mt-1">
                                    FAX・メールなどの受注登録
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 py-8">
                <div className="max-w-6xl mx-auto">

                    {/* Form */}
                    <div className="bg-white border border-gray-200">
                        <div className="p-6 sm:p-8">
                            <Tabs value={currentTab} onValueChange={setCurrentTab}>
                                <div className="border-b border-gray-200 mb-8">
                                    <nav className="flex space-x-8">
                                        <button
                                            onClick={() => setCurrentTab("basic")}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${currentTab === "basic"
                                                ? "border-black text-black"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                        >
                                            <Home className="h-4 w-4" />
                                            基本情報
                                        </button>
                                        <button
                                            onClick={() => setCurrentTab("details")}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${currentTab === "details"
                                                ? "border-black text-black"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                        >
                                            <Package className="h-4 w-4" />
                                            明細情報
                                        </button>
                                    </nav>
                                </div>

                                {/* Basic Info Tab */}
                                <TabsContent
                                    value="basic"
                                    className="space-y-6 mt-6"
                                >
                                    <BasicInfoSection
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                    />
                                    <PropertyInfoSection
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                    />
                                    <DeliveryInfoSection
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                    />
                                    <ContactMethodSection
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                    />

                                    <div className="text-center pt-8">
                                        <button
                                            onClick={() => setCurrentTab("details")}
                                            className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors duration-300 border border-black hover:border-gray-800"
                                        >
                                            明細情報へ
                                        </button>
                                    </div>
                                </TabsContent>

                                {/* Details Tab */}
                                <TabsContent
                                    value="details"
                                    className="space-y-6 mt-6"
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-900 tracking-wide">
                                            受注明細
                                        </h3>
                                        <button
                                            onClick={addOrderDetail}
                                            className="flex items-center gap-2 border border-gray-300 hover:border-black text-gray-700 hover:text-black px-4 py-2 text-sm font-medium transition-colors duration-200"
                                        >
                                            <Plus className="h-4 w-4" />
                                            新規
                                        </button>
                                    </div>

                                    {orderDetails.map((detail, index) => (
                                        <OrderDetailCard
                                            key={detail.id}
                                            detail={detail}
                                            index={index}
                                            handleDetailChange={handleDetailChange}
                                            removeOrderDetail={removeOrderDetail}
                                            canRemove={orderDetails.length > 1}
                                        />
                                    ))}

                                    <div className="text-center pt-8">
                                        <button
                                            onClick={() => setCurrentTab("basic")}
                                            className="border border-gray-300 hover:border-black text-gray-700 hover:text-black px-8 py-3 text-sm font-medium tracking-wide uppercase transition-colors duration-200"
                                        >
                                            基本情報へ戻る
                                        </button>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            {/* Save Status */}
                            {saveStatus !== 'idle' && (
                                <div className="text-center mb-6 pt-4 border-t border-gray-200">
                                    {saveStatus === 'saving' && (
                                        <p className="text-gray-600 text-sm">保存中...</p>
                                    )}
                                    {saveStatus === 'saved' && (
                                        <p className="text-gray-900 text-sm font-medium">正常に保存されました</p>
                                    )}
                                    {saveStatus === 'error' && (
                                        <p className="text-gray-700 text-sm">保存に失敗しました</p>
                                    )}
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="flex flex-wrap justify-center gap-3 mt-8 pt-8 border-t border-gray-200">
                                <button
                                    onClick={submitForm}
                                    className="bg-black text-white px-6 py-3 text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors duration-300 border border-black hover:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "保存中..." : "登録"}
                                </button>
                                <button
                                    onClick={saveDraft}
                                    className="bg-gray-100 text-gray-900 px-6 py-3 text-sm font-medium tracking-wide uppercase hover:bg-gray-200 transition-colors duration-300 border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    下書き保存
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="border border-gray-300 hover:border-black text-gray-700 hover:text-black px-6 py-3 text-sm font-medium tracking-wide uppercase transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    リセット
                                </button>
                                <button
                                    onClick={clearDraft}
                                    className="border border-gray-400 hover:border-gray-600 text-gray-600 hover:text-gray-800 px-6 py-3 text-sm font-medium tracking-wide uppercase transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    下書き削除
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
// OrderFormAppコンポーネントをエクスポート
export default OrderFormApp;
