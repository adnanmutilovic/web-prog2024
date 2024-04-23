async function handleCurrencyConverterFormSubmission() {
    const converterForm = document.getElementById('converterForm');
    if (converterForm) {
        converterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const amount = document.getElementById('amount').value;
            const fromCurrency = document.getElementById('fromCurrency').value;
            const toCurrency = document.getElementById('toCurrency').value;
            const resultElement = document.getElementById('conversionResult');

            try {
                const rate = await fetchConversionRate(fromCurrency, toCurrency);
                const convertedAmount = (amount * rate).toFixed(2);
                resultElement.innerHTML = `Converted Amount: ${convertedAmount} ${toCurrency}`;
                resultElement.style.display = 'block';

                // checking if the user is logged in and has a valid user ID
                const loggedInUserJSON = localStorage.getItem('loggedInUser');
                if (loggedInUserJSON) {
                    const loggedInUser = JSON.parse(loggedInUserJSON);
                    if (loggedInUser && loggedInUser.userId) {
                        saveConversionHistory(loggedInUser.userId, fromCurrency, toCurrency, amount, convertedAmount);
                    } else {
                        console.error('User ID not found or user is not logged in');
                    }
                }

            } catch (error) {
                resultElement.innerHTML = `Failed to convert. Please try again. Error: ${error.message}`;
                resultElement.style.display = 'block';
            }
        });
    }
}

function initChart(chartId, label, data, borderColor) {
    var ctx = document.getElementById(chartId).getContext('2d');

    if (window.myCharts && window.myCharts[chartId]) {
        window.myCharts[chartId].destroy();
    } else {
        window.myCharts = window.myCharts || {};
    }

    window.myCharts[chartId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['September', 'October', 'November', 'December', 'January', 'February'],
            datasets: [{
                label: label,
                data: data,
                borderColor: borderColor,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}


function handleCurrencyInfoSelection() {
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) {
        currencySelect.addEventListener('change', function() {
            if (this.value === "") {
                document.getElementById('currencyInfo').innerHTML = "";
                return;
            }
            const selectedCurrency = currencyDetails[this.value];
            document.getElementById('currencyInfo').innerHTML = `
                <div style="text-align: center; margin-top: 20px;">
                    <img src="${selectedCurrency.image}" alt="${selectedCurrency.name}" style="width:300px;height:auto;display:block;margin:auto;"><br>
                    <h2>${selectedCurrency.name} (${selectedCurrency.symbol})</h2>
                    <p><strong>Country:</strong> ${selectedCurrency.country}</p>
                    <p><strong>Introduced:</strong> ${selectedCurrency.introduced}</p>
                    <p><strong>Facts:</strong> ${selectedCurrency.facts}</p>
                </div>
            `;
        });
    }
}

function getCurrencyDetails(currencyCode) {
    fetch('get_currency_details.php?code=' + currencyCode)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error fetching currency details:', error);
        });
}


document.addEventListener('DOMContentLoaded', function() {
    handleCurrencyConverterFormSubmission();

    window.loadContent = function(page) {
        const spaContent = document.getElementById('spa-content');
        const mainContent = document.querySelector('.container');
        spaContent.innerHTML = ''; // clearing the SPA content
    

        switch (page) {
            case 'login':
                case 'register':
                    mainContent.style.display = 'none';
                    spaContent.innerHTML = pageTemplates[page];
                    if (page === 'login') handleLoginFormSubmission();
                    if (page === 'register') handleRegistrationFormSubmission();
                    break;
                case 'currencyInfo':
                    mainContent.style.display = 'none';
                    spaContent.innerHTML = pageTemplates[page];
                    handleCurrencyInfoSelection();
                    break;
                case 'graphicalTrend':
                    mainContent.style.display = 'none';
                    spaContent.innerHTML = pageTemplates[page];
                    loadAndInitCharts(); // initialization of charts after rendering the template
                    break;
                case 'favorites':
                    mainContent.style.display = 'none';
                    spaContent.innerHTML = pageTemplates['favorites'];
                    loadFavoritesPage();
                    break;
                case 'profile':
                        mainContent.style.display = 'none';
                        spaContent.innerHTML = pageTemplates['profile'];
                        loadUserProfile();
                        populateCountriesDropdown();
                        break;
                case 'history':
                    mainContent.style.display = 'none';
                    spaContent.innerHTML = pageTemplates[page];
                    renderConversionHistory();
                    break;
                default:
                    mainContent.style.display = 'block';
                    spaContent.innerHTML = '';
            }
    
    
        updateOptionsMenu(page); // updating the options menu based on the current page
        updateUIBasedOnLoginStatus();
    };

    // initializing the SPA
    const initialPage = 'home';
    window.loadContent(initialPage);
    initSPA();
});

