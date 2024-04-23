<?php
// enabled error reporting to debug
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

$connection = new mysqli("localhost", "root", "", "currency_converter");

if ($connection->connect_error) {
    echo json_encode(['success' => false, 'message' => "Connection failed: " . $connection->connect_error]);
    exit();
}

try {
    // retrieving POST data
    $userId = isset($_POST['userId']) ? $connection->real_escape_string($_POST['userId']) : null;
    $fromCurrency = isset($_POST['fromCurrency']) ? $connection->real_escape_string($_POST['fromCurrency']) : null;
    $toCurrency = isset($_POST['toCurrency']) ? $connection->real_escape_string($_POST['toCurrency']) : null;
    $amount = isset($_POST['amount']) ? $connection->real_escape_string($_POST['amount']) : null;
    $convertedAmount = isset($_POST['convertedAmount']) ? (double) $connection->real_escape_string($_POST['convertedAmount']) : null;

    // preparing an sqL statement for inserting data
    $stmt = $connection->prepare("INSERT INTO conversion_history (user_id, from_currency_code, to_currency_code, amount, converted_amount) VALUES (?, ?, ?, ?, ?)");
    
    // checking if preparation of the statement failed
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $connection->error);
    }

    if (null === $convertedAmount) {
        echo json_encode(['success' => false, 'message' => 'convertedAmount is required.']);
        exit();
    }

    // bind parameters to the prepared statement
    $stmt->bind_param("issdd", $userId, $fromCurrency, $toCurrency, $amount, $convertedAmount);

    // executing the prepared statement
    if (!$stmt->execute()) {
        throw new Exception("Execution failed: " . $stmt->error);
    }

    // sending a success message if the insertion is successful
    echo json_encode(['success' => true, 'message' => "Conversion history recorded successfully"]);
} catch (Exception $e) {
    // handling exceptions by sending a server error status
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    $connection->close();
}
?>
