<<<<<<< HEAD
function handleCurrencyConverterFormSubmission() {
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
                
                const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
                history.push({ amount, fromCurrency, toCurrency, convertedAmount });
                localStorage.setItem('conversionHistory', JSON.stringify(history));
                console.log("Conversion added to history:", history);
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

const currencyDetails = {
    AUD: {
        name: "Australian Dollar",
        symbol: "$",
        country: "Australia",
        introduced: "1966",
        facts: "The Australian Dollar is often referred to as the 'Aussie dollar'. Australia's currency features unique designs of the Australian wildlife. It was the first currency in the world to use polymer banknotes.",
        image: "images/AUD.jpg"
    },
    USD: {
        name: "United States Dollar",
        symbol: "$",
        country: "United States",
        introduced: "1792",
        facts: "The USD is the most widely used currency for global transactions. The symbol ($) has its origins in the Spanish dollar's sign.",
        image: "images/USD.jpg"
    },
    EUR: {
        name: "Euro",
        symbol: "€",
        country: "Eurozone",
        introduced: "1999",
        facts: "The Euro is the second-largest and second-most traded currency in the foreign exchange market. Euro banknotes and coins are standardized across countries.",
        image: "images/EUR.jpg"
    },
    GBP: {
        name: "British Pound",
        symbol: "£",
        country: "United Kingdom",
        introduced: "775",
        facts: "One of the oldest currencies still in use today. It's known for its stability and is often symbolized by £.",
        image: "images/GBP.jpg"
    },
    CAD: {
        name: "Canadian Dollar",
        symbol: "CAD",
        country: "Canada",
        introduced: "1858",
        facts: 'Often called the "loonie" because of the loon bird featured on the CA$1 coin.',
        image: "images/CAD.jpg"
    },
    CHF: {
        name: "Swiss Franc",
        symbol: "CHF",
        country: "Switzerland",
        introduced: "1850",
        facts: 'Known for being a "safe-haven" currency because of Switzerland\'s stable economy and financial system.',
        image: "images/CHF.jpg"
    },
    JPY: {
        name: "Japanese Yen",
        symbol: "JPY",
        country: "Japan",
        introduced: "1871",
        facts: "The most traded currency in Asia, characterized by its relatively low interest rates.",
        image: "images/JPY.jpg"
    },
    CNY: {
        name: "Chinese Yuan",
        symbol: "CNY",
        country: "China",
        introduced: "1948",
        facts: "Also known as Renminbi. It's becoming more influential in international finance.",
        image: "images/CNY.jpg"
    },
    BAM: {
        name: "Bosnian Convertible Mark",
        symbol: "BAM",
        country: "Bosnia and Herzegovina",
        introduced: "1995",
        facts: "Pegged to the Euro at a fixed rate of 1 EUR = 1.95583 BAM. It replaced the Bosnian Dinar as part of the Dayton Agreement.",
        image: "images/BAM.jpg"
    }
};

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
                    renderFavorites();
                    document.getElementById('addFavoriteButton').addEventListener('click', addFavorite);
                    break;
                case 'profile':
                        mainContent.style.display = 'none';
                        spaContent.innerHTML = pageTemplates['profile'];
                        loadUserProfile();
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

    // Initialize the SPA
    const initialPage = 'home';
    window.loadContent(initialPage);
    initSPA();
});

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
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const user = JSON.parse(localStorage.getItem(loggedInUser));
        document.getElementById('profileUsername').textContent = user.username;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('accountCreationDate').textContent = user.creationDate ? new Date(user.creationDate).toLocaleDateString() : 'N/A';
        document.getElementById('lastLoginDate').textContent = user.lastLoginDate ? new Date(user.lastLoginDate).toLocaleDateString() : 'N/A';
        
        populateCountries(user.country || '');

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
    
    /* Might use in later part of the project development;
     
    document.getElementById('editPreferredCurrencies').addEventListener('click', function() {
        const editSection = document.getElementById('preferredCurrenciesEdit');
        editSection.style.display = editSection.style.display === 'none' ? 'block' : 'none';
    });/*
    
        /*if (user.preferredCurrencies) {
            user.preferredCurrencies.forEach(currency => {
                const checkbox = document.getElementById(currency);
                if (checkbox) checkbox.checked = true;
            });
        }
    
    }*/
    
    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem(loggedInUserKey);
        alert('Successfully logged out.');
        window.loadContent('home');
    });
}

function updateCountryForUser() {
    const selectedCountry = document.getElementById('countrySelect').value;
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if (loggedInUser && selectedCountry) {
        const user = JSON.parse(localStorage.getItem(loggedInUser));
        user.country = selectedCountry;
        localStorage.setItem(loggedInUser, JSON.stringify(user));
        alert('Country updated successfully.');
    } else {
        alert('Error updating country. Please try again.');
    }
}

