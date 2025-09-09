import React, { memo } from "react";
import { InputField } from "@/components/ui/form-fields";
import { GridSection } from "@/components/ui/grid-section";
import { OrderDetail } from "@/types/orderForm";
import { useFieldChange } from "@/hooks/useFieldChange";

interface PricingSectionProps {
    detail: OrderDetail;
    index: number;
    handleDetailChange: (index: number, field: keyof OrderDetail, value: string | number) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = memo(({
    detail,
    index,
    handleDetailChange
}) => {
    const { createInputHandler } = useFieldChange({ index, handleDetailChange });

    return (
        <div className="border-t pt-4">
            <GridSection title="単価情報">
                <InputField
                    label="受注単価"
                    type="number"
                    placeholder="0"
                    value={detail.orderUnitPrice}
                    onChange={createInputHandler("orderUnitPrice")}
                    step="0.01"
                />

                <InputField
                    label="受注金額"
                    type="number"
                    placeholder="0"
                    value={detail.totalPrice}
                    onChange={createInputHandler("totalPrice")}
                    readOnly
                    className="bg-gray-100"
                />
            </GridSection>

            <GridSection className="mt-4">
                <InputField
                    label="納品単価"
                    type="number"
                    placeholder="0"
                    value={detail.deliveryUnitPrice}
                    onChange={createInputHandler("deliveryUnitPrice")}
                    step="0.01"
                />

                <InputField
                    label="納品金額"
                    type="number"
                    placeholder="0"
                    value={detail.totalDeliveryUnitPrice}
                    onChange={createInputHandler("totalDeliveryUnitPrice")}
                    readOnly
                    className="bg-gray-100"
                />
            </GridSection>

            <GridSection className="mt-4">
                <InputField
                    label="客先単価"
                    type="number"
                    placeholder="0"
                    value={detail.customerUnitPrice}
                    onChange={createInputHandler("customerUnitPrice")}
                    step="0.01"
                />

                <InputField
                    label="客先金額"
                    type="number"
                    placeholder="0"
                    value={detail.totalCustomerUnitPrice}
                    onChange={createInputHandler("totalCustomerUnitPrice")}
                    readOnly
                    className="bg-gray-100"
                />
            </GridSection>
        </div>
    );
});