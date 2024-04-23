<?php
class CountryDao {
    protected $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getCountryByCode($code) { // retrieving country by code
    }

    public function createCountry($country) {
    }

    public function updateCountry($country) {
    }

    public function deleteCountry($code) {
    }
}