function loadFavoritesPage() {
    renderFavorites();
    document.getElementById('addFavoriteButton').addEventListener('click', addFavorite);
}

function deleteFavorite(favoriteId) {
    const formData = new FormData();
    formData.append('favorite_id', favoriteId);
    formData.append('action', 'delete');

    fetch('favorites.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Favorite deleted successfully');
            renderFavorites(); // refreshing the favorites list
        } else {
            alert('Error deleting favorite');
        }
    })
    .catch(error => {
        console.error('Error while deleting favorite:', error);
    });
}

function updateOptionsMenu(currentPage) {
    const allPages = {
        home: 'Currency Converter',
        currencyInfo: 'Currency Information',
        history: 'Conversion History',
        graphicalTrend: 'Graphical Trend of Currencies',
        favorites: 'Favorite Currencies'
    };
    const optionsContainer = document.querySelector('.dropdown-content');
    optionsContainer.innerHTML = ''; // clearing options

    Object.entries(allPages).forEach(([pageKey, pageName]) => {
        if (pageKey !== currentPage) {
            const optionLink = document.createElement('a');
            optionLink.href = "#";
            optionLink.textContent = pageName;
            optionLink.setAttribute('data-page', pageKey);
            optionLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.loadContent(pageKey);
            });
            optionsContainer.appendChild(optionLink);
        }
    });
}

function bindMenuLinks() {
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', menuLinkClicked);
    });
}

function menuLinkClicked(e) {
    e.preventDefault();
    const page = this.getAttribute('data-page');
    window.loadContent(page);
}

