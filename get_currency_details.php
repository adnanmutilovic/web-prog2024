<?php

$connection = new mysqli("localhost", "root", "", "currency_converter");

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

$currencyCode = $_GET['code'];

$stmt = $connection->prepare("SELECT * FROM currencies WHERE currency_code = ?");
$stmt->bind_param("s", $currencyCode);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(['error' => 'Currency not found']);
}

$stmt->close();
$connection->close();
?>
