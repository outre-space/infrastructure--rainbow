const express = require('express');
const path = require('path');
const logger = require('morgan');
require('dotenv').config();

const apiRouter = require('./routes/api');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.resolve('public')));

logger.token('body', (req, res) => JSON.stringify(req.body))
app.use(logger('combined'));

app.use('/', apiRouter);


module.exports = app;
