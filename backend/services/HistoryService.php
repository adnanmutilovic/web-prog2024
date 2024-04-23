<?php
require_once 'HistoryDao.php';

class HistoryService {
    private $dao;

    public function __construct($db) {
        $this->dao = new HistoryDao($db);
    }

    public function getHistoryByUserId($userId) {
        return $this->dao->findByUserId($userId);
    }

    public function addHistoryRecord($userId, $fromCurrency, $toCurrency, $amount, $convertedAmount) {
        return $this->dao->create($userId, $fromCurrency, $toCurrency, $amount, $convertedAmount);
    }

}
