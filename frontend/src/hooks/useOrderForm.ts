import { useState, useEffect } from "react";
import { OrderDetail, FormData } from "@/types/orderForm";
import { DEFAULT_VALUES } from "@/constants/orderFormConstants";
import { validateOrderForm, FormValidationResult } from "@/utils/validation";

// API設定（本番環境用の直接指定）
const API_BASE_URL = "/api/orders";

const createDefaultOrderDetail = (id: number): OrderDetail => ({
    id,
    productSearch: "テスト商品",
    productName: "テストセメント",
    officialProductCode: "TC001",
    specificationCode: "SP001",
    quantity: DEFAULT_VALUES.QUANTITY,
    specialOrderFlag: DEFAULT_VALUES.SPECIAL_ORDER_FLAG,
    desiredPurchaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1週間後
    frequencyCategory: DEFAULT_VALUES.FREQUENCY_CATEGORY,
    arrivalDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3日後
    unitWeight: "25",
    unit: "袋",
    carrierCode: DEFAULT_VALUES.CARRIER_CODE,
    orderUnitPrice: "500",
    totalPrice: "5000",
    deliveryUnitPrice: "50",
    totalDeliveryUnitPrice: "500",
    customerUnitPrice: "550",
    totalCustomerUnitPrice: "5500",
});

const createDefaultFormData = (): FormData => ({
    receiveOrderDate: new Date().toISOString().split("T")[0],
    contractNumber: "TEST-2024-001",
    maxVehicle: DEFAULT_VALUES.MAX_VEHICLE,
    storeCode: "ST001",
    houseName: "テストハウス",
    propertyPostalCode: "123-4567",
    propertyPrefecture: "東京都",
    propertyAddress: "新宿区西新宿1-1-1",
    propertyMemo: "テスト物件です",
    constructionManager: "山田太郎",
    constructionManagerPhone: "03-1234-5678",
    deliveryDestinationType: DEFAULT_VALUES.DELIVERY_DESTINATION_TYPE,
    deliveryPostalCode: "123-4567",
    deliveryPrefecture: "東京都",
    deliveryAddress: "新宿区西新宿1-1-1",
    deliveryPhone: DEFAULT_VALUES.DELIVERY_PHONE,
    deliveryName: "佐藤次郎",
    contactMethod: DEFAULT_VALUES.CONTACT_METHOD,
    fax: "03-1234-5679",
    email: "test@example.com",
    email2: "test2@example.com",
    email3: "",
    emailCc1: "cc1@example.com",
    emailCc2: "",
    emailCc3: "",
    deliveryResponsePerson: "田中花子",
    deliveryMemo: DEFAULT_VALUES.DELIVERY_MEMO,
});

export const useOrderForm = () => {
    const [formData, setFormData] = useState<FormData>(createDefaultFormData());
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([
        createDefaultOrderDetail(1),
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [validationErrors, setValidationErrors] = useState<FormValidationResult | null>(null);

    // 下書きデータの読み込み
    useEffect(() => {
        const loadDraft = () => {
            try {
                const savedDraft = localStorage.getItem('orderFormDraft');
                if (savedDraft) {
                    const draftData = JSON.parse(savedDraft);
                    const savedDate = new Date(draftData.savedAt);
                    const now = new Date();
                    const daysDiff = Math.floor((now.getTime() - savedDate.getTime()) / (1000 * 60 * 60 * 24));

                    // 7日以内の下書きのみ読み込む
                    if (daysDiff <= 7) {
                        if (confirm(`${savedDate.toLocaleString()}に保存された下書きがあります。読み込みますか？`)) {
                            setFormData(draftData.formData);
                            setOrderDetails(draftData.orderDetails);
                        }
                    } else {
                        // 古い下書きは削除
                        localStorage.removeItem('orderFormDraft');
                    }
                }
            } catch (error) {
                console.error('Draft load error:', error);
                localStorage.removeItem('orderFormDraft');
            }
        };

        loadDraft();
    }, []);

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
        // バリデーション実行
        const validation = validateOrderForm(formData, orderDetails);
        setValidationErrors(validation);

        if (!validation.isValid) {
            alert('入力内容に不備があります。エラーメッセージを確認してください。');
            return;
        }

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
                setValidationErrors(null);
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
        try {
            setSaveStatus('saving');

            const draftData = {
                formData,
                orderDetails,
                savedAt: new Date().toISOString()
            };

            localStorage.setItem('orderFormDraft', JSON.stringify(draftData));

            setSaveStatus('saved');
            alert('下書きが正常に保存されました');

            // 3秒後にステータスをリセット
            setTimeout(() => {
                setSaveStatus('idle');
            }, 3000);

        } catch (error) {
            console.error('Draft save error:', error);
            setSaveStatus('error');
            alert('下書きの保存に失敗しました');
        }
    };

    const clearDraft = () => {
        try {
            localStorage.removeItem('orderFormDraft');
            alert('下書きを削除しました');
        } catch (error) {
            console.error('Draft clear error:', error);
            alert('下書きの削除に失敗しました');
        }
    };

    return {
        formData,
        orderDetails,
        isLoading,
        saveStatus,
        validationErrors,
        handleInputChange,
        handleDetailChange,
        addOrderDetail,
        removeOrderDetail,
        resetForm,
        submitForm,
        saveDraft,
        clearDraft,
    };
};