<?php
class HistoryDao {
    protected $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getConversionHistoryByUserId($userId) {
    }

    public function addConversionHistory($userId, $fromCurrency, $toCurrency, $amount, $convertedAmount) {
    }

    public function deleteConversionHistory($userId, $historyId) {
    }
}
