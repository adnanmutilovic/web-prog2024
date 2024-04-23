<?php
require 'CountryService.php';

$service = new CountryService($db);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode($service->getAllCountries());
}
