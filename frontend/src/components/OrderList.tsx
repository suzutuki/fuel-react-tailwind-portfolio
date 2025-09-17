import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderDetail, FormData } from '@/types/orderForm';

interface Order {
    id: number;
    formData: FormData;
    orderDetails: OrderDetail[];
    created_at: string;
    updated_at: string;
}

interface ApiOrder {
    id: number;
    receive_order_date: string;
    contract_number: string;
    max_vehicle: string;
    store_code: string;
    house_name: string;
    property_postal_code: string;
    property_prefecture: string;
    property_address: string;
    property_memo: string;
    construction_manager: string;
    construction_manager_phone: string;
    delivery_destination_type: string;
    delivery_postal_code: string;
    delivery_prefecture: string;
    delivery_address: string;
    delivery_phone: string;
    delivery_name: string;
    contact_method: string;
    fax: string;
    email: string;
    email2: string;
    email3: string;
    email_cc1: string;
    email_cc2: string;
    email_cc3: string;
    delivery_response_person: string;
    delivery_memo: string;
    created_at: string;
    updated_at: string;
    order_details: Array<{
        id: number;
        order_id: number;
        product_search: string;
        product_name: string;
        official_product_code: string;
        specification_code: string;
        quantity: number;
        special_order_flag: string;
        desired_purchase_date: string;
        frequency_category: string;
        arrival_date: string;
        unit_weight: string;
        unit: string;
        carrier_code: string;
        order_unit_price: string;
        total_price: string;
        delivery_unit_price: string;
        total_delivery_unit_price: string;
        customer_unit_price: string;
        total_customer_unit_price: string;
        created_at: string;
        updated_at: string;
    }>;
}

const OrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const convertApiOrderToOrder = (apiOrder: ApiOrder): Order => {
        return {
            id: apiOrder.id,
            created_at: apiOrder.created_at,
            updated_at: apiOrder.updated_at,
            formData: {
                receiveOrderDate: apiOrder.receive_order_date,
                contractNumber: apiOrder.contract_number,
                maxVehicle: apiOrder.max_vehicle,
                storeCode: apiOrder.store_code,
                houseName: apiOrder.house_name,
                propertyPostalCode: apiOrder.property_postal_code,
                propertyPrefecture: apiOrder.property_prefecture,
                propertyAddress: apiOrder.property_address,
                propertyMemo: apiOrder.property_memo,
                constructionManager: apiOrder.construction_manager,
                constructionManagerPhone: apiOrder.construction_manager_phone,
                deliveryDestinationType: apiOrder.delivery_destination_type,
                deliveryPostalCode: apiOrder.delivery_postal_code,
                deliveryPrefecture: apiOrder.delivery_prefecture,
                deliveryAddress: apiOrder.delivery_address,
                deliveryPhone: apiOrder.delivery_phone,
                deliveryName: apiOrder.delivery_name,
                contactMethod: apiOrder.contact_method,
                fax: apiOrder.fax,
                email: apiOrder.email,
                email2: apiOrder.email2,
                email3: apiOrder.email3,
                emailCc1: apiOrder.email_cc1,
                emailCc2: apiOrder.email_cc2,
                emailCc3: apiOrder.email_cc3,
                deliveryResponsePerson: apiOrder.delivery_response_person,
                deliveryMemo: apiOrder.delivery_memo
            },
            orderDetails: apiOrder.order_details.map(detail => ({
                productSearch: detail.product_search,
                productName: detail.product_name,
                officialProductCode: detail.official_product_code,
                specificationCode: detail.specification_code,
                quantity: detail.quantity,
                specialOrderFlag: detail.special_order_flag,
                desiredPurchaseDate: detail.desired_purchase_date,
                frequencyCategory: detail.frequency_category,
                arrivalDate: detail.arrival_date,
                unitWeight: detail.unit_weight,
                unit: detail.unit,
                carrierCode: detail.carrier_code,
                orderUnitPrice: detail.order_unit_price,
                totalPrice: detail.total_price,
                deliveryUnitPrice: detail.delivery_unit_price,
                totalDeliveryUnitPrice: detail.total_delivery_unit_price,
                customerUnitPrice: detail.customer_unit_price,
                totalCustomerUnitPrice: detail.total_customer_unit_price
            }))
        };
    };

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/orders/list');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                const convertedOrders = result.orders.map((apiOrder: ApiOrder) => convertApiOrderToOrder(apiOrder));
                setOrders(convertedOrders);
            } else {
                throw new Error(result.message || '受注一覧の取得に失敗しました');
            }
        } catch (error) {
            console.error('Fetch orders error:', error);
            setError(error instanceof Error ? error.message : '受注一覧の取得に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOrderClick = (order: Order) => {
        setSelectedOrder(selectedOrder?.id === order.id ? null : order);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">読み込み中...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-red-600 mb-4">{error}</p>
                                <Button onClick={fetchOrders} variant="outline">
                                    再読み込み
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">受注一覧</h1>
                    <p className="text-gray-500 text-sm">受注情報の確認</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">受注データがありません</p>
                        <Button onClick={fetchOrders} variant="outline" size="sm">
                            再読み込み
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {orders.map((order) => (
                            <div key={order.id}
                                 className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                 onClick={() => handleOrderClick(order)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-blue-600">
                                            #{order.id}
                                        </span>
                                        <span className="text-sm text-gray-900">
                                            {order.formData.houseName || '物件名未設定'}
                                        </span>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {order.orderDetails.length}件
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {formatDate(order.created_at)}
                                    </div>
                                </div>

                                {selectedOrder?.id === order.id && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="space-y-2 text-sm">
                                                <div><span className="text-gray-500">契約番号:</span> {order.formData.contractNumber || '未設定'}</div>
                                                <div><span className="text-gray-500">受注日:</span> {order.formData.receiveOrderDate || '未設定'}</div>
                                                <div><span className="text-gray-500">配送先:</span> {order.formData.deliveryName || '未設定'}</div>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div><span className="text-gray-500">店コード:</span> {order.formData.storeCode || '未設定'}</div>
                                                <div><span className="text-gray-500">最大車輌:</span> {order.formData.maxVehicle || '未設定'}</div>
                                                <div><span className="text-gray-500">電話:</span> {order.formData.deliveryPhone || '未設定'}</div>
                                            </div>
                                        </div>

                                        {order.orderDetails.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">注文商品</h4>
                                                <div className="space-y-1">
                                                    {order.orderDetails.map((detail, index) => (
                                                        <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                                            <span>{detail.productName || '商品名未設定'}</span>
                                                            <span className="text-gray-500">{detail.quantity}個</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Button onClick={fetchOrders} variant="outline" size="sm">
                        再読み込み
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderList;