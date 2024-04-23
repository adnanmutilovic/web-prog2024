<?php
ob_start(); 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


header('Content-Type: application/json'); 

$connection = new mysqli("localhost", "root", "", "currency_converter");

if ($connection->connect_error) {
    error_log('Connection failed: ' . $connection->connect_error);
    echo json_encode(['success' => false, 'message' => 'Connection failed']);
    exit();
}

$username = $connection->real_escape_string($_POST['username']);
$password = $_POST['password'];

$query = $connection->prepare("SELECT * FROM users WHERE username = ?");
$query->bind_param("s", $username);
$query->execute();

$result = $query->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    $lastLoginQuery = $connection->prepare("UPDATE users SET last_login_date = NOW() WHERE username = ?");
    $lastLoginQuery->bind_param("s", $username);
    if (!$lastLoginQuery->execute()) {
        error_log('Last login update failed: ' . $lastLoginQuery->error);
    }
    $lastLoginQuery->close();

    $output = [
        'success' => true,
        'userId' => $user['user_id'],
        'username' => $user['username'],
        'email' => $user['email'],
        'creationDate' => $user['creation_date'],
        'lastLoginDate' => $user['last_login_date'],
        'country' => $user['country']
    ];

    echo json_encode($output);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
}

$query->close();
$connection->close();
ob_end_flush();
?>
