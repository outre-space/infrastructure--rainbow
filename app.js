const express = require('express');
const path = require('path');
const logger = require('morgan');
require('dotenv').config();

const Rainbow = require('./lib/App');

const app = express();
logger.token('body', (req) => JSON.stringify(req.body))

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.resolve('public')));
app.use(logger('combined'));

Rainbow.start(express.Router()).then(router => app.use('/', router));

module.exports = app;
