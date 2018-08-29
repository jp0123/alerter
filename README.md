# Alerter

An alert script that diagnoses whether orders have been successfully purchased or processed within a specified time frame.

# Setup
1. `npm install` in root directory.
2. Create `.env` file in root directory.
3. Set up `.env`.

## Environment variables

Please see the [.env.example](/.env.example) file in the root directory for guidance.

The `ACCESS_TOKEN_COOKIE` can be obtained by:
1. Log into <a href="https://test-admin.lescapes.com/">LE test admin portal</a>.
2. Open Web Developer Tools.
3. Navigate to the Application tab.
4. Open Cookies (Side menu under Storage section).
5. Click on the cookie `https://test-admin.lescapes.com/`.
6. On the table to the right, there should be a cookie named "access_token". If not, refresh the page. Copy the value and save it to the appropriate environment variable.

# Script
The script will:
1. API request - Fetch 10 of the most recent orders.
2. Check order status - Filter for pending and completed orders.
3. Analyse  - Determine if successful orders are coming in within the specified time frame.
5. Respond - Take appropriate action based on result.
    * Logs a 'warning' or 'success' message in the console. 
    * If no orders have been successfully purchased or processed within a specified time limit, the script will execute `process.end(1)`.

    