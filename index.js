'use strict'

var express  = require('express');
var app      = express();
var port     = process.env.PORT || 5000;

// Pull information from HTML POST (express4)
var bodyParser     = require('body-parser');

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended':'true'}));

// Parse application/json
app.use(bodyParser.json());

// Parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Routes
// require('./routes/api-ai.js')(app);
app.get('/', function (req, res) {
  res.send('Welcome to the Index Route');
});

app.get('/terms', function(req, res){
  res.sendfile('privacy-policy.html', { root: __dirname + "/screens" } );
});

app.use('/webhook/api', require('./routes/api-ai.js'));

// Listen (start app with node index.js)
app.listen(port);
