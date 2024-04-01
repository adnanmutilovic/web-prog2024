function addFavorite() {
    const fromCurrency = document.getElementById('favoriteFromCurrency').value;
    const toCurrency = document.getElementById('favoriteToCurrency').value;

    // prevent adding if "from" and "to" currencies are the same
    if (fromCurrency === toCurrency) {
        alert("You can't add a favorite for the same 'FROM' and 'TO' currency.");
        return; 
    }

    const favorite = `${fromCurrency} to ${toCurrency}`;

    // getting the current favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(favorite)) {
        favorites.push(favorite);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites();
    }
}

function renderFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // clearing list before rendering
    favoritesList.innerHTML = '';

    favorites.forEach(favorite => {
        const listItem = document.createElement('li');
        listItem.textContent = favorite;
        favoritesList.appendChild(listItem);
    });
}

// calling renderFavorites on page load to display the list of favorites
document.addEventListener('DOMContentLoaded', renderFavorites);
