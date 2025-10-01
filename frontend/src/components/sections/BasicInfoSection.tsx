import React from "react";
import { InputField, SelectField } from "@/components/ui/form-fields";
import { Calendar, Building, Truck } from "lucide-react";
import { VEHICLE_OPTIONS, STORE_OPTIONS } from "@/constants/orderFormConstants";
import { FormData } from "@/types/orderForm";

interface BasicInfoSectionProps {
    formData: Pick<FormData, 'receiveOrderDate' | 'contractNumber' | 'maxVehicle' | 'storeCode'>;
    handleInputChange: (field: keyof FormData, value: string) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ 
    formData, 
    handleInputChange 
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputField
                label="受注日"
                required
                icon={Calendar}
                type="date"
                value={formData.receiveOrderDate}
                onChange={(e) =>
                    handleInputChange("receiveOrderDate", e.target.value)
                }
                className="text-center text-lg font-semibold"
            />

            <InputField
                label="契約番号(物件コード)"
                required
                icon={Building}
                placeholder="例:123456789"
                value={formData.contractNumber}
                onChange={(e) =>
                    handleInputChange("contractNumber", e.target.value)
                }
                className="uppercase"
            />

            <SelectField
                label="指定車両"
                required
                icon={Truck}
                options={VEHICLE_OPTIONS}
                value={formData.maxVehicle}
                onValueChange={(value) =>
                    handleInputChange("maxVehicle", value)
                }
            />

            <SelectField
                label="店舗名"
                required
                options={STORE_OPTIONS}
                placeholder="例：0104 -旭川店"
                value={formData.storeCode}
                onValueChange={(value) => handleInputChange("storeCode", value)}
            />
        </div>
    );
};