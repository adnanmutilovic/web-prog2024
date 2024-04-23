<?php
require 'UserService.php';

$service = new UserService($db);

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $userId = $_GET['id'];
    echo json_encode($service->getUserById($userId));
}
