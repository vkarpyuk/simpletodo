/**
 * Created by vkarpyuk on 28/11/16.
 */
var PORT = 8000 || process.env.PORT;
var mainRouter = require('./routes/index');
var apiRouter = require('./routes/api');

// var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', mainRouter);

app.use('/api', apiRouter);

app.set('views', __dirname + '/client/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'client')));

app.listen(PORT, function() {
    console.log('Listening on port ' + PORT);
});
