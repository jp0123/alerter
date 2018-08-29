require('dotenv-safe').config();
const fetch = require('node-fetch')

const url = `${process.env.URL}${process.env.BRAND}`;

const fetch_object = {
    method: "GET",
    credentials: 'include',
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cookie": `access_token=${process.env.ACCESS_TOKEN_COOKIE}`
    }
}

// API | Fetch 10 of the most recent orders
const ordersAPI = fetch(url, fetch_object)
    .then(response => {
        return response.json();
    })
    .then(jsonResponse => {
        return jsonResponse;
    });

ordersAPI
    // Status check | Filter for pending and completed orders
    .then(orders => {
        const ordersAPI = orders.result;
        const pendingOrders = ordersAPI.filter(order => {
            return order.status === `${process.env.ORDER_STATUS_PENDING}`;
        })
        const completedOrders = ordersAPI.filter(order => {
            return order.status === `${process.env.ORDER_STATUS_COMPLETED}`;
        })
        const successfulOrders = [];
        successfulOrders.push(...pendingOrders, ...completedOrders);
        return successfulOrders;
    })
    // Delta check | Determine how long it has been since these orders been purchased or processed
    .then(orders => {
        const currentTime = Date.now();
        const timeFrame = Number(process.env.TIME_FRAME); // 15 minutes in milliseconds
        const timeFrameInMinutes = Math.round((timeFrame / 1000 / 60));
        let successfulOrdersWithinTimeFrameCounter = 0;
        // Check order | Has it been ordered within the specified time frame?
        orders.forEach(order => {
            const orderProcessed = Date.parse(order.created_at);
            const delta = currentTime - orderProcessed; // Milliseconds
            if (timeFrame > delta) { // Successful orders within the last timeFrame
                successfulOrdersWithinTimeFrameCounter += 1;
            }
        })
        // Diagnosis | Are successful orders coming in the specified time frame?
        if (successfulOrdersWithinTimeFrameCounter === 0) {
            console.log(`WARNING: No orders have been successfully purchased or processed for at least ${timeFrameInMinutes} minutes!`);
            process.exit(1);
        } else {
            console.log(`SUCCESS: ${successfulOrdersWithinTimeFrameCounter} of the last 10 orders have been successfully purchased or processed within the last ${timeFrameInMinutes} minutes.`)
        }
    });