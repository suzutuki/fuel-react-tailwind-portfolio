<?php
/**
 * Basic index.php for FuelPHP API endpoints
 */

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Enable CORS for development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Basic routing for API endpoints
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Remove query parameters and decode URL
$path = parse_url($request_uri, PHP_URL_PATH);
$path = urldecode($path);

// Remove base path if present
$base_path = '/fuel-react-app/fuel/public';
if (strpos($path, $base_path) === 0) {
    $path = substr($path, strlen($base_path));
}

// Route API requests
if (strpos($path, '/api/orders') === 0) {

    // Include the orders controller
    require_once '../app/classes/controller/api/orders.php';

    // Create controller instance
    $controller = new Controller_Api_Orders();

    try {
        if ($request_method === 'POST' && $path === '/api/orders/create') {
            $controller->post_create();
        } elseif ($request_method === 'GET' && $path === '/api/orders/list') {
            $controller->get_list();
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Internal server error: ' . $e->getMessage()]);
    }

} else {
    // Default response for non-API requests
    echo json_encode(['message' => 'FuelPHP API Server', 'status' => 'running']);
}
?>