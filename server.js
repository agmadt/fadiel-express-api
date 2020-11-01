require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);

module.exports = app;