const pageTemplates = {
'login': `
    <div class="container">
        <h2>Login</h2>
        <form id="loginForm">
            <div class="form-group">
                <label for="loginUsername">Username:</label>
                <input type="text" id="loginUsername" required>
            </div>
            <div class="form-group">
                <label for="loginPassword">Password:</label>
                <input type="password" id="loginPassword" required>
            </div>
            <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="#" onclick="window.loadContent('register')">Register here</a>.</p>
    </div>
`,
'register': `
        <div class="container">
            <h2>Register</h2>
            <form id="registerForm">
                <div class="form-group">
                    <label for="registerUsername">Username:</label>
                    <input type="text" id="registerUsername" required>
                </div>
                <div class="form-group">
                    <label for="registerEmail">Email:</label>
                    <input type="email" id="registerEmail" required>
                </div>
                <div class="form-group">
                    <label for="registerPassword">Password:</label>
                    <input type="password" id="registerPassword" required>
                </div>
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="#" onclick="window.loadContent('login')">Login here</a>.</p>
        </div>
    `,
    'currencyInfo': `
    <div class="container">
    <h1>Currency Information</h1>
    <select id="currencySelect">
        <option value="" disabled selected>Select a currency</option>
        <option value="AUD">Australian Dollar (AUD)</option>
        <option value="USD">United States Dollar (USD)</option>
        <option value="EUR">Euro (EUR)</option>
        <option value="GBP">British Pound (GBP)</option>
        <option value="CAD">Canadian Dollar (CAD)</option>
        <option value="CHF">Swiss Franc (CHF)</option>
        <option value="JPY">Japanese Yen (JPY)</option>
        <option value="CNY">Chinese Yuan (CNY)</option>
        <option value="BAM">Bosnian Convertible Mark (BAM)</option>
    </select>
    <div id="currencyInfo"></div>
</div>
`,
'history': `
        <div class="container">
            <h1>Conversion History</h1>
            <ul id="historyDisplay"></ul>
        </div>
    `,
    'graphicalTrend': `
    <div class="container">
        <h1>Graphical Trend of Currencies</h1>
        <div class="chart-container" style="position: relative; height:30vh; width:80vw; margin-bottom: 20px;"><canvas id="trendUSDToEUR"></canvas></div>
        <div class="chart-container" style="position: relative; height:30vh; width:80vw; margin-bottom: 20px;"><canvas id="trendAUDToEUR"></canvas></div>
        <div class="chart-container" style="position: relative; height:30vh; width:80vw; margin-bottom: 20px;"><canvas id="trendUSDToAUD"></canvas></div>
        <div class="chart-container" style="position: relative; height:30vh; width:80vw; margin-bottom: 20px;"><canvas id="trendEURToGBP"></canvas></div>
        <div class="chart-container" style="position: relative; height:30vh; width:80vw; margin-bottom: 20px;"><canvas id="trendGBPToJPY"></canvas></div>
        <div class="chart-container" style="position: relative; height:30vh; width:80vw; margin-bottom: 20px;"><canvas id="trendCADToCHF"></canvas></div>
        <div class="chart-container" style="position: relative; height:30vh; width:80vw; margin-bottom: 20px;"><canvas id="trendJPYToCNY"></canvas></div>
        <div class="chart-container" style="position: relative; height:30vh; width:80vw; margin-bottom: 20px;"><canvas id="trendCHFToEUR"></canvas></div>
        <div class="chart-container" style="position: relative; height:30vh; width:80vw; margin-bottom: 20px;"><canvas id="trendAUDToCAD"></canvas></div>
        <div class="chart-container" style="position: relative; height:30vh; width:80vw;"><canvas id="trendCNYToUSD"></canvas></div>
    </div>
`,
'favorites': `
<div class="container">
    <h1>Favorites</h1>
    <form id="favoriteForm">
        <div class="form-group">
            <label for="favoriteFromCurrency">From:</label>
            <select id="favoriteFromCurrency">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="AUD">AUD</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="CHF">CHF</option>
                <option value="JPY">JPY</option>
                <option value="CNY">CNY</option>
                <option value="BAM">BAM</option>
            </select>
        </div>
        <div class="form-group">
            <label for="favoriteToCurrency">To:</label>
            <select id="favoriteToCurrency">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="AUD">AUD</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="CHF">CHF</option>
                <option value="JPY">JPY</option>
                <option value="CNY">CNY</option>
                <option value="BAM">BAM</option>
            </select>
        </div>
        <button type="button" id="addFavoriteButton">Add to Favorites</button>
    </form>
    <h2>Your Favorites</h2>
    <ul id="favoritesList"></ul>
</div>
`,
'profile': `
    <div class="container">
        <img src="images/ICON.png" alt="User Icon" style="display: block; margin: 20px auto; width: 250px; height: 250px;">
        <h1>User Profile</h1>
        <p><strong>Username:</strong> <span id="profileUsername" class="blue-bold-text"></span></p>
        <p><strong>Email:</strong> <span id="profileEmail" class="blue-bold-text"></span></p>
        <p><strong>Account Creation Date:</strong> <span id="accountCreationDate" class="red-bold-text">N/A</span></p>
        <p><strong>Last Login Date:</strong> <span id="lastLoginDate" class="red-bold-text">N/A</span></p>
        <form id="updateCountryForm" style="margin-top: 20px;">
            <label for="countrySelect"><strong>Country:</strong></label>
            <select id="countrySelect"></select>
            <button type="submit">Save</button>
        </form>
        <button id="logoutButton">Log Out</button>
    </div>
`,

};

function initSPA() {
document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.getAttribute('data-page');
        window.loadContent(page);
    });
});
}

