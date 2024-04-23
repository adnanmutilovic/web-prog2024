<?php
require_once 'FavoriteDao.php';

class FavoriteService {
    private $dao;

    public function __construct($db) {
        $this->dao = new FavoriteDao($db);
    }

    public function getFavoritesByUserId($userId) {
        return $this->dao->findByUserId($userId);
    }

    public function addFavorite($userId, $fromCurrency, $toCurrency) {
        return $this->dao->create($userId, $fromCurrency, $toCurrency);
    }

    public function removeFavorite($favoriteId) {
        return $this->dao->delete($favoriteId);
    }
}
