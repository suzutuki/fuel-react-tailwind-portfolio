<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('orders')) {
            Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->text('receive_order_date')->nullable();
            $table->text('contract_number')->nullable();
            $table->text('max_vehicle')->nullable();
            $table->text('store_code')->nullable();
            $table->text('house_name')->nullable();
            $table->text('property_postal_code')->nullable();
            $table->text('property_prefecture')->nullable();
            $table->text('property_address')->nullable();
            $table->text('property_memo')->nullable();
            $table->text('construction_manager')->nullable();
            $table->text('construction_manager_phone')->nullable();
            $table->text('delivery_destination_type')->nullable();
            $table->text('delivery_postal_code')->nullable();
            $table->text('delivery_prefecture')->nullable();
            $table->text('delivery_address')->nullable();
            $table->text('delivery_phone')->nullable();
            $table->text('delivery_name')->nullable();
            $table->text('contact_method')->nullable();
            $table->text('fax')->nullable();
            $table->text('email')->nullable();
            $table->text('email2')->nullable();
            $table->text('email3')->nullable();
            $table->text('email_cc1')->nullable();
            $table->text('email_cc2')->nullable();
            $table->text('email_cc3')->nullable();
            $table->text('delivery_response_person')->nullable();
            $table->text('delivery_memo')->nullable();
            $table->timestamps();
        });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
