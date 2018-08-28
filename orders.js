require('dotenv-safe').config();
const fetch = require('node-fetch')

const brand = "luxuryescapes";
const url = `https://test-api.luxgroup.com/api/orders?booking_numbers=&page=1&per_page=10&brand=${brand}`;

const fetch_object = {
    method: "GET",
    credentials: 'include',
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cookie": `access_token=${process.env.ACCESS_TOKEN_COOKIE}`
    }
}

fetch(url, fetch_object)
    .then(response => {
        return response.json();
    })
    .then(ordersAPI => {
        console.log(ordersAPI);
    });