<?php

class Controller_Welcome
{
    public function action_index()
    {
        // HTMLレスポンスを直接出力
        include APPPATH . 'views/welcome/index.php';
    }
}