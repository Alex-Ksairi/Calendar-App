<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/config/db.php";
require_once __DIR__ . "/controllers/UserController.php";
require_once __DIR__ . "/controllers/EventController.php"; // NEW
require_once __DIR__ . "/routes/auth.php";

$controller = null;
$input = json_decode(file_get_contents("php://input"), true);
$action = $_GET["action"] ?? '';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if ($action === "register") {
        $controller = new UserController($pdo);
        echo json_encode($controller->register($input));
    } elseif ($action === "login") {
        $controller = new UserController($pdo);
        echo json_encode($controller->login($input));
    } elseif ($action === "create_event") { // NEW
        $controller = new EventController($pdo);
        echo json_encode($controller->create($input));
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Action not found"]);
    }
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    if ($action === "getProfile") {
        $userData = authenticate();
        echo json_encode(["status" => "success", "user" => $userData]);
    } elseif ($action === "list_events" && isset($_GET['user_id'])) { // NEW
        $controller = new EventController($pdo);
        $controller->list($_GET['user_id']);
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Action not found"]);
    }
}