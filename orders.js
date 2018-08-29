require('dotenv-safe').config();
const fetch = require('node-fetch');

const url = `${process.env.URL}${process.env.BRAND}`;

const fetch_object = {
    method: "GET",
    credentials: 'include',
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cookie": `access_token=${process.env.ACCESS_TOKEN_COOKIE}`
    }
};

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
        });
        const completedOrders = ordersAPI.filter(order => {
            return order.status === `${process.env.ORDER_STATUS_COMPLETED}`;
        });
        const successfulOrders = [];
        successfulOrders.push(...pendingOrders, ...completedOrders);
        return successfulOrders;
    })
    // Check orders | Determine if successful orders are coming in within the specified time frame
    .then(orders => {
        let successfulOrdersWithinTimeFrameCounter = 0;
        const currentTime = Date.now();
        const timeFrame = Number(process.env.TIME_FRAME); // 15 minutes in milliseconds
        const timeFrameInMinutes = Math.round((timeFrame / 1000 / 60));
        orders.forEach(order => {
            const orderProcessed = Date.parse(order.created_at);
            // Delta check | Determine how long it has been since these orders been purchased or processed 
            const delta = currentTime - orderProcessed;
            if (timeFrame > delta) {
                successfulOrdersWithinTimeFrameCounter += 1;
            };
        })
        // Response | Take appropriate action based on result
        if (successfulOrdersWithinTimeFrameCounter === 0) {
            const warningNotification = `WARNING: No orders have been successfully purchased or processed for at least ${timeFrameInMinutes} minutes!`;
            console.log(warningNotification);
            process.exit(1);
        } else {
            const successNotification = `SUCCESS: ${successfulOrdersWithinTimeFrameCounter} of the last 10 orders have been successfully purchased or processed within the last ${timeFrameInMinutes} minutes.`;
            console.log(successNotification);
        };
    });