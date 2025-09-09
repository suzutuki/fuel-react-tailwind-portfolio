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

interface OrderDetailCardProps {
    detail: OrderDetail;
    index: number;
    handleDetailChange: (index: number, field: keyof OrderDetail, value: string | number) => void;
    removeOrderDetail: (index: number) => void;
    canRemove: boolean;
}

export const OrderDetailCard: React.FC<OrderDetailCardProps> = memo(({
    detail,
    index,
    handleDetailChange,
    removeOrderDetail,
    canRemove,
}) => {
    const specialOrderOptions = useMemo(() => 
        createIndexedOptions(SPECIAL_ORDER_OPTIONS, index), [index]
    );

    const productCategoryOptions = useMemo(() => 
        createIndexedOptions(PRODUCT_CATEGORY_OPTIONS, index), [index]
    );

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