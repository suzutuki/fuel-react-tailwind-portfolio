-- 受注メインテーブル
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receive_order_date DATE NOT NULL COMMENT '受注日',
    contract_number VARCHAR(50) COMMENT '契約番号',
    max_vehicle VARCHAR(20) COMMENT '最大車種',
    store_code VARCHAR(20) COMMENT '店舗コード',
    house_name VARCHAR(100) COMMENT '住宅名',
    property_postal_code VARCHAR(10) COMMENT '物件郵便番号',
    property_prefecture VARCHAR(20) COMMENT '物件都道府県',
    property_address TEXT COMMENT '物件住所',
    property_memo TEXT COMMENT '物件メモ',
    construction_manager VARCHAR(50) COMMENT '現場監督',
    construction_manager_phone VARCHAR(20) COMMENT '現場監督電話番号',
    delivery_destination_type VARCHAR(20) COMMENT '納品先種別',
    delivery_postal_code VARCHAR(10) COMMENT '納品先郵便番号',
    delivery_prefecture VARCHAR(20) COMMENT '納品先都道府県',
    delivery_address TEXT COMMENT '納品先住所',
    delivery_phone VARCHAR(20) COMMENT '納品先電話番号',
    delivery_name VARCHAR(100) COMMENT '納品先名',
    contact_method VARCHAR(20) COMMENT '連絡方法',
    fax VARCHAR(20) COMMENT 'FAX番号',
    email VARCHAR(100) COMMENT 'メールアドレス1',
    email2 VARCHAR(100) COMMENT 'メールアドレス2',
    email3 VARCHAR(100) COMMENT 'メールアドレス3',
    email_cc1 VARCHAR(100) COMMENT 'CCメールアドレス1',
    email_cc2 VARCHAR(100) COMMENT 'CCメールアドレス2',
    email_cc3 VARCHAR(100) COMMENT 'CCメールアドレス3',
    delivery_response_person VARCHAR(50) COMMENT '納期回答者',
    delivery_memo TEXT COMMENT '納期メモ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='受注メインテーブル';

-- 受注明細テーブル
CREATE TABLE IF NOT EXISTS order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL COMMENT '受注ID',
    product_search VARCHAR(100) COMMENT '商品検索',
    product_name VARCHAR(200) COMMENT '商品名',
    official_product_code VARCHAR(50) COMMENT '正式商品コード',
    specification_code VARCHAR(50) COMMENT '仕様コード',
    quantity DECIMAL(10,2) DEFAULT 0 COMMENT '数量',
    special_order_flag TINYINT(1) DEFAULT 0 COMMENT '特注フラグ',
    desired_purchase_date DATE COMMENT '希望購入日',
    frequency_category VARCHAR(20) COMMENT '頻度カテゴリ',
    arrival_date DATE COMMENT '到着日',
    unit_weight VARCHAR(20) COMMENT '単位重量',
    unit VARCHAR(10) COMMENT '単位',
    carrier_code VARCHAR(20) COMMENT '運送会社コード',
    shipper VARCHAR(100) COMMENT '荷主',
    shipper_phone VARCHAR(20) COMMENT '荷主電話番号',
    order_unit_price DECIMAL(10,2) COMMENT '発注単価',
    total_price DECIMAL(12,2) COMMENT '発注合計金額',
    delivery_unit_price DECIMAL(10,2) COMMENT '納品単価',
    total_delivery_unit_price DECIMAL(12,2) COMMENT '納品合計金額',
    customer_unit_price DECIMAL(10,2) COMMENT '客先単価',
    total_customer_unit_price DECIMAL(12,2) COMMENT '客先合計金額',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='受注明細テーブル';

-- インデックス作成
CREATE INDEX idx_orders_receive_date ON orders(receive_order_date);
CREATE INDEX idx_orders_contract_number ON orders(contract_number);
CREATE INDEX idx_orders_store_code ON orders(store_code);
CREATE INDEX idx_order_details_order_id ON order_details(order_id);
CREATE INDEX idx_order_details_product_code ON order_details(official_product_code);