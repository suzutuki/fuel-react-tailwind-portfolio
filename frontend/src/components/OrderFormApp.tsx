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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                {onBack && (
                    <div className="mb-4">
                        <Button onClick={onBack} variant="outline">
                            ← ホームに戻る
                        </Button>
                    </div>
                )}
                
                {/* Header */}
                <Card className="mb-6">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Package className="h-6 w-6" />
                            受注新規登録
                        </CardTitle>
                        <p className="text-blue-100">
                            FAX・メールなどの受注登録
                        </p>
                    </CardHeader>
                </Card>

                {/* Form */}
                <Card>
                    <CardContent className="p-6">
                        <Tabs value={currentTab} onValueChange={setCurrentTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger
                                    value="basic"
                                    className="flex items-center gap-2"
                                >
                                    <Home className="h-4 w-4" />
                                    基本情報
                                </TabsTrigger>
                                <TabsTrigger
                                    value="details"
                                    className="flex items-center gap-2"
                                >
                                    <Package className="h-4 w-4" />
                                    明細情報
                                </TabsTrigger>
                            </TabsList>

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

                                <div className="text-center pt-6">
                                    <Button
                                        onClick={() => setCurrentTab("details")}
                                        size="lg"
                                        className="px-8 py-3 text-lg"
                                    >
                                        明細情報へ（Ctrl+Shift+X）
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Details Tab */}
                            <TabsContent
                                value="details"
                                className="space-y-6 mt-6"
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">
                                        受注明細
                                    </h3>
                                    <Button
                                        onClick={addOrderDetail}
                                        className="flex items-center gap-2"
                                        variant="outline"
                                    >
                                        <Plus className="h-4 w-4" />
                                        新規
                                    </Button>
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

                                <div className="text-center pt-6">
                                    <Button
                                        onClick={() => setCurrentTab("basic")}
                                        variant="outline"
                                        size="lg"
                                        className="mr-4"
                                    >
                                        基本情報へ戻る（Ctrl+Shift+X）
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Save Status */}
                        {saveStatus !== 'idle' && (
                            <div className="text-center mb-4">
                                {saveStatus === 'saving' && (
                                    <p className="text-blue-600">保存中...</p>
                                )}
                                {saveStatus === 'saved' && (
                                    <p className="text-green-600">正常に保存されました</p>
                                )}
                                {saveStatus === 'error' && (
                                    <p className="text-red-600">保存に失敗しました</p>
                                )}
                            </div>
                        )}

                        {/* Form Actions */}
                        <div className="flex justify-center space-x-4 mt-8 pt-6 border-t">
                            <Button
                                onClick={submitForm}
                                size="lg"
                                className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700"
                                disabled={isLoading}
                            >
                                {isLoading ? "保存中..." : "登録"}
                            </Button>
                            <Button
                                onClick={saveDraft}
                                variant="outline"
                                size="lg"
                                className="px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={isLoading}
                            >
                                下書き保存
                            </Button>
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                size="lg"
                                className="px-8 py-3 text-lg"
                                disabled={isLoading}
                            >
                                リセット
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OrderFormApp;
