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
        if (!Schema::hasTable('order_details')) {
            Schema::create('order_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->text('product_search')->nullable();
            $table->text('product_name')->nullable();
            $table->text('official_product_code')->nullable();
            $table->text('specification_code')->nullable();
            $table->integer('quantity')->nullable();
            $table->text('special_order_flag')->nullable();
            $table->text('desired_purchase_date')->nullable();
            $table->text('frequency_category')->nullable();
            $table->text('arrival_date')->nullable();
            $table->text('unit_weight')->nullable();
            $table->text('unit')->nullable();
            $table->text('carrier_code')->nullable();
            $table->text('order_unit_price')->nullable();
            $table->text('total_price')->nullable();
            $table->text('delivery_unit_price')->nullable();
            $table->text('total_delivery_unit_price')->nullable();
            $table->text('customer_unit_price')->nullable();
            $table->text('total_customer_unit_price')->nullable();
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
        Schema::dropIfExists('order_details');
    }
};
