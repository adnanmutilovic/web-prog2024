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
        while (toCurrencySelect.firstChild) {
            toCurrencySelect.removeChild(toCurrencySelect.firstChild);
        }

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
