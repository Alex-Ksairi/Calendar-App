<?php
require_once __DIR__ . "/../vendor/autoload.php";
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

define("JWT_SECRET", $_ENV['JWT_SECRET']);

function authenticate() {
    $headers = getallheaders();

    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Missing authorization header"]);
        exit;
    }

    $token = str_replace("Bearer ", "", $headers['Authorization']);

    try {
        $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
        $decoded_array = (array) $decoded;

        require_once __DIR__ . '/../models/User.php';
        $userModel = new User($GLOBALS['pdo']);
        $user = $userModel->getById($decoded_array['id']);

        return $user;
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid token"]);
        exit;
    }
}