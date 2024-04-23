<?php
require_once 'UserDao.php';

class UserService {
    private $dao;

    public function __construct($db) {
        $this->dao = new UserDao($db);
    }

    public function getUserById($id) {
        return $this->dao->findById($id);
    }

}
