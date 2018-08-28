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

ordersAPI
    // Status check | Get only pending or completed orders
    .then(orders => {
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
    // Time check | Are orders coming in?
    .then(orders => {
        const current_time = Date.now();
        const time_frame = Number(process.env.TIME_FRAME);
        orders.forEach(order => {
            const order_id = order.id_orders;
            const order_processed = Date.parse(order.created_at)
            const delta = current_time - order_processed
            const deltaInMinutes = Math.round((delta / 1000 / 60));
            if (time_frame < delta) {
                return process.exit(1)
            }
            console.log(`Order ${order_id} has been successfully processed ${deltaInMinutes} minutes ago.`)
        })
    })