/* Might use later, will see

function populatePreferredCurrencies(preferredCurrencies = []) {
    const editDiv = document.getElementById('preferredCurrenciesEdit');
    editDiv.innerHTML = ''; // Clear previous content
    const currencies = ['USD', 'EUR', 'AUD', 'GBP', 'CAD', 'CHF', 'JPY', 'CNY', 'BAM'];
    
    currencies.forEach(currency => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `prefCurrency-${currency}`;
        checkbox.value = currency;
        checkbox.checked = preferredCurrencies.includes(currency);
        
        const label = document.createElement('label');
        label.htmlFor = `prefCurrency-${currency}`;
        label.textContent = ` ${currency}`;
        
        editDiv.appendChild(checkbox);
        editDiv.appendChild(label);
        editDiv.appendChild(document.createElement('br'));
    });
}*/

 


function populateCountries(selectedCountry) {
    const countrySelect = document.getElementById('countrySelect');
    countrySelect.innerHTML = '';
    const countries = [
        'Afghanistan',
        'Albania',
        'Algeria',
        'American Samoa',
        'Andorra',
        'Angola',
        'Anguilla',
        'Antarctica',
        'Antigua and Barbuda',
        'Argentina',
        'Armenia',
        'Aruba',
        'Australia',
        'Austria',
        'Azerbaijan',
        'Bahamas (the)',
        'Bahrain',
        'Bangladesh',
        'Barbados',
        'Belarus',
        'Belgium',
        'Belize',
        'Benin',
        'Bermuda',
        'Bhutan',
        'Bolivia (Plurinational State of)',
        'Bonaire, Sint Eustatius and Saba',
        'Bosnia and Herzegovina',
        'Botswana',
        'Bouvet Island',
        'Brazil',
        'British Indian Ocean Territory (the)',
        'Brunei Darussalam',
        'Bulgaria',
        'Burkina Faso',
        'Burundi',
        'Cabo Verde',
        'Cambodia',
        'Cameroon',
        'Canada',
        'Cayman Islands (the)',
        'Central African Republic (the)',
        'Chad',
        'Chile',
        'China',
        'Christmas Island',
        'Cocos (Keeling) Islands (the)',
        'Colombia',
        'Comoros (the)',
        'Congo (the Democratic Republic of the)',
        'Congo (the)',
        'Cook Islands (the)',
        'Costa Rica',
        'Croatia',
        'Cuba',
        'Curaçao',
        'Cyprus',
        'Czechia',
        'Côte d-Ivoire',
        'Denmark',
        'Djibouti',
        'Dominica',
        'Dominican Republic (the)',
        'Ecuador',
        'Egypt',
        'El Salvador',
        'Equatorial Guinea',
        'Eritrea',
        'Estonia',
        'Eswatini',
        'Ethiopia',
        'Falkland Islands (the) [Malvinas]',
        'Faroe Islands (the)',
        'Fiji',
        'Finland',
        'France',
        'French Guiana',
        'French Polynesia',
        'French Southern Territories (the)',
        'Gabon',
        'Gambia (the)',
        'Georgia',
        'Germany',
        'Ghana',
        'Gibraltar',
        'Greece',
        'Greenland',
        'Grenada',
        'Guadeloupe',
        'Guam',
        'Guatemala',
        'Guernsey',
        'Guinea',
        'Guinea-Bissau',
        'Guyana',
        'Haiti',
        'Heard Island and McDonald Islands',
        'Holy See (the)',
        'Honduras',
        'Hong Kong',
        'Hungary',
        'Iceland',
        'India',
        'Indonesia',
        'Iran (Islamic Republic of)',
        'Iraq',
        'Ireland',
        'Isle of Man',
        'Israel',
        'Italy',
        'Jamaica',
        'Japan',
        'Jersey',
        'Jordan',
        'Kazakhstan',
        'Kenya',
        'Kiribati',
        'Korea (South)',
        'Korea (North)',
        'Kuwait',
        'Kyrgyzstan',
        'Laos',
        'Latvia',
        'Lebanon',
        'Lesotho',
        'Liberia',
        'Libya',
        'Liechtenstein',
        'Lithuania',
        'Luxembourg',
        'Macao',
        'Madagascar',
        'Malawi',
        'Malaysia',
        'Maldives',
        'Mali',
        'Malta',
        'Marshall Islands (the)',
        'Martinique',
        'Mauritania',
        'Mauritius',
        'Mayotte',
        'Mexico',
        'Micronesia (Federated States of)',
        'Moldova (the Republic of)',
        'Monaco',
        'Mongolia',
        'Montenegro',
        'Montserrat',
        'Morocco',
        'Mozambique',
        'Myanmar',
        'Namibia',
        'Nauru',
        'Nepal',
        'Netherlands (the)',
        'New Caledonia',
        'New Zealand',
        'Nicaragua',
        'Niger (the)',
        'Nigeria',
        'Niue',
        'Norfolk Island',
        'Northern Mariana Islands (the)',
        'Norway',
        'Oman',
        'Pakistan',
        'Palau',
        'Palestine, State of',
        'Panama',
        'Papua New Guinea',
        'Paraguay',
        'Peru',
        'Philippines (the)',
        'Pitcairn',
        'Poland',
        'Portugal',
        'Puerto Rico',
        'Qatar',
        'Republic of North Macedonia',
        'Romania',
        'Russian Federation (the)',
        'Rwanda',
        'Réunion',
        'Saint Barthélemy',
        'Saint Helena, Ascension and Tristan da Cunha',
        'Saint Kitts and Nevis',
        'Saint Lucia',
        'Saint Martin (French part)',
        'Saint Pierre and Miquelon',
        'Saint Vincent and the Grenadines',
        'Samoa',
        'San Marino',
        'Sao Tome and Principe',
        'Saudi Arabia',
        'Senegal',
        'Serbia',
        'Seychelles',
        'Sierra Leone',
        'Singapore',
        'Sint Maarten (Dutch part)',
        'Slovakia',
        'Slovenia',
        'Solomon Islands',
        'Somalia',
        'South Africa',
        'South Georgia and the South Sandwich Islands',
        'South Sudan',
        'Spain',
        'Sri Lanka',
        'Sudan (the)',
        'Suriname',
        'Svalbard and Jan Mayen',
        'Sweden',
        'Switzerland',
        'Syrian Arab Republic',
        'Taiwan',
        'Tajikistan',
        'Tanzania, United Republic of',
        'Thailand',
        'Timor-Leste',
        'Togo',
        'Tokelau',
        'Tonga',
        'Trinidad and Tobago',
        'Tunisia',
        'Turkey',
        'Turkmenistan',
        'Turks and Caicos Islands (the)',
        'Tuvalu',
        'Uganda',
        'Ukraine',
        'United Arab Emirates (the)',
        'United Kingdom of Great Britain and Northern Ireland (the)',
        'United States Minor Outlying Islands (the)',
        'United States of America (the)',
        'Uruguay',
        'Uzbekistan',
        'Vanuatu',
        'Venezuela (Bolivarian Republic of)',
        'Viet Nam',
        'Virgin Islands (British)',
        'Virgin Islands (U.S.)',
        'Wallis and Futuna',
        'Western Sahara',
        'Yemen',
        'Zambia',
        'Zimbabwe',
        ]; 
    
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        if (country === selectedCountry) {
            option.selected = true;
        }
        countrySelect.appendChild(option);
    });
}

