<?php

class Currency {
    public $code;
    public $name;
    public $symbol;

    public function __construct($code, $name, $symbol) {
        $this->code = $code;
        $this->name = $name;
        $this->symbol = $symbol;
    }
}
