<?php
class FavoriteDao {
    protected $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getFavoritesByUserId($userId) {
    }

    public function addFavorite($userId, $fromCurrency, $toCurrency) {
    }

    public function deleteFavorite($userId, $favoriteId) {
    }
}
