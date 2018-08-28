require('dotenv-safe').config();
const fetch = require('node-fetch')

const url = `https://test-api.luxgroup.com/api/orders?booking_numbers=&page=1&per_page=10&brand=${process.env.BRAND}`;

const fetch_object = {
    method: "GET",
    credentials: 'include',
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cookie": `access_token=${process.env.ACCESS_TOKEN_COOKIE}`
    }
}

// Fetch 10 of the most recent orders
const ordersAPI = fetch(url, fetch_object)
    .then(response => {
        return response.json();
    })
    .then(jsonResponse => {
        return jsonResponse;
    });

ordersAPI.then(orders => {
    const ordersAPI = orders.result;
    const pendingOrders = ordersAPI.filter(order => {
        return order.status === 'pending';
    })
    const completedOrders = ordersAPI.filter(order => {
        return order.status === 'completed';
    })
    const successfulOrders = [];
    successfulOrders.push(...pendingOrders, ...completedOrders);
    return successfulOrders;
})



