<?php
/**
 * Set error reporting
 */
error_reporting(-1);
ini_set('display_errors', 1);

/**
 * Website document root
 */
define('DOCROOT', __DIR__.DIRECTORY_SEPARATOR);

/**
 * Path to the application directory.
 */
define('APPPATH', realpath(__DIR__.'/../fuel/app/').DIRECTORY_SEPARATOR);

// シンプルなオートローダー
spl_autoload_register(function ($class) {
    $class = ltrim($class, '\\');
    $file = '';
    
    if ($lastNsPos = strrpos($class, '\\')) {
        $namespace = substr($class, 0, $lastNsPos);
        $class = substr($class, $lastNsPos + 1);
        $file = str_replace('\\', DIRECTORY_SEPARATOR, $namespace) . DIRECTORY_SEPARATOR;
    }
    
    $file .= str_replace('_', DIRECTORY_SEPARATOR, $class) . '.php';
    
    // アプリケーションクラスの読み込み
    $appFile = APPPATH . 'classes' . DIRECTORY_SEPARATOR . strtolower($file);
    if (file_exists($appFile)) {
        require $appFile;
        return true;
    }
    
    return false;
});

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