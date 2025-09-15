import { useState } from "react";
import { OrderDetail, FormData } from "@/types/orderForm";
import { DEFAULT_VALUES } from "@/constants/orderFormConstants";

// API設定
const API_BASE_URL = "/api/orders";

const createDefaultOrderDetail = (id: number): OrderDetail => ({
    id,
    productSearch: "",
    productName: "",
    officialProductCode: "",
    specificationCode: "",
    quantity: DEFAULT_VALUES.QUANTITY,
    specialOrderFlag: DEFAULT_VALUES.SPECIAL_ORDER_FLAG,
    desiredPurchaseDate: "",
    frequencyCategory: DEFAULT_VALUES.FREQUENCY_CATEGORY,
    arrivalDate: "",
    unitWeight: "",
    unit: "",
    carrierCode: DEFAULT_VALUES.CARRIER_CODE,
    orderUnitPrice: "",
    totalPrice: "",
    deliveryUnitPrice: "",
    totalDeliveryUnitPrice: "",
    customerUnitPrice: "",
    totalCustomerUnitPrice: "",
});

const createDefaultFormData = (): FormData => ({
    receiveOrderDate: new Date().toISOString().split("T")[0],
    contractNumber: "",
    maxVehicle: DEFAULT_VALUES.MAX_VEHICLE,
    storeCode: "",
    houseName: "",
    propertyPostalCode: "",
    propertyPrefecture: "",
    propertyAddress: "",
    propertyMemo: "",
    constructionManager: "",
    constructionManagerPhone: "",
    deliveryDestinationType: DEFAULT_VALUES.DELIVERY_DESTINATION_TYPE,
    deliveryPostalCode: "",
    deliveryPrefecture: "",
    deliveryAddress: "",
    deliveryPhone: DEFAULT_VALUES.DELIVERY_PHONE,
    deliveryName: "",
    contactMethod: DEFAULT_VALUES.CONTACT_METHOD,
    fax: "",
    email: "",
    email2: "",
    email3: "",
    emailCc1: "",
    emailCc2: "",
    emailCc3: "",
    deliveryResponsePerson: "",
    deliveryMemo: DEFAULT_VALUES.DELIVERY_MEMO,
});

export const useOrderForm = () => {
    const [formData, setFormData] = useState<FormData>(createDefaultFormData());
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([
        createDefaultOrderDetail(1),
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDetailChange = (index: number, field: keyof OrderDetail, value: string | number) => {
        setOrderDetails((prev) =>
            prev.map((detail, i) =>
                i === index ? { ...detail, [field]: value } : detail
            )
        );
    };

    const addOrderDetail = () => {
        setOrderDetails((prev) => [
            ...prev,
            createDefaultOrderDetail(prev.length + 1),
        ]);
    };

    const removeOrderDetail = (index: number) => {
        if (orderDetails.length > 1) {
            setOrderDetails((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const resetForm = () => {
        setFormData(createDefaultFormData());
        setOrderDetails([createDefaultOrderDetail(1)]);
    };

    const submitForm = async () => {
        setIsLoading(true);
        setSaveStatus('saving');

        try {
            const response = await fetch(`${API_BASE_URL}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formData,
                    orderDetails
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setSaveStatus('saved');
                alert(`受注が正常に登録されました。受注ID: ${result.order_id}`);
                
                // フォームをリセット
                resetForm();
                setSaveStatus('idle');
            } else {
                throw new Error(result.message || 'データの保存に失敗しました');
            }

        } catch (error) {
            console.error('Submit error:', error);
            setSaveStatus('error');
            alert(error instanceof Error ? error.message : 'データの保存に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const saveDraft = async () => {
        // 下書き保存機能（将来実装予定）
        console.log('下書き保存機能は今後実装予定です');
    };

    return {
        formData,
        orderDetails,
        isLoading,
        saveStatus,
        handleInputChange,
        handleDetailChange,
        addOrderDetail,
        removeOrderDetail,
        resetForm,
        submitForm,
        saveDraft,
    };
};