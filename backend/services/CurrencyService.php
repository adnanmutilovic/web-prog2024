<?php
require_once 'CurrencyDao.php';

class CurrencyService {
    private $dao;

    public function __construct($db) {
        $this->dao = new CurrencyDao($db);
    }

    public function getAllCurrencies() {
        return $this->dao->findAll();
    }

}
