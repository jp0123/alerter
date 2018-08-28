require('dotenv-safe').config();
const express = require("express");
const app = express();

app.get('/', (req, res) => res.send('Hello, World!'))

/** SERVER */
const port = process.env.PORT || 9000;
app.listen(port, () =>
    console.log(`Server is running on port ${port} successfully!`)
);