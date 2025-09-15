import React, { memo } from "react";
import { InputField, SelectField } from "@/components/ui/form-fields";
import { GridSection } from "@/components/ui/grid-section";
import { CARRIER_OPTIONS } from "@/constants/orderFormConstants";
import { OrderDetail } from "@/types/orderForm";
import { useFieldChange } from "@/hooks/useFieldChange";

interface DeliveryInfoSectionProps {
    detail: OrderDetail;
    index: number;
    handleDetailChange: (index: number, field: keyof OrderDetail, value: string | number) => void;
}

export const DeliveryInfoSection: React.FC<DeliveryInfoSectionProps> = memo(({
    detail,
    index,
    handleDetailChange
}) => {
    const { createFieldHandler, createInputHandler } = useFieldChange({ index, handleDetailChange });

    return (
        <>
            <GridSection columns={3}>
                <InputField
                    label="入荷日"
                    type="date"
                    value={detail.arrivalDate}
                    onChange={createInputHandler("arrivalDate")}
                />

                <InputField
                    label="重量(kg)"
                    type="number"
                    placeholder="例: 25.5"
                    value={detail.unitWeight}
                    onChange={createInputHandler("unitWeight")}
                    step="0.1"
                />

                <InputField
                    label="単位"
                    placeholder="例：ｾｯﾄ"
                    value={detail.unit}
                    onChange={createInputHandler("unit")}
                />
            </GridSection>

            <GridSection columns={1}>
                <SelectField
                    label="運送業者"
                    options={CARRIER_OPTIONS}
                    value={detail.carrierCode}
                    onValueChange={createFieldHandler("carrierCode")}
                />
            </GridSection>
        </>
    );
});