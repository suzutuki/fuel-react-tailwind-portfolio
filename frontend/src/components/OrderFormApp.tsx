import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calendar,
    Home,
    Truck,
    Phone,
    Mail,
    User,
    Building,
    Package,
    Plus,
    Trash2,
} from "lucide-react";

const OrderFormApp = () => {
    const [currentTab, setCurrentTab] = useState("basic");
    const [orderDetails, setOrderDetails] = useState([
        {
            id: 1,
            productSearch: "",
            productName: "",
            officialProductCode: "",
            specificationCode: "",
            quantity: 1,
            specialOrderFlag: "0",
            desiredPurchaseDate: "",
            frequencyCategory: "1",
            arrivalDate: "",
            unitWeight: "",
            unit: "",
            carrierCode: "1000",
            shipper: "",
            shipperPhone: "",
            orderUnitPrice: "",
            totalPrice: "",
            deliveryUnitPrice: "",
            totalDeliveryUnitPrice: "",
            customerUnitPrice: "",
            totalCustomerUnitPrice: "",
        },
    ]);

    const [formData, setFormData] = useState({
        receiveOrderDate: new Date().toISOString().split("T")[0],
        contractNumber: "",
        maxVehicle: "-",
        storeCode: "",
        houseName: "",
        propertyPostalCode: "",
        propertyPrefecture: "",
        propertyAddress: "",
        propertyMemo: "",
        constructionManager: "",
        constructionManagerPhone: "",
        deliveryDestinationType: "1",
        deliveryPostalCode: "",
        deliveryPrefecture: "",
        deliveryAddress: "",
        deliveryPhone: "0748-72-2972",
        deliveryName: "",
        contactMethod: "fax",
        fax: "",
        email: "",
        email2: "",
        email3: "",
        emailCc1: "",
        emailCc2: "",
        emailCc3: "",
        deliveryResponsePerson: "",
        deliveryMemo: "不在時連絡下さい。不在置き厳禁",
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDetailChange = (index, field, value) => {
        setOrderDetails((prev) =>
            prev.map((detail, i) =>
                i === index ? { ...detail, [field]: value } : detail
            )
        );
    };

    const addOrderDetail = () => {
        setOrderDetails((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                productSearch: "",
                productName: "",
                officialProductCode: "",
                specificationCode: "",
                quantity: 1,
                specialOrderFlag: "0",
                desiredPurchaseDate: "",
                frequencyCategory: "1",
                arrivalDate: "",
                unitWeight: "",
                unit: "",
                carrierCode: "1000",
                shipper: "",
                shipperPhone: "",
                orderUnitPrice: "",
                totalPrice: "",
                deliveryUnitPrice: "",
                totalDeliveryUnitPrice: "",
                customerUnitPrice: "",
                totalCustomerUnitPrice: "",
            },
        ]);
    };

    const removeOrderDetail = (index) => {
        if (orderDetails.length > 1) {
            setOrderDetails((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const switchToDetailsTab = () => {
        setCurrentTab("details");
    };

    const switchToBasicTab = () => {
        setCurrentTab("basic");
    };

    const handleSubmit = () => {
        alert("受注が正常に登録されました。");
    };

    const handleReset = () => {
        if (
            confirm(
                "入力内容をすべてリセットしますか？\n\n※フォームで入力した内容が全て消えます。"
            )
        ) {
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <Card className="mb-6">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Package className="h-6 w-6" />
                            受注新規登録
                        </CardTitle>
                        <p className="text-blue-100">
                            FAX・メールなどの受注登録
                        </p>
                    </CardHeader>
                </Card>

                {/* Form */}
                <Card>
                    <CardContent className="p-6">
                        <Tabs value={currentTab} onValueChange={setCurrentTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger
                                    value="basic"
                                    className="flex items-center gap-2"
                                >
                                    <Home className="h-4 w-4" />
                                    基本情報
                                </TabsTrigger>
                                <TabsTrigger
                                    value="details"
                                    className="flex items-center gap-2"
                                >
                                    <Package className="h-4 w-4" />
                                    明細情報
                                </TabsTrigger>
                            </TabsList>

                            {/* 基本情報タブ */}
                            <TabsContent
                                value="basic"
                                className="space-y-6 mt-6"
                            >
                                {/* 受注日・契約番号・指定車両・加盟店 */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="receiveOrderDate"
                                            className="text-sm font-medium flex items-center gap-1"
                                        >
                                            <Calendar className="h-4 w-4" />
                                            受注日{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="receiveOrderDate"
                                            type="date"
                                            value={formData.receiveOrderDate}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "receiveOrderDate",
                                                    e.target.value
                                                )
                                            }
                                            className="text-center text-lg font-semibold"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="contractNumber"
                                            className="text-sm font-medium flex items-center gap-1"
                                        >
                                            <Building className="h-4 w-4" />
                                            契約番号(物件コード){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="contractNumber"
                                            placeholder="例:123456789"
                                            value={formData.contractNumber}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "contractNumber",
                                                    e.target.value
                                                )
                                            }
                                            className="uppercase"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="maxVehicle"
                                            className="text-sm font-medium flex items-center gap-1"
                                        >
                                            <Truck className="h-4 w-4" />
                                            指定車両{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={formData.maxVehicle}
                                            onValueChange={(value) =>
                                                handleInputChange(
                                                    "maxVehicle",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="-">
                                                    不明
                                                </SelectItem>
                                                <SelectItem value="2t車">
                                                    2t車
                                                </SelectItem>
                                                <SelectItem value="2t車ショート(ﾒｰｶｰ限定)">
                                                    2t車ショート(ﾒｰｶｰ限定)
                                                </SelectItem>
                                                <SelectItem value="4t車">
                                                    4t車
                                                </SelectItem>
                                                <SelectItem value="4t車ユニック">
                                                    4t車ユニック
                                                </SelectItem>
                                                <SelectItem value="4t車ショート">
                                                    4t車ショート
                                                </SelectItem>
                                                <SelectItem value="4t車ロング">
                                                    4t車ロング
                                                </SelectItem>
                                                <SelectItem value="3t">
                                                    3t
                                                </SelectItem>
                                                <SelectItem value="10t">
                                                    10t
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="storeCode"
                                            className="text-sm font-medium"
                                        >
                                            店舗名{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={formData.storeCode}
                                            onValueChange={(value) =>
                                                handleInputChange(
                                                    "storeCode",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="例：0104 -旭川店" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0104">
                                                    0104 - 旭川店
                                                </SelectItem>
                                                <SelectItem value="0105">
                                                    0105 - 札幌店
                                                </SelectItem>
                                                <SelectItem value="0106">
                                                    0106 - 函館店
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* 物件情報 */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <Home className="h-5 w-5" />
                                        物件情報
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="houseName"
                                                className="text-sm font-medium"
                                            >
                                                物件名(邸名){" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="houseName"
                                                placeholder="例:山田 太郎"
                                                value={formData.houseName}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "houseName",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="propertyPostalCode"
                                                className="text-sm font-medium"
                                            >
                                                物件郵便番号{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="propertyPostalCode"
                                                placeholder="例:1234567"
                                                value={
                                                    formData.propertyPostalCode
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "propertyPostalCode",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="propertyPrefecture"
                                                className="text-sm font-medium"
                                            >
                                                物件都道府県{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="propertyPrefecture"
                                                placeholder="例:東京都"
                                                value={
                                                    formData.propertyPrefecture
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "propertyPrefecture",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <Label
                                            htmlFor="propertyAddress"
                                            className="text-sm font-medium"
                                        >
                                            物件住所{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="propertyAddress"
                                            placeholder="例:千代田区霞が関1-2-3※都道府県は不要です"
                                            value={formData.propertyAddress}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "propertyAddress",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <Label
                                            htmlFor="propertyMemo"
                                            className="text-sm font-medium"
                                        >
                                            物件備考 (社内メモ)
                                        </Label>
                                        <Textarea
                                            id="propertyMemo"
                                            placeholder="社内メモを入力してください"
                                            value={formData.propertyMemo}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "propertyMemo",
                                                    e.target.value
                                                )
                                            }
                                            rows={2}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="constructionManager"
                                                className="text-sm font-medium"
                                            >
                                                工務担当
                                            </Label>
                                            <Input
                                                id="constructionManager"
                                                placeholder="例:鈴木太郎"
                                                value={
                                                    formData.constructionManager
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "constructionManager",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="constructionManagerPhone"
                                                className="text-sm font-medium"
                                            >
                                                工務担当者電話番号
                                            </Label>
                                            <Input
                                                id="constructionManagerPhone"
                                                placeholder="例:090-1234-5678"
                                                value={
                                                    formData.constructionManagerPhone
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "constructionManagerPhone",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 納品先情報 */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        納品先情報
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="deliveryDestinationType"
                                                className="text-sm font-medium"
                                            >
                                                納品先区分{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Select
                                                value={
                                                    formData.deliveryDestinationType
                                                }
                                                onValueChange={(value) =>
                                                    handleInputChange(
                                                        "deliveryDestinationType",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">
                                                        現場
                                                    </SelectItem>
                                                    <SelectItem value="3">
                                                        事務所
                                                    </SelectItem>
                                                    <SelectItem value="4">
                                                        その他
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="deliveryPostalCode"
                                                className="text-sm font-medium"
                                            >
                                                納品先郵便番号{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="deliveryPostalCode"
                                                placeholder="例:1234567"
                                                value={
                                                    formData.deliveryPostalCode
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "deliveryPostalCode",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                                        <div className="space-y-2 md:col-span-2">
                                            <Label
                                                htmlFor="deliveryPrefecture"
                                                className="text-sm font-medium"
                                            >
                                                納品先都道府県{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="deliveryPrefecture"
                                                placeholder="例:東京都"
                                                value={
                                                    formData.deliveryPrefecture
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "deliveryPrefecture",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-3">
                                            <Label
                                                htmlFor="deliveryAddress"
                                                className="text-sm font-medium"
                                            >
                                                納品先住所{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="deliveryAddress"
                                                placeholder="例:千代田区霞が関1-2-3※都道府県は不要です"
                                                value={formData.deliveryAddress}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "deliveryAddress",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="deliveryPhone"
                                                className="text-sm font-medium"
                                            >
                                                納品先電話番号{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="deliveryPhone"
                                                value={formData.deliveryPhone}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "deliveryPhone",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="deliveryName"
                                                className="text-sm font-medium"
                                            >
                                                納品先宛名
                                            </Label>
                                            <Input
                                                id="deliveryName"
                                                value={formData.deliveryName}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "deliveryName",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 連絡方法 */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold mb-4">
                                        連絡方法
                                    </h3>

                                    <div className="space-y-4">
                                        <RadioGroup
                                            value={formData.contactMethod}
                                            onValueChange={(value) =>
                                                handleInputChange(
                                                    "contactMethod",
                                                    value
                                                )
                                            }
                                        >
                                            <div className="flex space-x-6">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="fax"
                                                        id="fax-radio"
                                                    />
                                                    <Label htmlFor="fax-radio">
                                                        FAX
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="email"
                                                        id="email-radio"
                                                    />
                                                    <Label htmlFor="email-radio">
                                                        メール
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="person"
                                                        id="person-radio"
                                                    />
                                                    <Label htmlFor="person-radio">
                                                        担当者
                                                    </Label>
                                                </div>
                                            </div>
                                        </RadioGroup>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="fax"
                                                    className="text-sm font-medium flex items-center gap-1"
                                                >
                                                    <Phone className="h-4 w-4" />
                                                    FAX番号
                                                </Label>
                                                <Input
                                                    id="fax"
                                                    placeholder="例: 03-1234-5678"
                                                    value={formData.fax}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "fax",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="deliveryResponsePerson"
                                                    className="text-sm font-medium flex items-center gap-1"
                                                >
                                                    <User className="h-4 w-4" />
                                                    納期回答担当者
                                                </Label>
                                                <Input
                                                    id="deliveryResponsePerson"
                                                    placeholder="例: 山田太郎"
                                                    value={
                                                        formData.deliveryResponsePerson
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "deliveryResponsePerson",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="email"
                                                    className="text-sm font-medium flex items-center gap-1"
                                                >
                                                    <Mail className="h-4 w-4" />
                                                    メールアドレス
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="例: example@example.com"
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="email2"
                                                    className="text-sm font-medium flex items-center gap-1"
                                                >
                                                    <Mail className="h-4 w-4" />
                                                    メールアドレス2
                                                </Label>
                                                <Input
                                                    id="email2"
                                                    type="email"
                                                    placeholder="例: example2@example.com"
                                                    value={formData.email2}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "email2",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="email3"
                                                className="text-sm font-medium flex items-center gap-1"
                                            >
                                                <Mail className="h-4 w-4" />
                                                メールアドレス3
                                            </Label>
                                            <Input
                                                id="email3"
                                                type="email"
                                                placeholder="例: example3@example.com"
                                                value={formData.email3}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "email3",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="emailCc1"
                                                    className="text-sm font-medium"
                                                >
                                                    CCメールアドレス1
                                                </Label>
                                                <Input
                                                    id="emailCc1"
                                                    type="email"
                                                    placeholder="例: cc1@example.com"
                                                    value={formData.emailCc1}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "emailCc1",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="emailCc2"
                                                    className="text-sm font-medium"
                                                >
                                                    CCメールアドレス2
                                                </Label>
                                                <Input
                                                    id="emailCc2"
                                                    type="email"
                                                    placeholder="例: cc2@example.com"
                                                    value={formData.emailCc2}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "emailCc2",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="emailCc3"
                                                    className="text-sm font-medium"
                                                >
                                                    CCメールアドレス3
                                                </Label>
                                                <Input
                                                    id="emailCc3"
                                                    type="email"
                                                    placeholder="例: cc3@example.com"
                                                    value={formData.emailCc3}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "emailCc3",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="deliveryMemo"
                                                className="text-sm font-medium"
                                            >
                                                送り状備考
                                            </Label>
                                            <Textarea
                                                id="deliveryMemo"
                                                value={formData.deliveryMemo}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "deliveryMemo",
                                                        e.target.value
                                                    )
                                                }
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center pt-6">
                                    <Button
                                        onClick={switchToDetailsTab}
                                        size="lg"
                                        className="px-8 py-3 text-lg"
                                    >
                                        明細情報へ（Ctrl+Shift+X）
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* 明細情報タブ */}
                            <TabsContent
                                value="details"
                                className="space-y-6 mt-6"
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">
                                        受注明細
                                    </h3>
                                    <Button
                                        onClick={addOrderDetail}
                                        className="flex items-center gap-2"
                                        variant="outline"
                                    >
                                        <Plus className="h-4 w-4" />
                                        新規
                                    </Button>
                                </div>

                                {orderDetails.map((detail, index) => (
                                    <Card
                                        key={detail.id}
                                        className="border-2 border-gray-200"
                                    >
                                        <CardHeader className="bg-gray-50 pb-3">
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-lg">
                                                    明細 #{index + 1}
                                                </CardTitle>
                                                {orderDetails.length > 1 && (
                                                    <Button
                                                        onClick={() =>
                                                            removeOrderDetail(
                                                                index
                                                            )
                                                        }
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
                                            {/* 商品検索・商品名 */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        商品検索
                                                    </Label>
                                                    <Select
                                                        value={
                                                            detail.productSearch
                                                        }
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            handleDetailChange(
                                                                index,
                                                                "productSearch",
                                                                value
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="品番または商品名で商品の候補を表示します" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="product1">
                                                                品番: ABC123 |
                                                                商品名:
                                                                サンプル商品1
                                                            </SelectItem>
                                                            <SelectItem value="product2">
                                                                品番: DEF456 |
                                                                商品名:
                                                                サンプル商品2
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        商品名{" "}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        placeholder="例：ｱｸﾘﾙ防水ﾃｰﾌﾟ[片面][75mm][20m巻]"
                                                        value={
                                                            detail.productName
                                                        }
                                                        onChange={(e) =>
                                                            handleDetailChange(
                                                                index,
                                                                "productName",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* 発注品番・仕様コード */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        発注品番
                                                    </Label>
                                                    <Input
                                                        placeholder="別注品は自動採番されます"
                                                        value={
                                                            detail.officialProductCode
                                                        }
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
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        仕様コード
                                                    </Label>
                                                    <Input
                                                        placeholder="別注品は自動採番されます"
                                                        value={
                                                            detail.specificationCode
                                                        }
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
                                            </div>

                                            {/* 受注数量・別注品フラグ */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        受注数量{" "}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={detail.quantity}
                                                        onChange={(e) =>
                                                            handleDetailChange(
                                                                index,
                                                                "quantity",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        別注品フラグ
                                                    </Label>
                                                    <RadioGroup
                                                        value={
                                                            detail.specialOrderFlag
                                                        }
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            handleDetailChange(
                                                                index,
                                                                "specialOrderFlag",
                                                                value
                                                            )
                                                        }
                                                        className="flex space-x-4"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value="0"
                                                                id={`normal-${index}`}
                                                            />
                                                            <Label
                                                                htmlFor={`normal-${index}`}
                                                            >
                                                                通常品
                                                            </Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value="1"
                                                                id={`special-${index}`}
                                                            />
                                                            <Label
                                                                htmlFor={`special-${index}`}
                                                            >
                                                                別注品
                                                            </Label>
                                                        </div>
                                                    </RadioGroup>
                                                </div>
                                            </div>

                                            {/* 納品希望日・商品区分 */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        納品希望日{" "}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        type="date"
                                                        value={
                                                            detail.desiredPurchaseDate
                                                        }
                                                        onChange={(e) =>
                                                            handleDetailChange(
                                                                index,
                                                                "desiredPurchaseDate",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        商品区分
                                                    </Label>
                                                    <RadioGroup
                                                        value={
                                                            detail.frequencyCategory
                                                        }
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            handleDetailChange(
                                                                index,
                                                                "frequencyCategory",
                                                                value
                                                            )
                                                        }
                                                        className="flex space-x-4"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value="1"
                                                                id={`stock-${index}`}
                                                            />
                                                            <Label
                                                                htmlFor={`stock-${index}`}
                                                            >
                                                                在庫品
                                                            </Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value="2"
                                                                id={`custom-${index}`}
                                                            />
                                                            <Label
                                                                htmlFor={`custom-${index}`}
                                                            >
                                                                邸別品
                                                            </Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value="3"
                                                                id={`direct-${index}`}
                                                            />
                                                            <Label
                                                                htmlFor={`direct-${index}`}
                                                            >
                                                                直送品
                                                            </Label>
                                                        </div>
                                                    </RadioGroup>
                                                </div>
                                            </div>

                                            {/* 入荷日・重量・単位 */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        入荷日
                                                    </Label>
                                                    <Input
                                                        type="date"
                                                        value={
                                                            detail.arrivalDate
                                                        }
                                                        onChange={(e) =>
                                                            handleDetailChange(
                                                                index,
                                                                "arrivalDate",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        重量(kg)
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        placeholder="例: 25.5"
                                                        value={
                                                            detail.unitWeight
                                                        }
                                                        onChange={(e) =>
                                                            handleDetailChange(
                                                                index,
                                                                "unitWeight",
                                                                e.target.value
                                                            )
                                                        }
                                                        step="0.1"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        単位
                                                    </Label>
                                                    <Input
                                                        placeholder="例：ｾｯﾄ"
                                                        value={detail.unit}
                                                        onChange={(e) =>
                                                            handleDetailChange(
                                                                index,
                                                                "unit",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* 運送業者・荷受人 */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        運送業者
                                                    </Label>
                                                    <Select
                                                        value={
                                                            detail.carrierCode
                                                        }
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            handleDetailChange(
                                                                index,
                                                                "carrierCode",
                                                                value
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="1000">
                                                                運送業者コード:1000
                                                                - ヤマト運輸
                                                            </SelectItem>
                                                            <SelectItem value="1001">
                                                                運送業者コード:1001
                                                                - 佐川急便
                                                            </SelectItem>
                                                            <SelectItem value="1002">
                                                                運送業者コード:1002
                                                                - 日本郵便
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        荷受人
                                                    </Label>
                                                    <Input
                                                        placeholder="例：山田 太郎"
                                                        value={detail.shipper}
                                                        onChange={(e) =>
                                                            handleDetailChange(
                                                                index,
                                                                "shipper",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        荷受人電話番号
                                                    </Label>
                                                    <Input
                                                        placeholder="例：090-1234-5678"
                                                        value={
                                                            detail.shipperPhone
                                                        }
                                                        onChange={(e) =>
                                                            handleDetailChange(
                                                                index,
                                                                "shipperPhone",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* 単価情報 */}
                                            <div className="border-t pt-4">
                                                <h4 className="text-md font-medium mb-3">
                                                    単価情報
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium">
                                                            受注単価
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            value={
                                                                detail.orderUnitPrice
                                                            }
                                                            onChange={(e) =>
                                                                handleDetailChange(
                                                                    index,
                                                                    "orderUnitPrice",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            step="0.01"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium">
                                                            受注金額
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            value={
                                                                detail.totalPrice
                                                            }
                                                            onChange={(e) =>
                                                                handleDetailChange(
                                                                    index,
                                                                    "totalPrice",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            readOnly
                                                            className="bg-gray-100"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium">
                                                            納品単価
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            value={
                                                                detail.deliveryUnitPrice
                                                            }
                                                            onChange={(e) =>
                                                                handleDetailChange(
                                                                    index,
                                                                    "deliveryUnitPrice",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            step="0.01"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium">
                                                            納品金額
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            value={
                                                                detail.totalDeliveryUnitPrice
                                                            }
                                                            onChange={(e) =>
                                                                handleDetailChange(
                                                                    index,
                                                                    "totalDeliveryUnitPrice",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            readOnly
                                                            className="bg-gray-100"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium">
                                                            客先単価
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            value={
                                                                detail.customerUnitPrice
                                                            }
                                                            onChange={(e) =>
                                                                handleDetailChange(
                                                                    index,
                                                                    "customerUnitPrice",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            step="0.01"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium">
                                                            客先金額
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            value={
                                                                detail.totalCustomerUnitPrice
                                                            }
                                                            onChange={(e) =>
                                                                handleDetailChange(
                                                                    index,
                                                                    "totalCustomerUnitPrice",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            readOnly
                                                            className="bg-gray-100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                <div className="text-center pt-6">
                                    <Button
                                        onClick={switchToBasicTab}
                                        variant="outline"
                                        size="lg"
                                        className="mr-4"
                                    >
                                        基本情報へ戻る（Ctrl+Shift+X）
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* フォームアクション */}
                        <div className="flex justify-center space-x-4 mt-8 pt-6 border-t">
                            <Button
                                onClick={handleSubmit}
                                size="lg"
                                className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700"
                            >
                                登録
                            </Button>
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                size="lg"
                                className="px-8 py-3 text-lg"
                            >
                                リセット
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OrderFormApp;
