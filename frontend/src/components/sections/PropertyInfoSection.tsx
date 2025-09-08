import React from "react";
import { InputField, TextareaField } from "@/components/ui/form-fields";
import { Home } from "lucide-react";
import { FormData } from "@/types/orderForm";

interface PropertyInfoSectionProps {
    formData: Pick<FormData, 'houseName' | 'propertyPostalCode' | 'propertyPrefecture' | 'propertyAddress' | 'propertyMemo' | 'constructionManager' | 'constructionManagerPhone'>;
    handleInputChange: (field: string, value: string) => void;
}

export const PropertyInfoSection: React.FC<PropertyInfoSectionProps> = ({ 
    formData, 
    handleInputChange 
}) => (
    <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Home className="h-5 w-5" />
            物件情報
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InputField
                label="物件名(邸名)"
                required
                placeholder="例:山田 太郎"
                value={formData.houseName}
                onChange={(e) => handleInputChange("houseName", e.target.value)}
            />

            <InputField
                label="物件郵便番号"
                required
                placeholder="例:1234567"
                value={formData.propertyPostalCode}
                onChange={(e) =>
                    handleInputChange("propertyPostalCode", e.target.value)
                }
            />

            <InputField
                label="物件都道府県"
                required
                placeholder="例:東京都"
                value={formData.propertyPrefecture}
                onChange={(e) =>
                    handleInputChange("propertyPrefecture", e.target.value)
                }
            />
        </div>

        <InputField
            label="物件住所"
            required
            placeholder="例:千代田区霞が関1-2-3※都道府県は不要です"
            value={formData.propertyAddress}
            onChange={(e) =>
                handleInputChange("propertyAddress", e.target.value)
            }
            className="mb-4"
        />

        <TextareaField
            label="物件備考 (社内メモ)"
            placeholder="社内メモを入力してください"
            value={formData.propertyMemo}
            onChange={(e) => handleInputChange("propertyMemo", e.target.value)}
            rows={2}
            className="mb-4"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
                label="工務担当"
                placeholder="例:鈴木太郎"
                value={formData.constructionManager}
                onChange={(e) =>
                    handleInputChange("constructionManager", e.target.value)
                }
            />

            <InputField
                label="工務担当者電話番号"
                placeholder="例:090-1234-5678"
                value={formData.constructionManagerPhone}
                onChange={(e) =>
                    handleInputChange(
                        "constructionManagerPhone",
                        e.target.value
                    )
                }
            />
        </div>
    </div>
);