function loadUserProfile() {
    const loggedInUserJSON = localStorage.getItem('loggedInUser');
    if (loggedInUserJSON) {
        const loggedInUser = JSON.parse(loggedInUserJSON);
        document.getElementById('profileUsername').textContent = loggedInUser.username || 'N/A';
        document.getElementById('profileEmail').textContent = loggedInUser.email || 'N/A';
        document.getElementById('accountCreationDate').textContent = loggedInUser.creationDate || 'N/A';
        document.getElementById('lastLoginDate').textContent = loggedInUser.lastLoginDate || 'N/A';
        
        populateCountriesDropdown(loggedInUser.country);

    }
    
    const updateCountryForm = document.getElementById('updateCountryForm');
    if (updateCountryForm) {
        updateCountryForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            updateCountryForUser();
        });
    }
    
    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('loggedInUser');
        alert('Successfully logged out.');
        window.loadContent('home');
    });
    
    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem(loggedInUserKey);
        alert('Successfully logged out.');
        window.loadContent('home');
    });
}

function populateCountriesDropdown(selectedCountry) {
    fetch('get_countries.php')
        .then(response => response.json())
        .then(countries => {
            const selectElement = document.getElementById('countrySelect');
            selectElement.innerHTML = ''; // clearing the existing options
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.country_code;
                option.textContent = country.name;
                if (country.name === selectedCountry) {
                    option.selected = true;
                }
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching countries:', error);
        });
}

function updateCountryForUser() {
    const selectedCountry = document.getElementById('countrySelect').value;
    const loggedInUserJSON = localStorage.getItem('loggedInUser');

    if (loggedInUserJSON && selectedCountry) {
        const user = JSON.parse(loggedInUserJSON);

        const formData = new FormData();
        formData.append('country', selectedCountry);
        formData.append('userId', user.userId); 

        // sending the request to my PHP script to update the country
        fetch('update_country.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Country updated on the server:', data.message);

                // now updating the local storage
                user.country = selectedCountry;
                localStorage.setItem('loggedInUser', JSON.stringify(user));

                alert('Country updated successfully.');
                loadUserProfile(); // refreshing profile data
            } else {
                console.error('Failed to update country on the server:', data.message);
                alert('Error updating country. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error while updating country:', error);
            alert('Error updating country. Please try again.');
        });
    } else {
        alert('Error updating country. Please try again.');
    }
}

function addFavorite() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const fromCurrency = document.getElementById('favoriteFromCurrency').value;
    const toCurrency = document.getElementById('favoriteToCurrency').value;

    if (fromCurrency === toCurrency) {
        alert("You can't add a favorite for the same 'FROM' and 'TO' currency.");
        return;
    }

    const formData = new FormData();
    formData.append('user_id', loggedInUser.userId);
    formData.append('from_currency_code', fromCurrency);
    formData.append('to_currency_code', toCurrency);

    fetch('favorites.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Favorite added successfully');
            renderFavorites(); // refreshing favorites
        } else {
            alert('Error adding favorite');
        }
    })
    .catch(error => {
        console.error('Error while saving favorite:', error);
    });
}

