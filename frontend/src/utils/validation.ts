import { OrderDetail, FormData } from "@/types/orderForm";

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

export interface FormValidationResult {
    isValid: boolean;
    formErrors: Record<string, string>;
    detailErrors: Record<string, string>[];
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

export const validateFormData = (formData: FormData): ValidationResult => {
    const errors: Record<string, string> = {};

    // 必須項目のバリデーション
    if (!formData.receiveOrderDate.trim()) {
        errors.receiveOrderDate = "受注日は必須です";
    }

    if (!formData.storeCode.trim()) {
        errors.storeCode = "店舗コードは必須です";
    }

    if (!formData.houseName.trim()) {
        errors.houseName = "住宅名は必須です";
    }

    if (!formData.propertyAddress.trim()) {
        errors.propertyAddress = "物件住所は必須です";
    }

    if (!formData.constructionManager.trim()) {
        errors.constructionManager = "工事担当者は必須です";
    }

    // 郵便番号のバリデーション
    if (formData.propertyPostalCode && !/^\d{3}-?\d{4}$/.test(formData.propertyPostalCode)) {
        errors.propertyPostalCode = "郵便番号は「123-4567」の形式で入力してください";
    }

    if (formData.deliveryPostalCode && !/^\d{3}-?\d{4}$/.test(formData.deliveryPostalCode)) {
        errors.deliveryPostalCode = "郵便番号は「123-4567」の形式で入力してください";
    }

    // 電話番号のバリデーション
    if (formData.constructionManagerPhone && !/^[\d\-\(\)\s]+$/.test(formData.constructionManagerPhone)) {
        errors.constructionManagerPhone = "電話番号は正しい形式で入力してください";
    }

    if (formData.deliveryPhone && !/^[\d\-\(\)\s]+$/.test(formData.deliveryPhone)) {
        errors.deliveryPhone = "電話番号は正しい形式で入力してください";
    }

    // メールアドレスのバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailFields = ['email', 'email2', 'email3', 'emailCc1', 'emailCc2', 'emailCc3'] as const;

    emailFields.forEach(field => {
        const value = formData[field];
        if (value && !emailRegex.test(value)) {
            errors[field] = "正しいメールアドレスの形式で入力してください";
        }
    });

    // FAXのバリデーション
    if (formData.fax && !/^[\d\-\(\)\s]+$/.test(formData.fax)) {
        errors.fax = "FAX番号は正しい形式で入力してください";
    }

    // 配送先情報のバリデーション（配送先タイプが指定の場合）
    if (formData.deliveryDestinationType === '1') { // 配送先指定の場合
        if (!formData.deliveryAddress.trim()) {
            errors.deliveryAddress = "配送先住所は必須です";
        }
        if (!formData.deliveryName.trim()) {
            errors.deliveryName = "配送先担当者は必須です";
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateOrderForm = (formData: FormData, orderDetails: OrderDetail[]): FormValidationResult => {
    const formValidation = validateFormData(formData);
    const detailValidations = orderDetails.map(detail => validateOrderDetail(detail));

    // 全体のバリデーション結果を判定
    const allDetailsValid = detailValidations.every(validation => validation.isValid);
    const isFormValid = formValidation.isValid && allDetailsValid;

    return {
        isValid: isFormValid,
        formErrors: formValidation.errors,
        detailErrors: detailValidations.map(validation => validation.errors)
    };
};