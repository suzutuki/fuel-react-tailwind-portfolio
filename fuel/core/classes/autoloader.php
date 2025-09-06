<?php

namespace Fuel\Core;

class Autoloader
{
    public static function init($config = array())
    {
        // シンプルなオートローダー
        spl_autoload_register(array('Autoloader', 'load'));
    }

    public static function load($class)
    {
        $class = ltrim($class, '\\');
        $fileName = '';
        $namespace = '';
        
        if ($lastNsPos = strrpos($class, '\\')) {
            $namespace = substr($class, 0, $lastNsPos);
            $class = substr($class, $lastNsPos + 1);
            $fileName = str_replace('\\', DIRECTORY_SEPARATOR, $namespace) . DIRECTORY_SEPARATOR;
        }
        
        $fileName .= str_replace('_', DIRECTORY_SEPARATOR, $class) . '.php';
        
        // アプリケーションクラスの読み込み
        $file = APPPATH . 'classes' . DIRECTORY_SEPARATOR . strtolower($fileName);
        if (file_exists($file)) {
            require $file;
            return true;
        }
        
        return false;
    }
}