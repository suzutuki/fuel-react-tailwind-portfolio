<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_search',
        'product_name',
        'official_product_code',
        'specification_code',
        'quantity',
        'special_order_flag',
        'desired_purchase_date',
        'frequency_category',
        'arrival_date',
        'unit_weight',
        'unit',
        'carrier_code',
        'order_unit_price',
        'total_price',
        'delivery_unit_price',
        'total_delivery_unit_price',
        'customer_unit_price',
        'total_customer_unit_price'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