function renderFavorites() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.userId) {
        fetch(`favorites.php?user_id=${loggedInUser.userId}`)
            .then(response => response.json())
            .then(favorites => {
                const favoritesList = document.getElementById('favoritesList');
                // clearing the list before rendering
                favoritesList.innerHTML = '';
                favorites.forEach(favorite => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${favorite.from_currency_code} to ${favorite.to_currency_code}`;
                    // creating a delete button
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.onclick = () => deleteFavorite(favorite.id);
                    listItem.appendChild(deleteButton);
                    favoritesList.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error loading favorites:', error);
            });
    }
}

    function loadAndInitCharts() {
        // cheecking if chart.js is already loaded
        if (typeof Chart === 'undefined') {
            // checking if chart.js script tag
            if (!window.chartJsScriptLoaded) {
                const script = document.createElement('script');
                script.onload = function() {
                    // ensure initCharts is only called once chart.js is fully loaded
                    initCharts();
                };
                script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
                document.head.appendChild(script);
                window.chartJsScriptLoaded = true; 
            }
        } else {
            initCharts();
        }
    }
function initCharts() {
    initChart('trendUSDToEUR', 'USD to EUR Trend', [1.1, 1.2, 1.15, 1.17, 1.14, 1.13], 'rgb(75, 192, 192)');
    initChart('trendAUDToEUR', 'AUD to EUR Trend', [0.61, 0.62, 0.63, 0.64, 0.65, 0.66], 'rgb(192, 75, 192)');
    initChart('trendUSDToAUD', 'USD to AUD Trend', [1.4, 1.42, 1.38, 1.4, 1.35, 1.33], 'rgb(192, 192, 75)');
    initChart('trendEURToGBP', 'EUR to GBP Trend', [0.85, 0.86, 0.87, 0.88, 0.89, 0.90], 'rgb(255, 159, 64)');
    initChart('trendGBPToJPY', 'GBP to JPY Trend', [140, 142, 138, 141, 145, 147], 'rgb(153, 102, 255)');
    initChart('trendCADToCHF', 'CAD to CHF Trend', [0.74, 0.75, 0.73, 0.76, 0.77, 0.78], 'rgb(255, 99, 132)');
    initChart('trendJPYToCNY', 'JPY to CNY Trend', [0.06, 0.061, 0.062, 0.063, 0.064, 0.065], 'rgb(54, 162, 235)');
    initChart('trendCHFToEUR', 'CHF to EUR Trend', [0.92, 0.93, 0.91, 0.94, 0.95, 0.96], 'rgb(255, 206, 86)');
    initChart('trendAUDToCAD', 'AUD to CAD Trend', [0.96, 0.97, 0.98, 0.99, 1.0, 1.01], 'rgb(75, 192, 192)');
    initChart('trendCNYToUSD', 'CNY to USD Trend', [0.14, 0.142, 0.144, 0.146, 0.148, 0.15], 'rgb(255, 159, 64)');
}


function renderConversionHistory() {
    console.log("Rendering Conversion History...");
    const historyDisplay = document.getElementById('historyDisplay');
    const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];

    console.log('History:', history);

    historyDisplay.innerHTML = '';

    history.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.amount} ${item.fromCurrency} to ${item.convertedAmount} ${item.toCurrency}`;
        historyDisplay.appendChild(listItem);
    });
}

function updateUIBasedOnLoginStatus() {
    const loggedInUserJSON = localStorage.getItem('loggedInUser');
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const loggedInUser = loggedInUserJSON ? JSON.parse(loggedInUserJSON) : null;

if(loggedInUser && userInfo) {
    userInfo.innerHTML = `Logged in as ${loggedInUser.username} <a href="#" id="logout">Logout</a>`;

    const profileLink = document.createElement('a');
    profileLink.href = '#';
    profileLink.textContent = 'Profile';
    profileLink.style.marginLeft = '10px';
    profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.loadContent('profile');
    });

    userInfo.appendChild(profileLink);

    document.getElementById('logout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('conversionHistory');
        localStorage.removeItem('favorites');
        alert('Successfully logged out.');
        updateUIBasedOnLoginStatus();
        window.loadContent('home');
    });

    authButtons.style.display = 'none';
    userInfo.style.display = 'block';
} else if(authButtons) {
    userInfo.style.display = 'none';
    authButtons.style.display = 'block';
}
}

function handleLoginFormSubmission() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            fetch('login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                console.log('HTTP Status:', response.status);
                return response.text();
            })
            .then(text => {
                console.log("Response text:", text);
                try {
                    const data = JSON.parse(text);
                    if (data.success) {
                        localStorage.setItem('loggedInUser', JSON.stringify(data));
                        alert('Login successful');
                        updateUIBasedOnLoginStatus();
                        window.loadContent('home');
                    } else {
                        alert('Login failed: ' + data.message);
                    }
                } catch (err) {
                    console.error("Could not parse JSON:", text);
                    alert('Login failed. Please check the console for more information.');
                }
            })
            .catch(error => {
                console.error('Login Error:', error);
                alert('Login failed. Please check the console for more information.');
            });
        });
    }
}

function handleRegistrationFormSubmission() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);

            fetch('register.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                console.log('Registration HTTP Status:', response.status);
                return response.text();
            })
            .then(text => {
                console.log("Registration Response text:", text);
                try {
                    const data = JSON.parse(text);
                    if (data.success) {
                        alert('Registration successful');
                        window.loadContent('login');
                    } else {
                        alert('Registration failed: ' + data.message);
                    }
                } catch (err) {
                    console.error("Registration JSON Parse Error:", text);
                    alert('Registration failed. Please check the console for more information.');
                }
            })
            .catch(error => {
                console.error('Registration Error:', error);
                alert('Registration failed. Please check the console for more information.');
            });
        });
    }
}

