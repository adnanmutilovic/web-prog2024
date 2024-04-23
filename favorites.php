<?php

// database connection setup
$connection = new mysqli("localhost", "root", "", "currency_converter");

// checking for a successful connection
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

// checking what type of request is being made
if ($_SERVER['REQUEST_METHOD'] == 'POST' && !isset($_POST['action'])) {
    // adding a new favorite
    $userId = $connection->real_escape_string($_POST['user_id']);
    $fromCurrency = $connection->real_escape_string($_POST['from_currency_code']);
    $toCurrency = $connection->real_escape_string($_POST['to_currency_code']);

    $stmt = $connection->prepare("INSERT INTO favorites (user_id, from_currency_code, to_currency_code) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $userId, $fromCurrency, $toCurrency);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => "Favorite added successfully"]);
    } else {
        echo json_encode(['success' => false, 'message' => "Error adding favorite"]);
    }

    $stmt->close();

} elseif ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'delete') {
    // deleting a favorite
    $favoriteId = $connection->real_escape_string($_POST['favorite_id']);
    $stmt = $connection->prepare("DELETE FROM favorites WHERE id = ?");
    $stmt->bind_param("i", $favoriteId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => "Favorite deleted successfully"]);
    } else {
        echo json_encode(['success' => false, 'message' => "Error deleting favorite"]);
    }

    $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['user_id'])) {
    // retrieving users favorites
    $userId = $connection->real_escape_string($_GET['user_id']);
    
    $query = "SELECT * FROM favorites WHERE user_id = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $favorites = [];
    while ($row = $result->fetch_assoc()) {
        $favorites[] = $row;
    }

    echo json_encode($favorites);
    $stmt->close();
}

$connection->close();
?>
