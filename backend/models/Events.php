<?php
class Events {
    private $db;

    public function __construct($pdo) {
        $this->db = $pdo;
    }

    public function createEvent($user_id, $title, $description, $start_datetime, $end_datetime) {
        $sql = "INSERT INTO events (user_id, title, description, start_datetime, end_datetime, created_at, updated_at) 
                VALUES (:user_id, :title, :description, :start_datetime, :end_datetime, NOW(), NOW())";

        $stmt = $this->db->prepare($sql);

        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":title", $title);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":start_datetime", $start_datetime);
        $stmt->bindParam(":end_datetime", $end_datetime);

        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        }

        return false;
    }

    public function getEventsByUser($user_id) {
        $sql = "SELECT * FROM events WHERE user_id = :user_id ORDER BY start_datetime ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([":user_id" => $user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEventById($id) {
        $sql = "SELECT * FROM events WHERE id = :id LIMIT 1";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateEvent($id, $title, $description, $start_datetime, $end_datetime) {
        $sql = "UPDATE events
                SET title = :title,
                    description = :description,
                    start_datetime = :start_datetime,
                    end_datetime = :end_datetime,
                    updated_at = NOW()
                WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':title' => $title,
            ':description' => $description,
            ':start_datetime' => $start_datetime,
            ':end_datetime' => $end_datetime,
            ':id' => $id
        ]);
        return $stmt->rowCount() > 0;
    }

    public function deleteEvent($id) {
        $sql = "DELETE FROM events WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }
}