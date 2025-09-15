import { OrderDetail } from "@/types/orderForm";

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

export const validateOrderDetail = (detail: OrderDetail): ValidationResult => {
    const errors: Record<string, string> = {};

    // Required field validations
    if (!detail.productName.trim()) {
        errors.productName = "商品名は必須です";
    }

    if (!detail.quantity || detail.quantity <= 0) {
        errors.quantity = "受注数量は1以上である必要があります";
    }

    if (!detail.desiredPurchaseDate.trim()) {
        errors.desiredPurchaseDate = "納品希望日は必須です";
    }

    // Date validation
    if (detail.desiredPurchaseDate) {
        const desiredDate = new Date(detail.desiredPurchaseDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (desiredDate < today) {
            errors.desiredPurchaseDate = "納品希望日は今日以降の日付を選択してください";
        }
    }

    if (detail.arrivalDate) {
        const arrivalDate = new Date(detail.arrivalDate);
        const desiredDate = new Date(detail.desiredPurchaseDate);
        
        if (arrivalDate > desiredDate) {
            errors.arrivalDate = "入荷日は納品希望日以前である必要があります";
        }
    }


    // Numeric validations
    const numericFields = ['orderUnitPrice', 'deliveryUnitPrice', 'customerUnitPrice', 'unitWeight'];
    numericFields.forEach(field => {
        const value = detail[field as keyof OrderDetail];
        if (value && typeof value === 'string' && value.trim() && isNaN(Number(value))) {
            errors[field] = "数値を入力してください";
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};