<?php

$connection = new mysqli("localhost", "root", "", "currency_converter");

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

// preparing and executing the query to select all countries
$query = "SELECT country_code, name FROM countries ORDER BY name ASC";
$result = $connection->query($query);

// fetching data and returning as JSON
$countries = [];
while ($row = $result->fetch_assoc()) {
    $countries[] = $row;
}

header('Content-Type: application/json');
echo json_encode($countries);

$connection->close();
?>
