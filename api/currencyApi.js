async function fetchConversionRate(fromCurrency, toCurrency) {
    const url = 'https://currency-exchange.p.rapidapi.com/exchange';
    const params = new URLSearchParams({
        from: fromCurrency,
        to: toCurrency,
        q: '1.0'
    });

    try {
    const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
                'X-RapidAPI-Key': '77a115c01bmsh20675ae64db4257p142853jsndf4d51ffac46',
                'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
        }

    const rate = await response.text();
    return rate;
    } catch (error) {
        console.error('Error fetching conversion rate:', error);
        throw error;
    }
}
window.fetchConversionRate = fetchConversionRate;

