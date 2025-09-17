<?php

// Simple database connection helper
class DB {
    private static $connection = null;

    public static function getConnection() {
        if (self::$connection === null) {
            try {
                // 本番環境とローカル環境でデータベース設定を分ける
                if (getenv('DATABASE_URL')) {
                    // 本番環境: PostgreSQL/MySQL
                    self::$connection = new PDO(getenv('DATABASE_URL'));
                } else {
                    // ローカル環境: SQLite
                    $dbPath = getenv('DB_PATH') ?: __DIR__ . '/../../../../orders.db';
                    self::$connection = new PDO('sqlite:' . $dbPath);
                }

                self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::createTables();
            } catch (PDOException $e) {
                throw new Exception('Database connection failed: ' . $e->getMessage());
            }
        }
        return self::$connection;
    }

    public static function createTables() {
        $conn = self::getConnection();

        // Create orders table
        $conn->exec("CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            receive_order_date TEXT,
            contract_number TEXT,
            max_vehicle TEXT,
            store_code TEXT,
            house_name TEXT,
            property_postal_code TEXT,
            property_prefecture TEXT,
            property_address TEXT,
            property_memo TEXT,
            construction_manager TEXT,
            construction_manager_phone TEXT,
            delivery_destination_type TEXT,
            delivery_postal_code TEXT,
            delivery_prefecture TEXT,
            delivery_address TEXT,
            delivery_phone TEXT,
            delivery_name TEXT,
            contact_method TEXT,
            fax TEXT,
            email TEXT,
            email2 TEXT,
            email3 TEXT,
            email_cc1 TEXT,
            email_cc2 TEXT,
            email_cc3 TEXT,
            delivery_response_person TEXT,
            delivery_memo TEXT,
            created_at DATETIME,
            updated_at DATETIME
        )");

        // Create order_details table
        $conn->exec("CREATE TABLE IF NOT EXISTS order_details (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_search TEXT,
            product_name TEXT,
            official_product_code TEXT,
            specification_code TEXT,
            quantity INTEGER,
            special_order_flag TEXT,
            desired_purchase_date TEXT,
            frequency_category TEXT,
            arrival_date TEXT,
            unit_weight TEXT,
            unit TEXT,
            carrier_code TEXT,
            order_unit_price TEXT,
            total_price TEXT,
            delivery_unit_price TEXT,
            total_delivery_unit_price TEXT,
            customer_unit_price TEXT,
            total_customer_unit_price TEXT,
            created_at DATETIME,
            updated_at DATETIME,
            FOREIGN KEY (order_id) REFERENCES orders(id)
        )");
    }
}