function saveConversionHistory(userId, fromCurrency, toCurrency, amount, convertedAmount) {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('fromCurrency', fromCurrency);
    formData.append('toCurrency', toCurrency);
    formData.append('amount', amount);
    formData.append('convertedAmount', convertedAmount);

    fetch('insert_conversion_history.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Conversion history saved:', data.message);
        } else {
            console.error('Failed to save conversion history:', data.message);
        }
    })
    .catch(error => {
        console.error('Error while saving conversion history:', error);
    });
}

function updateToCurrencyOptions() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    
    if(fromCurrency && toCurrencySelect) {
        while (toCurrencySelect.firstChild) {
            toCurrencySelect.removeChild(toCurrencySelect.firstChild);
        }

    const currencies = ['USD', 'EUR', 'AUD', 'GBP', 'CAD', 'CHF', 'JPY', 'CNY', 'BAM'];
    const availableCurrencies = currencies.filter(currency => currency !== fromCurrency);

    availableCurrencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.text = currency;
        toCurrencySelect.appendChild(option);
    });

    toCurrencySelect.value = availableCurrencies[0];
}

updateToCurrencyOptions();
document.getElementById('fromCurrency').addEventListener('change', updateToCurrencyOptions);

const authButtons = document.getElementById('auth-buttons');
const userInfo = document.getElementById('user-info');
const loggedInUser = localStorage.getItem('loggedInUser');

if (loggedInUser) {
    userInfo.innerHTML = `
        <div class="user-info-dropdown">
            Logged in as ${loggedInUser}
            <div class="user-info-dropdown-content">
                <a href="profile.html">Profile</a>
                <a id="logout" href="#">Logout</a>
            </div>
        </div>
    `;
    authButtons.style.display = 'none';
    userInfo.style.display = 'block';
} else {
    authButtons.style.display = 'block';
    userInfo.style.display = 'none';
}

document.getElementById('logout')?.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('loggedInUser');
    alert('Successfully logged out.');
});

document.addEventListener('DOMContentLoaded', function() {
    fetchCurrencies();
    populateCountriesDropdown();
});

function fetchCurrencies() {
    fetch('currencies.json')
        .then(response => response.json())
        .then(data => {
            displayCurrencies(data);
        })
        .catch(error => {
            console.error('Error fetching currencies:', error);
        });
}

function displayCurrencies(currencies) {
    const list = document.getElementById('currenciesList');
    list.innerHTML = '';

    currencies.forEach(currency => {
        const listItem = document.createElement('li');
        listItem.textContent = `${currency.name} (${currency.symbol}) - ${currency.country}`;
        list.appendChild(listItem);
    });
}

document.getElementById('converterForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultElement = document.getElementById('conversionResult');
    const userId = localStorage.getItem('loggedInUser');

    try {
        const rate = await fetchConversionRate(fromCurrency, toCurrency);
        const convertedAmount = (amount * rate).toFixed(2);
        resultElement.innerHTML = `Converted Amount: ${convertedAmount} ${toCurrency}`;
        resultElement.style.display = 'block';
        saveConversionHistory(userId, fromCurrency, toCurrency, amount, convertedAmount);

    } catch (error) {
        resultElement.innerHTML = `Failed to convert. Please try again. Error: ${error.message}`;
        resultElement.style.display = 'block';
    }
});

function saveConversionHistory(userId, fromCurrency, toCurrency, amount, convertedAmount) {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('fromCurrency', fromCurrency);
    formData.append('toCurrency', toCurrency);
    formData.append('amount', amount);
    formData.append('convertedAmount', convertedAmount);

    fetch('insert_conversion_history.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Conversion history saved:', data.message);
        } else {
            console.error('Failed to save conversion history:', data.message);
        }
    })
    .catch(error => {
        console.error('Error while saving conversion history:', error);
    });
}
}