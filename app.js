const express = require('express');
const path = require('path');
const logger = require('morgan');
require('dotenv').config();

const apiRouter = require('./routes/api');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

logger.token('body', (req, res) => JSON.stringify(req.body))
// app.use(logger(':remote-user [:date[clf]] :method :url HTTP/:http-version" :status :body'));


app.use('/api', apiRouter);


module.exports = app;
