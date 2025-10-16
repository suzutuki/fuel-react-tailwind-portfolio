import React, { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { SPECIAL_ORDER_OPTIONS, PRODUCT_CATEGORY_OPTIONS } from "@/constants/orderFormConstants";
import { OrderDetail } from "@/types/orderForm";
import { createIndexedOptions } from "@/utils/optionHelpers";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { DeliveryInfoSection } from "./sections/DeliveryInfoSection";
import { PricingSection } from "./sections/PricingSection";

/**
 * OrderDetailCardコンポーネントのプロパティ
 */
interface OrderDetailCardProps {
    /** 注文明細データ */
    detail: OrderDetail;
    /** 明細のインデックス番号（0始まり） */
    index: number;
    /** 明細フィールド変更時のコールバック関数 */
    handleDetailChange: (index: number, field: keyof OrderDetail, value: string | number) => void;
    /** 明細削除時のコールバック関数 */
    removeOrderDetail: (index: number) => void;
    /** 削除ボタンを表示するかどうか（明細が1つの場合は削除不可） */
    canRemove: boolean;
}

/**
 * 注文明細カードコンポーネント
 *
 * 1つの注文明細を表示・編集するためのカードコンポーネント。
 * 以下のセクションで構成される：
 * - BasicInfoSection: 商品情報、特別注文、商品カテゴリ
 * - DeliveryInfoSection: 納品先情報
 * - PricingSection: 価格情報（単価、数量、金額）
 * パフォーマンス最適化のためReact.memoでメモ化されており、
 * propsが変更されない限り再レンダリングされない。
 */
export const OrderDetailCard: React.FC<OrderDetailCardProps> = memo(({
    detail,
    index,
    handleDetailChange,
    removeOrderDetail,
    canRemove,
}) => {
    // 特別注文の選択肢をインデックス付きで生成（ラジオボタンのname属性の一意性確保のため）
    const specialOrderOptions = useMemo(() =>
        createIndexedOptions(SPECIAL_ORDER_OPTIONS, index), [index]
    );

    // 商品カテゴリの選択肢をインデックス付きで生成（ラジオボタンのname属性の一意性確保のため）
    const productCategoryOptions = useMemo(() =>
        createIndexedOptions(PRODUCT_CATEGORY_OPTIONS, index), [index]
    );

    // 削除ハンドラーをメモ化（不要な再生成を防ぐ）
    const handleRemove = useMemo(() => () => removeOrderDetail(index), [removeOrderDetail, index]);

    return (
        <Card className="border-2 border-gray-200">
            <CardHeader className="bg-gray-50 pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">明細 #{index + 1}</CardTitle>
                    {canRemove && (
                        <Button
                            onClick={handleRemove}
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                        >
                            <Trash2 className="h-4 w-4" />
                            削除
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
                <BasicInfoSection
                    detail={detail}
                    index={index}
                    handleDetailChange={handleDetailChange}
                    specialOrderOptions={specialOrderOptions}
                    productCategoryOptions={productCategoryOptions}
                />

                <DeliveryInfoSection
                    detail={detail}
                    index={index}
                    handleDetailChange={handleDetailChange}
                />

                <PricingSection
                    detail={detail}
                    index={index}
                    handleDetailChange={handleDetailChange}
                />
            </CardContent>
        </Card>
    );
});