/* Might use later

function savePreferredCurrencies() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const checkboxes = document.querySelectorAll('#preferredCurrenciesEdit input[type="checkbox"]:checked');
        let preferredCurrencies = Array.from(checkboxes).map(checkbox => checkbox.value);

        const user = JSON.parse(localStorage.getItem(loggedInUser));
        user.preferredCurrencies = preferredCurrencies;
        localStorage.setItem(loggedInUser, JSON.stringify(user));

        alert('Preferred currencies updated successfully.');
        // Hide the edit section and refresh the display
        document.getElementById('preferredCurrenciesEdit').style.display = 'none';
        populatePreferredCurrencies(preferredCurrencies);
    }
}*/

/*document.getElementById('savePreferredCurrenciesButton').addEventListener('click', savePreferredCurrencies);*/



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

    favorites.forEach((favorite, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = favorite;

        //creating delete button
 const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.backgroundColor = 'red';
        deleteButton.style.color = 'white';
        deleteButton.style.padding = '5px 10px'; 
        deleteButton.style.fontSize = '0.8rem'; 
        deleteButton.style.border = 'none'; 
        deleteButton.style.borderRadius = '5px'; 
        deleteButton.style.cursor = 'pointer'; 
        deleteButton.style.marginLeft = '10px'; 
        deleteButton.setAttribute('data-index', index); 

        deleteButton.addEventListener('click', function() {

            favorites.splice(this.getAttribute('data-index'), 1);           
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        });

        listItem.appendChild(deleteButton);
        favoritesList.appendChild(listItem);
    });
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
const loggedInUser = localStorage.getItem('loggedInUser');
const authButtons = document.getElementById('auth-buttons');
const userInfo = document.getElementById('user-info');

