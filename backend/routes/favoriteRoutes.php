<?php
require 'FavoriteService.php';

$service = new FavoriteService($db);

// getting favorites for user
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['userId'])) {
    $userId = $_GET['userId'];
    echo json_encode($service->getFavoritesByUserId($userId));
}

// adding favorite
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    echo json_encode($service->addFavorite($data['userId'], $data['fromCurrency'], $data['toCurrency']));
}

// deleting favorit
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['favoriteId'])) {
    $favoriteId = $_GET['favoriteId'];
    echo json_encode($service->removeFavorite($favoriteId));
}
