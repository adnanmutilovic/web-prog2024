<?php
require 'CurrencyService.php';

$service = new CurrencyService($db);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode($service->getAllCurrencies());
}
