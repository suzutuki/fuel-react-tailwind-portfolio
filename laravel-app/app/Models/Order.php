<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'receive_order_date',
        'contract_number',
        'max_vehicle',
        'store_code',
        'house_name',
        'property_postal_code',
        'property_prefecture',
        'property_address',
        'property_memo',
        'construction_manager',
        'construction_manager_phone',
        'delivery_destination_type',
        'delivery_postal_code',
        'delivery_prefecture',
        'delivery_address',
        'delivery_phone',
        'delivery_name',
        'contact_method',
        'fax',
        'email',
        'email2',
        'email3',
        'email_cc1',
        'email_cc2',
        'email_cc3',
        'delivery_response_person',
        'delivery_memo'
    ];

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }
}
