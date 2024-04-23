<?php
session_start();
header('Content-Type: application/json');

$connection = new mysqli("localhost", "root", "", "currency_converter");

if ($connection->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Connection failed']);
    exit();
}

$userId = $_POST['userId'] ?? '';
$country = $_POST['country'] ?? '';

if ($userId && $country) {
    $query = $connection->prepare("UPDATE users SET country = ? WHERE user_id = ?");
    $query->bind_param("si", $country, $userId);
    $success = $query->execute();
    $query->close();

    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Country updated successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update country.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
}

$connection->close();
?>
