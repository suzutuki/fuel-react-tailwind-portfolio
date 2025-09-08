export const VEHICLE_OPTIONS = [
    { value: "-", label: "不明" },
    { value: "2t車", label: "2t車" },
    { value: "2t車ショート(ﾒｰｶｰ限定)", label: "2t車ショート(ﾒｰｶｰ限定)" },
    { value: "4t車", label: "4t車" },
    { value: "4t車ユニック", label: "4t車ユニック" },
    { value: "4t車ショート", label: "4t車ショート" },
    { value: "4t車ロング", label: "4t車ロング" },
    { value: "3t", label: "3t" },
    { value: "10t", label: "10t" },
];

export const STORE_OPTIONS = [
    { value: "0104", label: "0104 - 旭川店" },
    { value: "0105", label: "0105 - 札幌店" },
    { value: "0106", label: "0106 - 函館店" },
];

export const DELIVERY_TYPE_OPTIONS = [
    { value: "1", label: "現場" },
    { value: "3", label: "事務所" },
    { value: "4", label: "その他" },
];

export const CONTACT_OPTIONS = [
    { value: "fax", label: "FAX", id: "fax-radio" },
    { value: "email", label: "メール", id: "email-radio" },
    { value: "person", label: "担当者", id: "person-radio" },
];

export const SPECIAL_ORDER_OPTIONS = [
    { value: "0", label: "通常品", id: "normal" },
    { value: "1", label: "別注品", id: "special" },
];

export const PRODUCT_CATEGORY_OPTIONS = [
    { value: "1", label: "在庫品", id: "stock" },
    { value: "2", label: "邸別品", id: "custom" },
    { value: "3", label: "直送品", id: "direct" },
];

export const CARRIER_OPTIONS = [
    { value: "1000", label: "運送業者コード:1000 - ヤマト運輸" },
    { value: "1001", label: "運送業者コード:1001 - 佐川急便" },
    { value: "1002", label: "運送業者コード:1002 - 日本郵便" },
];

export const PRODUCT_SEARCH_OPTIONS = [
    { value: "product1", label: "品番: ABC123 | 商品名: サンプル商品1" },
    { value: "product2", label: "品番: DEF456 | 商品名: サンプル商品2" },
];

export const DEFAULT_VALUES = {
    DELIVERY_PHONE: "0748-72-2972",
    DELIVERY_MEMO: "不在時連絡下さい。不在置き厳禁",
    MAX_VEHICLE: "-",
    DELIVERY_DESTINATION_TYPE: "1",
    CONTACT_METHOD: "fax",
    SPECIAL_ORDER_FLAG: "0",
    FREQUENCY_CATEGORY: "1",
    CARRIER_CODE: "1000",
    QUANTITY: 1,
} as const;