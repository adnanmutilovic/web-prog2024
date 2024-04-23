<?php

require_once 'database.php';
require_once 'models/User.php';
require_once 'models/Currency.php';
require_once 'models/Country.php';
require_once 'models/Favorite.php';
require_once 'models/History.php';
require_once 'dao/UserDao.php';
require_once 'dao/CurrencyDao.php';
require_once 'dao/CountryDao.php';
require_once 'dao/FavoriteDao.php';
require_once 'dao/HistoryDao.php';
require_once 'services/UserService.php';
require_once 'services/CurrencyService.php';
require_once 'services/CountryService.php';
require_once 'services/FavoriteService.php';
require_once 'services/HistoryService.php';
require_once 'routes/userRoutes.php';
require_once 'routes/currencyRoutes.php';
require_once 'routes/countryRoutes.php';
require_once 'routes/favoriteRoutes.php';
require_once 'routes/historyRoutes.php';

header('Content-Type: application/json');

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );

// basic routing
if ((isset($uri[2]) && $uri[2] != 'user') || !isset($uri[3])) {
    header("HTTP/1.1 404 Not Found");
    exit();
}

$resource = $uri[2];
$id = null;
if (isset($uri[3])) {
    $id = (int) $uri[3];
}

// the routing logic
switch ($resource) {
    case 'user':
        handleUserRequest($id);
        break;
    case 'currency':
        handleCurrencyRequest($id);
        break;
    case 'country':
        handleCountryRequest($id);
        break;
    case 'favorite':
        handleFavoriteRequest($id);
        break;
    case 'history':
        handleHistoryRequest($id);
        break;
    default:
        header("HTTP/1.1 404 Not Found");
        exit();
}

function handleUserRequest($id) {
    // handling the user request here
}

function handleCurrencyRequest($id) {
    // handling the currency request here
}

function handleCountryRequest($id) {
    // handling the country req here
}

function handleFavoriteRequest($id) {
    // handling the favorite request here
}

function handleHistoryRequest($id) {
    // handling the history request here
}

// will add more routing functions as needed

