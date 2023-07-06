const express = require('express');
const app = express();
const router = require('./router');
const morgan = require('morgan');
const cors = require('cors');
app.use('/temp/uploads', express.static('temp/uploads'));


app.use(express.json());
app.use(cors());
app.use(router);
app.use(morgan('dev'));

module.exports = app;