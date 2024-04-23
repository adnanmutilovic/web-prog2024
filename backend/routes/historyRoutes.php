<?php
require 'HistoryService.php';

$service = new HistoryService($db);

// conversion history of user
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['userId'])) {
    $userId = $_GET['userId'];
    echo json_encode($service->getHistoryByUserId($userId));
}

// adding a history record
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    echo json_encode($service->addHistoryRecord($data['userId'], $data['fromCurrency'], $data['toCurrency'], $data['amount'], $data['convertedAmount']));
}
