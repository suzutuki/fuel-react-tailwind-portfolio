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

const OrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/orders');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                setOrders(result.orders || []);
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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">受注一覧</h1>
                    <p className="text-gray-600">保存された受注情報を確認できます</p>
                </div>

                {orders.length === 0 ? (
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">まだ受注データがありません</p>
                                <Button onClick={fetchOrders} variant="outline">
                                    再読み込み
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardHeader 
                                    onClick={() => handleOrderClick(order)}
                                    className="pb-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">
                                            受注ID: {order.id}
                                        </CardTitle>
                                        <div className="text-sm text-gray-500">
                                            {formatDate(order.created_at)}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">契約番号:</span> {order.formData.contractNumber || '未設定'}
                                        </div>
                                        <div>
                                            <span className="font-medium">物件名:</span> {order.formData.houseName || '未設定'}
                                        </div>
                                        <div>
                                            <span className="font-medium">アイテム数:</span> {order.orderDetails.length}件
                                        </div>
                                    </div>
                                </CardHeader>

                                {selectedOrder?.id === order.id && (
                                    <CardContent className="border-t bg-gray-50">
                                        <div className="space-y-6 pt-4">
                                            {/* 基本情報 */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 text-gray-900">基本情報</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div><span className="font-medium">受注日:</span> {order.formData.receiveOrderDate}</div>
                                                    <div><span className="font-medium">契約番号:</span> {order.formData.contractNumber}</div>
                                                    <div><span className="font-medium">最大車輌:</span> {order.formData.maxVehicle}</div>
                                                    <div><span className="font-medium">店コード:</span> {order.formData.storeCode}</div>
                                                </div>
                                            </div>

                                            {/* 物件情報 */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 text-gray-900">物件情報</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div><span className="font-medium">物件名:</span> {order.formData.houseName}</div>
                                                    <div><span className="font-medium">郵便番号:</span> {order.formData.propertyPostalCode}</div>
                                                    <div><span className="font-medium">都道府県:</span> {order.formData.propertyPrefecture}</div>
                                                    <div><span className="font-medium">住所:</span> {order.formData.propertyAddress}</div>
                                                </div>
                                                {order.formData.propertyMemo && (
                                                    <div className="mt-2">
                                                        <span className="font-medium">メモ:</span> {order.formData.propertyMemo}
                                                    </div>
                                                )}
                                            </div>

                                            {/* 配送情報 */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 text-gray-900">配送情報</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div><span className="font-medium">配送先:</span> {order.formData.deliveryDestinationType}</div>
                                                    <div><span className="font-medium">配送先名:</span> {order.formData.deliveryName}</div>
                                                    <div><span className="font-medium">配送先電話:</span> {order.formData.deliveryPhone}</div>
                                                    <div><span className="font-medium">住所:</span> {order.formData.deliveryAddress}</div>
                                                </div>
                                            </div>

                                            {/* 受注明細 */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-3 text-gray-900">受注明細</h3>
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-100">
                                                            <tr>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">商品名</th>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">希望仕入日</th>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">単価</th>
                                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">合計</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {order.orderDetails.map((detail, index) => (
                                                                <tr key={index}>
                                                                    <td className="px-3 py-2 text-sm text-gray-900">{detail.productName || '未設定'}</td>
                                                                    <td className="px-3 py-2 text-sm text-gray-900">{detail.quantity}</td>
                                                                    <td className="px-3 py-2 text-sm text-gray-900">{detail.desiredPurchaseDate || '未設定'}</td>
                                                                    <td className="px-3 py-2 text-sm text-gray-900">{detail.orderUnitPrice || '未設定'}</td>
                                                                    <td className="px-3 py-2 text-sm text-gray-900">{detail.totalPrice || '未設定'}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                )}

                <div className="mt-6">
                    <Button onClick={fetchOrders} variant="outline">
                        再読み込み
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderList;