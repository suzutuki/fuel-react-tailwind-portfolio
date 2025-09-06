<?php

namespace Fuel\Core;

class Fuel
{
    public static function init($config_path)
    {
        // オートローダーの初期化
        Autoloader::init();
        
        // リクエストの処理
        $controller = isset($_GET['c']) ? $_GET['c'] : 'welcome';
        $action = isset($_GET['a']) ? $_GET['a'] : 'index';
        
        $controller_class = 'Controller_' . ucfirst($controller);
        
        if (class_exists($controller_class)) {
            $controller_instance = new $controller_class;
            $method = 'action_' . $action;
            
            if (method_exists($controller_instance, $method)) {
                $controller_instance->$method();
            } else {
                echo "Action not found: $action";
            }
        } else {
            echo "Controller not found: $controller";
        }
    }
}