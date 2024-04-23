<?php

class Favorite {
    public $id;
    public $userId;
    public $fromCurrencyCode;
    public $toCurrencyCode;

    public function __construct($id, $userId, $fromCurrencyCode, $toCurrencyCode) {
        $this->id = $id;
        $this->userId = $userId;
        $this->fromCurrencyCode = $fromCurrencyCode;
        $this->toCurrencyCode = $toCurrencyCode;
    }
}