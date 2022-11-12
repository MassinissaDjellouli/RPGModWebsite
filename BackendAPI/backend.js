"use strict"
const express = require('express');
const env = require('dotenv');
const jwt = require('jsonwebtoken');
env.config();

const PORT = process.env.PORT;
const SECRET = process.env.TOKEN_SECRET;
if(PORT == null || PORT == undefined) {
    console.log("Port not set");
    process.exit(1);
}



const APP = express();

require("./controllers/rootController")(APP);

APP.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