if(loggedInUser && userInfo) {
    userInfo.innerHTML = `Logged in as ${loggedInUser} <a href="#" id="logout">Logout</a>`;

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
        const inputUsername = document.getElementById('loginUsername').value.toLowerCase();
        const password = document.getElementById('loginPassword').value;
        let user = null;

        if (localStorage.getItem(inputUsername)) {
            user = JSON.parse(localStorage.getItem(inputUsername));
            if (user.password === password) {
                user.lastLoginDate = new Date().toISOString(); 
                localStorage.setItem(inputUsername, JSON.stringify(user));
                localStorage.setItem('loggedInUser', inputUsername);
                alert('Login successful');
                updateUIBasedOnLoginStatus();
                window.loadContent('home');
            } else {
                alert('Invalid username or password');
            }
        } else {
            alert('Invalid username or password');
        }
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

        const user = {
            username,
            email,
            password,
            creationDate: new Date().toISOString(),
            lastLoginDate: new Date().toISOString(),
            country: ''
        };

        let userExists = false;
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let existingUser = JSON.parse(localStorage.getItem(key));
            if (existingUser.username.toLowerCase() === username.toLowerCase()) {
                userExists = true;
                break;
            }
        }

        if (!userExists) {
            localStorage.setItem(username.toLowerCase(), JSON.stringify(user));
            alert('Registration successful');
            window.loadContent('login');
        } else {
            alert('A user with this username already exists.');
        }
    });
}
}

function updateToCurrencyOptions() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    
    if(fromCurrency && toCurrencySelect) {
=======
document.addEventListener('DOMContentLoaded', function() {
    updateToCurrencyOptions(); // calling it initially to set up correct "to" options
    document.getElementById('fromCurrency').addEventListener('change', updateToCurrencyOptions); // updating "to" options on "from" currency change

    document.getElementById('converterForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const amount = document.getElementById('amount').value;
        const fromCurrency = document.getElementById('fromCurrency').value;
        const toCurrency = document.getElementById('toCurrency').value;
        const resultElement = document.getElementById('conversionResult');

        try {
            const rate = await window.fetchConversionRate(fromCurrency, toCurrency);
            const convertedAmount = (amount * rate).toFixed(2);
            resultElement.innerHTML = `Converted Amount: ${convertedAmount} ${toCurrency}`;
            resultElement.style.display = 'block';

            // prepare the conversion history itemS
            const historyItem = {
                amount,
                fromCurrency,
                toCurrency,
                convertedAmount
            };

            // getting current history from localStorage or initializing an empty array if none exists
            const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
            history.push(historyItem);
            localStorage.setItem('conversionHistory', JSON.stringify(history));
        } catch (error) {
            resultElement.innerHTML = `Failed to convert. Please try again. Error: ${error.message}`;
            resultElement.style.display = 'block';
        }
    });

    function updateToCurrencyOptions() {
        const fromCurrency = document.getElementById('fromCurrency').value;
        const toCurrencySelect = document.getElementById('toCurrency');

        // removing existing options
>>>>>>> 3e696fa54d4dae72a7128331c5709257707219da
        while (toCurrencySelect.firstChild) {
            toCurrencySelect.removeChild(toCurrencySelect.firstChild);
        }

<<<<<<< HEAD
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

    try {
        const rate = await fetchConversionRate(fromCurrency, toCurrency);
        const convertedAmount = (amount * rate).toFixed(2);
        resultElement.innerHTML = `Converted Amount: ${convertedAmount} ${toCurrency}`;
        resultElement.style.display = 'block';

        const historyItem = { amount, fromCurrency, toCurrency, convertedAmount };
        const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
        history.push(historyItem);
        localStorage.setItem('conversionHistory', JSON.stringify(history));
        console.log("Updated History:", history);
    } catch (error) {
        resultElement.innerHTML = `Failed to convert. Please try again. Error: ${error.message}`;
        resultElement.style.display = 'block';
    }
});
}
;
=======
        // defying available currencies
        const currencies = ['USD', 'EUR', 'AUD', 'GBP', 'CAD', 'CHF', 'JPY', 'CNY', 'BAM'];
        const availableCurrencies = currencies.filter(currency => currency !== fromCurrency);

        // adding new options
        availableCurrencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.text = currency;
            toCurrencySelect.appendChild(option);
        });

        // resetting toCurrencySelect to first available option to ensure valid default selection
        toCurrencySelect.value = availableCurrencies[0];
    }
});
>>>>>>> 3e696fa54d4dae72a7128331c5709257707219da
