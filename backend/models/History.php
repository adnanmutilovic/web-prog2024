<?php

class History {
    public $id;
    public $userId;
    public $fromCurrencyCode;
    public $toCurrencyCode;
    public $amount;
    public $convertedAmount;

    public function __construct($id, $userId, $fromCurrencyCode, $toCurrencyCode, $amount, $convertedAmount) {
        $this->id = $id;
        $this->userId = $userId;
        $this->fromCurrencyCode = $fromCurrencyCode;
        $this->toCurrencyCode = $toCurrencyCode;
        $this->amount = $amount;
        $this->convertedAmount = $convertedAmount;
    }
}
