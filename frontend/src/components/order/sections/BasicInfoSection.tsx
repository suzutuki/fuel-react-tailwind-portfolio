import React, { memo } from "react";
import { InputField, SelectField, RadioField } from "@/components/ui/form-fields";
import { GridSection } from "@/components/ui/grid-section";
import { PRODUCT_SEARCH_OPTIONS } from "@/constants/orderFormConstants";
import { OrderDetail, RadioOption } from "@/types/orderForm";
import { useFieldChange } from "@/hooks/useFieldChange";

interface BasicInfoSectionProps {
    detail: OrderDetail;
    index: number;
    handleDetailChange: (index: number, field: keyof OrderDetail, value: string | number) => void;
    specialOrderOptions: RadioOption[];
    productCategoryOptions: RadioOption[];
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = memo(({
    detail,
    index,
    handleDetailChange,
    specialOrderOptions,
    productCategoryOptions
}) => {
    const { createFieldHandler, createInputHandler } = useFieldChange({ index, handleDetailChange });

    return (
        <>
            <GridSection>
                <SelectField
                    label="商品検索"
                    options={PRODUCT_SEARCH_OPTIONS}
                    placeholder="品番または商品名で商品の候補を表示します"
                    value={detail.productSearch}
                    onValueChange={createFieldHandler("productSearch")}
                />

                <InputField
                    label="商品名"
                    required
                    placeholder="例：ｱｸﾘﾙ防水ﾃｰﾌﾟ[片面][75mm][20m巻]"
                    value={detail.productName}
                    onChange={createInputHandler("productName")}
                />
            </GridSection>

            <GridSection>
                <InputField
                    label="発注品番"
                    placeholder="別注品は自動採番されます"
                    value={detail.officialProductCode}
                    onChange={createInputHandler("officialProductCode")}
                    readOnly
                    className="bg-gray-100"
                />

                <InputField
                    label="仕様コード"
                    placeholder="別注品は自動採番されます"
                    value={detail.specificationCode}
                    onChange={createInputHandler("specificationCode")}
                    readOnly
                    className="bg-gray-100"
                />
            </GridSection>

            <GridSection>
                <InputField
                    label="受注数量"
                    required
                    type="number"
                    min="1"
                    value={detail.quantity.toString()}
                    onChange={createInputHandler("quantity")}
                />

                <RadioField
                    label="別注品フラグ"
                    options={specialOrderOptions}
                    value={detail.specialOrderFlag}
                    onValueChange={createFieldHandler("specialOrderFlag")}
                />
            </GridSection>

            <GridSection>
                <InputField
                    label="納品希望日"
                    required
                    type="date"
                    value={detail.desiredPurchaseDate}
                    onChange={createInputHandler("desiredPurchaseDate")}
                />

                <RadioField
                    label="商品区分"
                    options={productCategoryOptions}
                    value={detail.frequencyCategory}
                    onValueChange={createFieldHandler("frequencyCategory")}
                />
            </GridSection>
        </>
    );
});