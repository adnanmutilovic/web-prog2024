<?php

$connection = new mysqli("localhost", "root", "", "currency_converter");
if ($connection->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Connection failed: ' . $connection->connect_error]);
    exit;
}

$username = $_POST['username']; 
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

// prepared statemenT to check existence
$checkUserQuery = $connection->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
$checkUserQuery->bind_param("ss", $username, $email);
$checkUserQuery->execute();
$checkResult = $checkUserQuery->get_result();

if($checkResult->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Username or email already in use.']);
    exit;
}

// prepared statement to insert users
$insertUserQuery = $connection->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
$insertUserQuery->bind_param("sss", $username, $email, $password);

if ($insertUserQuery->execute()) {
    echo json_encode(['success' => true, 'message' => 'Registration successful']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $insertUserQuery->error]);
}

$checkUserQuery->close();
$insertUserQuery->close();
$connection->close();
?>