class Controller_Api_Orders
{
    private function response($data, $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    public function post_create()
    {
        try {
            // リクエストデータを取得
            $input = json_decode(file_get_contents('php://input'), true);

            if (empty($input)) {
                return $this->response(array(
                    'success' => false,
                    'message' => 'データが送信されていません'
                ), 400);
            }

            // 基本的なバリデーション
            if (empty($input['formData']['receiveOrderDate'])) {
                return $this->response(array(
                    'success' => false,
                    'message' => '受注日は必須です'
                ), 400);
            }

            $conn = DB::getConnection();
            $conn->beginTransaction();

            // 受注メインテーブルに挿入
            $stmt = $conn->prepare("INSERT INTO orders (
                receive_order_date, contract_number, max_vehicle, store_code, house_name,
                property_postal_code, property_prefecture, property_address, property_memo,
                construction_manager, construction_manager_phone, delivery_destination_type,
                delivery_postal_code, delivery_prefecture, delivery_address, delivery_phone,
                delivery_name, contact_method, fax, email, email2, email3, email_cc1,
                email_cc2, email_cc3, delivery_response_person, delivery_memo,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            $stmt->execute([
                $input['formData']['receiveOrderDate'],
                $input['formData']['contractNumber'] ?? '',
                $input['formData']['maxVehicle'] ?? '',
                $input['formData']['storeCode'] ?? '',
                $input['formData']['houseName'] ?? '',
                $input['formData']['propertyPostalCode'] ?? '',
                $input['formData']['propertyPrefecture'] ?? '',
                $input['formData']['propertyAddress'] ?? '',
                $input['formData']['propertyMemo'] ?? '',
                $input['formData']['constructionManager'] ?? '',
                $input['formData']['constructionManagerPhone'] ?? '',
                $input['formData']['deliveryDestinationType'] ?? '',
                $input['formData']['deliveryPostalCode'] ?? '',
                $input['formData']['deliveryPrefecture'] ?? '',
                $input['formData']['deliveryAddress'] ?? '',
                $input['formData']['deliveryPhone'] ?? '',
                $input['formData']['deliveryName'] ?? '',
                $input['formData']['contactMethod'] ?? '',
                $input['formData']['fax'] ?? '',
                $input['formData']['email'] ?? '',
                $input['formData']['email2'] ?? '',
                $input['formData']['email3'] ?? '',
                $input['formData']['emailCc1'] ?? '',
                $input['formData']['emailCc2'] ?? '',
                $input['formData']['emailCc3'] ?? '',
                $input['formData']['deliveryResponsePerson'] ?? '',
                $input['formData']['deliveryMemo'] ?? '',
                date('Y-m-d H:i:s'),
                date('Y-m-d H:i:s')
            ]);

            $order_id = $conn->lastInsertId();

            // 受注明細テーブルに挿入
            $detailStmt = $conn->prepare("INSERT INTO order_details (
                order_id, product_search, product_name, official_product_code,
                specification_code, quantity, special_order_flag, desired_purchase_date,
                frequency_category, arrival_date, unit_weight, unit, carrier_code,
                order_unit_price, total_price, delivery_unit_price, total_delivery_unit_price,
                customer_unit_price, total_customer_unit_price, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            foreach ($input['orderDetails'] as $detail) {
                $detailStmt->execute([
                    $order_id,
                    $detail['productSearch'] ?? '',
                    $detail['productName'] ?? '',
                    $detail['officialProductCode'] ?? '',
                    $detail['specificationCode'] ?? '',
                    $detail['quantity'] ?? 0,
                    $detail['specialOrderFlag'] ?? '',
                    $detail['desiredPurchaseDate'] ?? '',
                    $detail['frequencyCategory'] ?? '',
                    $detail['arrivalDate'] ?? '',
                    $detail['unitWeight'] ?? '',
                    $detail['unit'] ?? '',
                    $detail['carrierCode'] ?? '',
                    $detail['orderUnitPrice'] ?? '',
                    $detail['totalPrice'] ?? '',
                    $detail['deliveryUnitPrice'] ?? '',
                    $detail['totalDeliveryUnitPrice'] ?? '',
                    $detail['customerUnitPrice'] ?? '',
                    $detail['totalCustomerUnitPrice'] ?? '',
                    date('Y-m-d H:i:s'),
                    date('Y-m-d H:i:s')
                ]);
            }

            // コミット
            $conn->commit();

            return $this->response(array(
                'success' => true,
                'message' => '受注が正常に登録されました',
                'order_id' => $order_id
            ), 200);

        } catch (Exception $e) {
            // ロールバック
            if (isset($conn)) {
                $conn->rollback();
            }

            return $this->response(array(
                'success' => false,
                'message' => 'データベースエラーが発生しました: ' . $e->getMessage()
            ), 500);
        }
    }

    public function get_list()
    {
        try {
            $conn = DB::getConnection();

            // 受注一覧を取得
            $stmt = $conn->prepare("SELECT * FROM orders ORDER BY created_at DESC");
            $stmt->execute();
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $this->response(array(
                'success' => true,
                'orders' => $orders
            ), 200);

        } catch (Exception $e) {
            return $this->response(array(
                'success' => false,
                'message' => 'データ取得エラー: ' . $e->getMessage()
            ), 500);
        }
    }
}