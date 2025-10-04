import React from "react";
import { InputField, SelectField } from "@/components/ui/form-fields";
import { Truck, Search } from "lucide-react";
import { DELIVERY_TYPE_OPTIONS } from "@/constants/orderFormConstants";
import { FormData } from "@/types/orderForm";
import { usePostalCode } from "@/hooks/usePostalCode";

/**
 * DeliveryInfoSectionコンポーネントのプロパティ型定義
 */
interface DeliveryInfoSectionProps {
    /** フォームデータ（納品先関連のフィールドのみ） */
    formData: Pick<FormData, 'deliveryDestinationType' | 'deliveryPostalCode' | 'deliveryPrefecture' | 'deliveryAddress' | 'deliveryPhone' | 'deliveryName'>;
    /** フォームの入力値変更時のハンドラ関数 */
    handleInputChange: (field: keyof FormData, value: string) => void;
}

/**
 * 納品先情報入力セクションコンポーネント
 *
 * 主な機能:
 * - 納品先区分の選択（現場/店舗/その他）
 * - 郵便番号入力と住所自動検索機能
 * - 都道府県、住所の入力
 * - 電話番号、宛名の入力
 *
 * @remarks
 * 郵便番号検索機能では、zipcloud APIを利用して郵便番号から住所を自動取得します
 */
export const DeliveryInfoSection: React.FC<DeliveryInfoSectionProps> = ({
    formData,
    handleInputChange
}) => {
    // 郵便番号から住所を検索するためのカスタムフック
    const { fetchAddress, isLoading, error } = usePostalCode();

    /**
     * 郵便番号検索ボタンのクリックハンドラ
     *
     * 処理の流れ:
     * 1. 入力された郵便番号を使用してAPIから住所情報を取得
     * 2. 取得成功時：都道府県と住所のフィールドに自動入力
     * 3. 取得失敗時：エラーメッセージをアラート表示
     */
    const handlePostalCodeSearch = async () => {
        // fetchAddressで郵便番号APIを呼び出し
        const result = await fetchAddress(formData.deliveryPostalCode);

        if (result) {
            // 住所取得成功時：都道府県と住所を自動入力
            handleInputChange("deliveryPrefecture", result.prefecture);
            // address1（市区町村）とaddress2（町域）を結合して入力
            handleInputChange("deliveryAddress", `${result.address1}${result.address2}`);
        } else if (error) {
            // エラー時：エラーメッセージを表示
            alert(error);
        }
    };

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

                <div className="relative">
                    <InputField
                        label="納品先郵便番号"
                        required
                        placeholder="例:1234567"
                        value={formData.deliveryPostalCode}
                        onChange={(e) =>
                            handleInputChange("deliveryPostalCode", e.target.value)
                        }
                    />
                    <button
                        type="button"
                        onClick={handlePostalCodeSearch}
                        disabled={isLoading || !formData.deliveryPostalCode}
                        className="absolute right-2 top-[38px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 text-xs font-medium transition-colors duration-200 border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        title="郵便番号から住所を検索"
                    >
                        <Search className="h-3 w-3" />
                        {isLoading ? "検索中..." : "住所検索"}
                    </button>
                </div>
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