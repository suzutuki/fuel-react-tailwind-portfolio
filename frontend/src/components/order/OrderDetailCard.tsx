import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField, SelectField, RadioField } from "@/components/ui/form-fields";
import { Trash2 } from "lucide-react";
import { 
    SPECIAL_ORDER_OPTIONS, 
    PRODUCT_CATEGORY_OPTIONS, 
    CARRIER_OPTIONS, 
    PRODUCT_SEARCH_OPTIONS 
} from "@/constants/orderFormConstants";
import { OrderDetail } from "@/types/orderForm";

interface OrderDetailCardProps {
    detail: OrderDetail;
    index: number;
    handleDetailChange: (index: number, field: string, value: string) => void;
    removeOrderDetail: (index: number) => void;
    canRemove: boolean;
}

export const OrderDetailCard: React.FC<OrderDetailCardProps> = ({
    detail,
    index,
    handleDetailChange,
    removeOrderDetail,
    canRemove,
}) => {
    const specialOrderOptionsWithIndex = SPECIAL_ORDER_OPTIONS.map(option => ({
        ...option,
        id: `${option.id}-${index}`
    }));

    const productCategoryOptionsWithIndex = PRODUCT_CATEGORY_OPTIONS.map(option => ({
        ...option,
        id: `${option.id}-${index}`
    }));

    return (
        <Card className="border-2 border-gray-200">
            <CardHeader className="bg-gray-50 pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">明細 #{index + 1}</CardTitle>
                    {canRemove && (
                        <Button
                            onClick={() => removeOrderDetail(index)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                        label="商品検索"
                        options={PRODUCT_SEARCH_OPTIONS}
                        placeholder="品番または商品名で商品の候補を表示します"
                        value={detail.productSearch}
                        onValueChange={(value) =>
                            handleDetailChange(index, "productSearch", value)
                        }
                    />

                    <InputField
                        label="商品名"
                        required
                        placeholder="例：ｱｸﾘﾙ防水ﾃｰﾌﾟ[片面][75mm][20m巻]"
                        value={detail.productName}
                        onChange={(e) =>
                            handleDetailChange(
                                index,
                                "productName",
                                e.target.value
                            )
                        }
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="発注品番"
                        placeholder="別注品は自動採番されます"
                        value={detail.officialProductCode}
                        onChange={(e) =>
                            handleDetailChange(
                                index,
                                "officialProductCode",
                                e.target.value
                            )
                        }
                        readOnly
                        className="bg-gray-100"
                    />

                    <InputField
                        label="仕様コード"
                        placeholder="別注品は自動採番されます"
                        value={detail.specificationCode}
                        onChange={(e) =>
                            handleDetailChange(
                                index,
                                "specificationCode",
                                e.target.value
                            )
                        }
                        readOnly
                        className="bg-gray-100"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="受注数量"
                        required
                        type="number"
                        min="1"
                        value={detail.quantity.toString()}
                        onChange={(e) =>
                            handleDetailChange(
                                index,
                                "quantity",
                                e.target.value
                            )
                        }
                    />

                    <RadioField
                        label="別注品フラグ"
                        options={specialOrderOptionsWithIndex}
                        value={detail.specialOrderFlag}
                        onValueChange={(value) =>
                            handleDetailChange(index, "specialOrderFlag", value)
                        }
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="納品希望日"
                        required
                        type="date"
                        value={detail.desiredPurchaseDate}
                        onChange={(e) =>
                            handleDetailChange(
                                index,
                                "desiredPurchaseDate",
                                e.target.value
                            )
                        }
                    />

                    <RadioField
                        label="商品区分"
                        options={productCategoryOptionsWithIndex}
                        value={detail.frequencyCategory}
                        onValueChange={(value) =>
                            handleDetailChange(
                                index,
                                "frequencyCategory",
                                value
                            )
                        }
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                        label="入荷日"
                        type="date"
                        value={detail.arrivalDate}
                        onChange={(e) =>
                            handleDetailChange(
                                index,
                                "arrivalDate",
                                e.target.value
                            )
                        }
                    />

                    <InputField
                        label="重量(kg)"
                        type="number"
                        placeholder="例: 25.5"
                        value={detail.unitWeight}
                        onChange={(e) =>
                            handleDetailChange(
                                index,
                                "unitWeight",
                                e.target.value
                            )
                        }
                        step="0.1"
                    />

                    <InputField
                        label="単位"
                        placeholder="例：ｾｯﾄ"
                        value={detail.unit}
                        onChange={(e) =>
                            handleDetailChange(index, "unit", e.target.value)
                        }
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectField
                        label="運送業者"
                        options={CARRIER_OPTIONS}
                        value={detail.carrierCode}
                        onValueChange={(value) =>
                            handleDetailChange(index, "carrierCode", value)
                        }
                    />

                    <InputField
                        label="荷受人"
                        placeholder="例：山田 太郎"
                        value={detail.shipper}
                        onChange={(e) =>
                            handleDetailChange(index, "shipper", e.target.value)
                        }
                    />

                    <InputField
                        label="荷受人電話番号"
                        placeholder="例：090-1234-5678"
                        value={detail.shipperPhone}
                        onChange={(e) =>
                            handleDetailChange(
                                index,
                                "shipperPhone",
                                e.target.value
                            )
                        }
                    />
                </div>

                <div className="border-t pt-4">
                    <h4 className="text-md font-medium mb-3">単価情報</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <InputField
                            label="受注単価"
                            type="number"
                            placeholder="0"
                            value={detail.orderUnitPrice}
                            onChange={(e) =>
                                handleDetailChange(
                                    index,
                                    "orderUnitPrice",
                                    e.target.value
                                )
                            }
                            step="0.01"
                        />

                        <InputField
                            label="受注金額"
                            type="number"
                            placeholder="0"
                            value={detail.totalPrice}
                            onChange={(e) =>
                                handleDetailChange(
                                    index,
                                    "totalPrice",
                                    e.target.value
                                )
                            }
                            readOnly
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <InputField
                            label="納品単価"
                            type="number"
                            placeholder="0"
                            value={detail.deliveryUnitPrice}
                            onChange={(e) =>
                                handleDetailChange(
                                    index,
                                    "deliveryUnitPrice",
                                    e.target.value
                                )
                            }
                            step="0.01"
                        />

                        <InputField
                            label="納品金額"
                            type="number"
                            placeholder="0"
                            value={detail.totalDeliveryUnitPrice}
                            onChange={(e) =>
                                handleDetailChange(
                                    index,
                                    "totalDeliveryUnitPrice",
                                    e.target.value
                                )
                            }
                            readOnly
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="客先単価"
                            type="number"
                            placeholder="0"
                            value={detail.customerUnitPrice}
                            onChange={(e) =>
                                handleDetailChange(
                                    index,
                                    "customerUnitPrice",
                                    e.target.value
                                )
                            }
                            step="0.01"
                        />

                        <InputField
                            label="客先金額"
                            type="number"
                            placeholder="0"
                            value={detail.totalCustomerUnitPrice}
                            onChange={(e) =>
                                handleDetailChange(
                                    index,
                                    "totalCustomerUnitPrice",
                                    e.target.value
                                )
                            }
                            readOnly
                            className="bg-gray-100"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};