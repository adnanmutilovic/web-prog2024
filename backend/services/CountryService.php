<?php
require_once 'CountryDao.php';

class CountryService {
    private $dao;

    public function __construct($db) {
        $this->dao = new CountryDao($db);
    }

    public function getAllCountries() {
        return $this->dao->findAll();
    }
    
}
