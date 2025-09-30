<?php
require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . "/../routes/auth.php";
require_once __DIR__ . "/../vendor/autoload.php";

use Firebase\JWT\JWT;

class UserController {
    private $user;
    private $secretKey;

    public function __construct($pdo) {
        $this->user = new User($pdo);
        $this->secretKey = defined('JWT_SECRET') ? JWT_SECRET : 'your_default_secret';
    }

    public function register($data) {
        if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            return ["status" => "error", "message" => "All fields are required"];
        }

        if ($this->user->register($data['username'], $data['email'], $data['password'])) {
            http_response_code(201);
            return ["status" => "success", "message" => "User registered successfully"];
        }

        http_response_code(409);
        return ["status" => "error", "message" => "Email already exists!"];
    }

    public function login($data) {
        if (empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            return ["status" => "error", "message" => "Email and password are required"];
        }

        $user = $this->user->login($data['email'], $data['password']);
        if ($user) {
            $payload = [
                "id" => $user['id'],
                "email" => $user['email'],
                "username" => $user['username'],
                "exp" => time() + (60 * 60) // 1 hour expiry
            ];

            $token = JWT::encode($payload, $this->secretKey, 'HS256');

            http_response_code(200);
            return ["status" => "success", "token" => $token, "user" => $user];
        }

        http_response_code(401);
        return ["status" => "error", "message" => "Invalid email or password"];
    }
}
?>