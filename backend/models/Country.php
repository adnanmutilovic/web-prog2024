<?php

class Country {
    public $code;
    public $name;

    public function __construct($code, $name) {
        $this->code = $code;
        $this->name = $name;
    }
}
