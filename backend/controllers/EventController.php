<?php
// controllers/EventController.php

require_once __DIR__ . '/../models/Events.php';

class EventController {
    private $db;
    private $events;

    public function __construct($pdo) {
        $this->db = $pdo;
        $this->events = new Events($this->db);
    }

    public function create($data) {
        header("Content-Type: application/json");

        // Validate required fields
        if (!isset($data['user_id'], $data['title'], $data['start_datetime'], $data['end_datetime'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
            return;
        }

        $user_id = $data['user_id'];
        $title = trim($data['title']);
        $description = trim($data['description'] ?? "");
        $start_datetime = $data['start_datetime'];
        $end_datetime = $data['end_datetime'];

        // Create the event
        $event_id = $this->events->createEvent($user_id, $title, $description, $start_datetime, $end_datetime);

        if ($event_id) {
            echo json_encode(["success" => true, "event_id" => $event_id]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Could not create event"]);
        }
    }

    public function list($user_id) {
        header("Content-Type: application/json");
        $events = $this->events->getEventsByUser($user_id);
        echo json_encode($events);
    }
}