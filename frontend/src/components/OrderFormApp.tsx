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

/**
 * OrderFormAppのプロパティ型定義
 */
interface OrderFormAppProps {
    /** ホーム画面に戻るためのコールバック関数 */
    onBack?: () => void;
}

/**
 * 受注フォームのメインコンポーネント
 * FAX・メールなどの受注情報を登録するための画面を提供
 *
 * 主な機能:
 * - 基本情報と明細情報をタブで切り替えて入力
 * - 下書き保存・復元機能（localStorageを使用）
 * - フォームのリセット・削除機能
 */
const OrderFormApp: React.FC<OrderFormAppProps> = ({ onBack }) => {
    // タブの表示状態を管理（"basic": 基本情報、"details": 明細情報）
    const [currentTab, setCurrentTab] = useState("basic");

    // カスタムフックからフォーム管理に必要な機能を取得
    const {
        formData,          // フォームの入力データ
        orderDetails,      // 受注明細のリスト
        isLoading,         // 送信中の状態
        saveStatus,        // 保存ステータス（idle/saving/saved/error）
        handleInputChange, // 入力変更ハンドラ
        handleDetailChange,// 明細変更ハンドラ
        addOrderDetail,    // 明細追加関数
        removeOrderDetail, // 明細削除関数
        resetForm,         // フォームリセット関数
        submitForm,        // フォーム送信関数
        saveDraft,         // 下書き保存関数
        clearDraft,        // 下書き削除関数
    } = useOrderForm();

    /**
     * フォームリセットハンドラ
     * ユーザーに確認を求めてから、フォームの全ての入力内容を初期値に戻す
     */
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
            {/* ヘッダーセクション：ページタイトルとナビゲーション */}
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* ホームに戻るボタン（onBackプロパティが渡された場合のみ表示） */}
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

            {/* メインコンテンツエリア */}
            <div className="container mx-auto px-4 sm:px-6 py-8">
                <div className="max-w-6xl mx-auto">

                    {/* フォームカード */}
                    <div className="bg-white border border-gray-200">
                        <div className="p-6 sm:p-8">
                            {/* タブコンポーネント：基本情報と明細情報を切り替え */}
                            <Tabs value={currentTab} onValueChange={setCurrentTab}>
                                {/* タブナビゲーション */}
                                <div className="border-b border-gray-200 mb-8">
                                    <nav className="flex space-x-8">
                                        {/* 基本情報タブ */}
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
                                        {/* 明細情報タブ */}
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

                                {/* 基本情報タブコンテンツ */}
                                <TabsContent
                                    value="basic"
                                    className="space-y-6 mt-6"
                                >
                                    {/* 基本情報セクション：受注日、契約番号、指定車両、店舗名 */}
                                    <BasicInfoSection
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                    />
                                    {/* 物件情報セクション：物件名、郵便番号、住所、工務担当 */}
                                    <PropertyInfoSection
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                    />
                                    {/* 納品先情報セクション：納品先区分、郵便番号、住所、電話番号 */}
                                    <DeliveryInfoSection
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                    />
                                    {/* 連絡方法セクション：FAX、メールアドレス、納期回答担当者 */}
                                    <ContactMethodSection
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                    />

                                    {/* 明細情報タブへの遷移ボタン */}
                                    <div className="text-center pt-8">
                                        <button
                                            onClick={() => setCurrentTab("details")}
                                            className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors duration-300 border border-black hover:border-gray-800"
                                        >
                                            明細情報へ
                                        </button>
                                    </div>
                                </TabsContent>

                                {/* 明細情報タブコンテンツ */}
                                <TabsContent
                                    value="details"
                                    className="space-y-6 mt-6"
                                >
                                    {/* 明細ヘッダー：タイトルと新規追加ボタン */}
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-900 tracking-wide">
                                            受注明細
                                        </h3>
                                        {/* 明細追加ボタン：クリックで新しい明細行を追加 */}
                                        <button
                                            onClick={addOrderDetail}
                                            className="flex items-center gap-2 border border-gray-300 hover:border-black text-gray-700 hover:text-black px-4 py-2 text-sm font-medium transition-colors duration-200"
                                        >
                                            <Plus className="h-4 w-4" />
                                            新規
                                        </button>
                                    </div>

                                    {/* 明細カードのリスト：各受注明細を表示 */}
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

                                    {/* 基本情報タブへの戻るボタン */}
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

                            {/* 保存ステータス表示：下書き保存時の状態をユーザーに通知 */}
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

                            {/* フォームアクションボタン群 */}
                            <div className="flex flex-wrap justify-center gap-3 mt-8 pt-8 border-t border-gray-200">
                                {/* 登録ボタン：フォームデータをサーバーに送信 */}
                                <button
                                    onClick={submitForm}
                                    className="bg-black text-white px-6 py-3 text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors duration-300 border border-black hover:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "保存中..." : "登録"}
                                </button>
                                {/* 下書き保存ボタン：localStorageに一時保存 */}
                                <button
                                    onClick={saveDraft}
                                    className="bg-gray-100 text-gray-900 px-6 py-3 text-sm font-medium tracking-wide uppercase hover:bg-gray-200 transition-colors duration-300 border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    下書き保存
                                </button>
                                {/* リセットボタン：フォームを初期値に戻す */}
                                <button
                                    onClick={handleReset}
                                    className="border border-gray-300 hover:border-black text-gray-700 hover:text-black px-6 py-3 text-sm font-medium tracking-wide uppercase transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    リセット
                                </button>
                                {/* 下書き削除ボタン：localStorageから下書きを削除 */}
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

/**
 * OrderFormAppコンポーネントをデフォルトエクスポート
 * 他のファイルから import OrderFormApp from './OrderFormApp' でインポート可能
 */
export default OrderFormApp;
