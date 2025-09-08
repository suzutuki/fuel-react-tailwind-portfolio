export interface OrderDetail {
    id: number;
    productSearch: string;
    productName: string;
    officialProductCode: string;
    specificationCode: string;
    quantity: number;
    specialOrderFlag: string;
    desiredPurchaseDate: string;
    frequencyCategory: string;
    arrivalDate: string;
    unitWeight: string;
    unit: string;
    carrierCode: string;
    shipper: string;
    shipperPhone: string;
    orderUnitPrice: string;
    totalPrice: string;
    deliveryUnitPrice: string;
    totalDeliveryUnitPrice: string;
    customerUnitPrice: string;
    totalCustomerUnitPrice: string;
}

export interface FormData {
    receiveOrderDate: string;
    contractNumber: string;
    maxVehicle: string;
    storeCode: string;
    houseName: string;
    propertyPostalCode: string;
    propertyPrefecture: string;
    propertyAddress: string;
    propertyMemo: string;
    constructionManager: string;
    constructionManagerPhone: string;
    deliveryDestinationType: string;
    deliveryPostalCode: string;
    deliveryPrefecture: string;
    deliveryAddress: string;
    deliveryPhone: string;
    deliveryName: string;
    contactMethod: string;
    fax: string;
    email: string;
    email2: string;
    email3: string;
    emailCc1: string;
    emailCc2: string;
    emailCc3: string;
    deliveryResponsePerson: string;
    deliveryMemo: string;
}

export interface SelectOption {
    value: string;
    label: string;
}

export interface RadioOption {
    value: string;
    label: string;
    id: string;
}

export interface OrderFormHookReturn {
    formData: FormData;
    orderDetails: OrderDetail[];
    handleInputChange: (field: keyof FormData, value: string) => void;
    handleDetailChange: (index: number, field: keyof OrderDetail, value: string | number) => void;
    addOrderDetail: () => void;
    removeOrderDetail: (index: number) => void;
    resetForm: () => void;
    submitForm: () => void;
}