<?php
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

    public function update($data) {
        if (empty($data['id']) || empty($data['title']) || empty($data['start_datetime']) || empty($data['end_datetime'])) {
            http_response_code(400);
            return ["success" => false, "message" => "Missing required fields (id, title, start_datetime, end_datetime)"];
        }

        try {
            $ok = $this->events->updateEvent(
                $data['id'],
                trim($data['title']),
                trim($data['description'] ?? ''),
                trim($data['start_datetime']),
                trim($data['end_datetime'])
            );

            if ($ok) {
                http_response_code(200);
                return ["success" => true];
            } else {
                http_response_code(404);
                return ["success" => false, "message" => "Event not found or you don't have permission"];
            }
        } catch (Exception $e) {
            http_response_code(500);
            return ["success" => false, "message" => "Database error: " . $e->getMessage()];
        }
    }

    public function delete($data) {
        if (empty($data['id'])) {
            http_response_code(400);
            return ["success" => false, "message" => "Missing event id"];
        }

        try {
            $ok = $this->events->deleteEvent($data['id']);
            if ($ok) {
                http_response_code(200);
                return ["success" => true];
            } else {
                http_response_code(404);
                return ["success" => false, "message" => "Event not found or you don't have permission"];
            }
        } catch (Exception $e) {
            http_response_code(500);
            return ["success" => false, "message" => "Database error: " . $e->getMessage()];
        }
    }
}