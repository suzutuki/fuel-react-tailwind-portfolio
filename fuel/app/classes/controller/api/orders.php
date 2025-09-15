<?php

class Controller_Api_Orders extends Controller_Rest
{
    public function post_create()
    {
        try {
            // リクエストデータを取得
            $input = Input::json();
            
            if (empty($input)) {
                return $this->response(array(
                    'success' => false,
                    'message' => 'データが送信されていません'
                ), 400);
            }

            // バリデーション
            $val = Validation::forge('order');
            $val->add_field('receiveOrderDate', '受注日', 'required');
            $val->add_field('contractNumber', '契約番号', 'max_length[50]');
            $val->add_field('storeCode', '店舗コード', 'max_length[20]');
            $val->add_field('houseName', '住宅名', 'max_length[100]');

            if (!$val->run($input['formData'])) {
                return $this->response(array(
                    'success' => false,
                    'message' => 'バリデーションエラー',
                    'errors' => $val->error()
                ), 400);
            }

            // トランザクション開始
            DB::start_transaction();

            // 受注メインテーブルに挿入
            $order_id = DB::insert('orders')->set(array(
                'receive_order_date' => $input['formData']['receiveOrderDate'],
                'contract_number' => $input['formData']['contractNumber'],
                'max_vehicle' => $input['formData']['maxVehicle'],
                'store_code' => $input['formData']['storeCode'],
                'house_name' => $input['formData']['houseName'],
                'property_postal_code' => $input['formData']['propertyPostalCode'],
                'property_prefecture' => $input['formData']['propertyPrefecture'],
                'property_address' => $input['formData']['propertyAddress'],
                'property_memo' => $input['formData']['propertyMemo'],
                'construction_manager' => $input['formData']['constructionManager'],
                'construction_manager_phone' => $input['formData']['constructionManagerPhone'],
                'delivery_destination_type' => $input['formData']['deliveryDestinationType'],
                'delivery_postal_code' => $input['formData']['deliveryPostalCode'],
                'delivery_prefecture' => $input['formData']['deliveryPrefecture'],
                'delivery_address' => $input['formData']['deliveryAddress'],
                'delivery_phone' => $input['formData']['deliveryPhone'],
                'delivery_name' => $input['formData']['deliveryName'],
                'contact_method' => $input['formData']['contactMethod'],
                'fax' => $input['formData']['fax'],
                'email' => $input['formData']['email'],
                'email2' => $input['formData']['email2'],
                'email3' => $input['formData']['email3'],
                'email_cc1' => $input['formData']['emailCc1'],
                'email_cc2' => $input['formData']['emailCc2'],
                'email_cc3' => $input['formData']['emailCc3'],
                'delivery_response_person' => $input['formData']['deliveryResponsePerson'],
                'delivery_memo' => $input['formData']['deliveryMemo'],
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ))->execute();

            // 受注明細テーブルに挿入
            foreach ($input['orderDetails'] as $detail) {
                DB::insert('order_details')->set(array(
                    'order_id' => $order_id[1],
                    'product_search' => $detail['productSearch'],
                    'product_name' => $detail['productName'],
                    'official_product_code' => $detail['officialProductCode'],
                    'specification_code' => $detail['specificationCode'],
                    'quantity' => $detail['quantity'],
                    'special_order_flag' => $detail['specialOrderFlag'],
                    'desired_purchase_date' => $detail['desiredPurchaseDate'],
                    'frequency_category' => $detail['frequencyCategory'],
                    'arrival_date' => $detail['arrivalDate'],
                    'unit_weight' => $detail['unitWeight'],
                    'unit' => $detail['unit'],
                    'carrier_code' => $detail['carrierCode'],
                    'shipper' => $detail['shipper'],
                    'shipper_phone' => $detail['shipperPhone'],
                    'order_unit_price' => $detail['orderUnitPrice'],
                    'total_price' => $detail['totalPrice'],
                    'delivery_unit_price' => $detail['deliveryUnitPrice'],
                    'total_delivery_unit_price' => $detail['totalDeliveryUnitPrice'],
                    'customer_unit_price' => $detail['customerUnitPrice'],
                    'total_customer_unit_price' => $detail['totalCustomerUnitPrice'],
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ))->execute();
            }

            // コミット
            DB::commit_transaction();

            return $this->response(array(
                'success' => true,
                'message' => '受注が正常に登録されました',
                'order_id' => $order_id[1]
            ), 200);

        } catch (Exception $e) {
            // ロールバック
            DB::rollback_transaction();
            
            return $this->response(array(
                'success' => false,
                'message' => 'データベースエラーが発生しました: ' . $e->getMessage()
            ), 500);
        }
    }

    public function get_list()
    {
        try {
            // 受注一覧を取得
            $orders = DB::select()->from('orders')
                ->order_by('created_at', 'desc')
                ->execute()
                ->as_array();

            // TODO(human): フロントエンドとの連携を完成させるため、
            // 各受注に対応する明細データも取得してフォーマットを整える処理をここに実装してください
            // ヒント: 受注データに orderDetails プロパティを追加し、
            // formData プロパティとして必要なフィールドを再構築する必要があります

            return $this->response(array(
                'success' => true,
                'orders' => $orders  // 'data' から 'orders' に変更
            ), 200);

        } catch (Exception $e) {
            return $this->response(array(
                'success' => false,
                'message' => 'データ取得エラー: ' . $e->getMessage()
            ), 500);
        }
    }
}