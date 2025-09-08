import React from "react";
import { InputField, SelectField } from "@/components/ui/form-fields";
import { Truck } from "lucide-react";
import { DELIVERY_TYPE_OPTIONS } from "@/constants/orderFormConstants";
import { FormData } from "@/types/orderForm";

interface DeliveryInfoSectionProps {
    formData: Pick<FormData, 'deliveryDestinationType' | 'deliveryPostalCode' | 'deliveryPrefecture' | 'deliveryAddress' | 'deliveryPhone' | 'deliveryName'>;
    handleInputChange: (field: string, value: string) => void;
}

export const DeliveryInfoSection: React.FC<DeliveryInfoSectionProps> = ({ 
    formData, 
    handleInputChange 
}) => {
    return (
        <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                納品先情報
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <SelectField
                    label="納品先区分"
                    required
                    options={DELIVERY_TYPE_OPTIONS}
                    value={formData.deliveryDestinationType}
                    onValueChange={(value) =>
                        handleInputChange("deliveryDestinationType", value)
                    }
                />

                <InputField
                    label="納品先郵便番号"
                    required
                    placeholder="例:1234567"
                    value={formData.deliveryPostalCode}
                    onChange={(e) =>
                        handleInputChange("deliveryPostalCode", e.target.value)
                    }
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <InputField
                    label="納品先都道府県"
                    required
                    placeholder="例:東京都"
                    value={formData.deliveryPrefecture}
                    onChange={(e) =>
                        handleInputChange("deliveryPrefecture", e.target.value)
                    }
                    className="md:col-span-2"
                />

                <InputField
                    label="納品先住所"
                    required
                    placeholder="例:千代田区霞が関1-2-3※都道府県は不要です"
                    value={formData.deliveryAddress}
                    onChange={(e) =>
                        handleInputChange("deliveryAddress", e.target.value)
                    }
                    className="md:col-span-3"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="納品先電話番号"
                    required
                    value={formData.deliveryPhone}
                    onChange={(e) =>
                        handleInputChange("deliveryPhone", e.target.value)
                    }
                />

                <InputField
                    label="納品先宛名"
                    value={formData.deliveryName}
                    onChange={(e) =>
                        handleInputChange("deliveryName", e.target.value)
                    }
                />
            </div>
        </div>
    );
};