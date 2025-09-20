<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of orders with their details.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $orders = Order::with('orderDetails')->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'orders' => $orders
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'データ取得エラー: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created order in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'formData.receiveOrderDate' => 'required',
                'orderDetails' => 'required|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => '受注日は必須です'
                ], 400);
            }

            DB::beginTransaction();

            $formData = $request->input('formData');

            $order = Order::create([
                'receive_order_date' => $formData['receiveOrderDate'],
                'contract_number' => $formData['contractNumber'] ?? '',
                'max_vehicle' => $formData['maxVehicle'] ?? '',
                'store_code' => $formData['storeCode'] ?? '',
                'house_name' => $formData['houseName'] ?? '',
                'property_postal_code' => $formData['propertyPostalCode'] ?? '',
                'property_prefecture' => $formData['propertyPrefecture'] ?? '',
                'property_address' => $formData['propertyAddress'] ?? '',
                'property_memo' => $formData['propertyMemo'] ?? '',
                'construction_manager' => $formData['constructionManager'] ?? '',
                'construction_manager_phone' => $formData['constructionManagerPhone'] ?? '',
                'delivery_destination_type' => $formData['deliveryDestinationType'] ?? '',
                'delivery_postal_code' => $formData['deliveryPostalCode'] ?? '',
                'delivery_prefecture' => $formData['deliveryPrefecture'] ?? '',
                'delivery_address' => $formData['deliveryAddress'] ?? '',
                'delivery_phone' => $formData['deliveryPhone'] ?? '',
                'delivery_name' => $formData['deliveryName'] ?? '',
                'contact_method' => $formData['contactMethod'] ?? '',
                'fax' => $formData['fax'] ?? '',
                'email' => $formData['email'] ?? '',
                'email2' => $formData['email2'] ?? '',
                'email3' => $formData['email3'] ?? '',
                'email_cc1' => $formData['emailCc1'] ?? '',
                'email_cc2' => $formData['emailCc2'] ?? '',
                'email_cc3' => $formData['emailCc3'] ?? '',
                'delivery_response_person' => $formData['deliveryResponsePerson'] ?? '',
                'delivery_memo' => $formData['deliveryMemo'] ?? '',
            ]);

            foreach ($request->input('orderDetails') as $detail) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_search' => $detail['productSearch'] ?? '',
                    'product_name' => $detail['productName'] ?? '',
                    'official_product_code' => $detail['officialProductCode'] ?? '',
                    'specification_code' => $detail['specificationCode'] ?? '',
                    'quantity' => $detail['quantity'] ?? 0,
                    'special_order_flag' => $detail['specialOrderFlag'] ?? '',
                    'desired_purchase_date' => $detail['desiredPurchaseDate'] ?? '',
                    'frequency_category' => $detail['frequencyCategory'] ?? '',
                    'arrival_date' => $detail['arrivalDate'] ?? '',
                    'unit_weight' => $detail['unitWeight'] ?? '',
                    'unit' => $detail['unit'] ?? '',
                    'carrier_code' => $detail['carrierCode'] ?? '',
                    'order_unit_price' => $detail['orderUnitPrice'] ?? '',
                    'total_price' => $detail['totalPrice'] ?? '',
                    'delivery_unit_price' => $detail['deliveryUnitPrice'] ?? '',
                    'total_delivery_unit_price' => $detail['totalDeliveryUnitPrice'] ?? '',
                    'customer_unit_price' => $detail['customerUnitPrice'] ?? '',
                    'total_customer_unit_price' => $detail['totalCustomerUnitPrice'] ?? '',
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => '受注が正常に登録されました',
                'order_id' => $order->id
            ], 200);

        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'success' => false,
                'message' => 'データベースエラーが発生しました: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
