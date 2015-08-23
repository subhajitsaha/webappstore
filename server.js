//Module Dependencies
var express = require("express"),
    bodyParser = require('body-parser'),
    multer  = require('multer'),
    mustache = require("mustache"),
    consolidate = require("consolidate"),
    approutes = require('./routes/routes'),
    http = require('http'),
    path = require('path');
    
var app = express();

//All environments
app.engine('mustache', consolidate.mustache);
app.set('port', process.env.PORT || 3000, process.env.IP || "0.0.0.0");
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.set('card_detail_url', 'ec2-52-27-92-14.us-west-2.compute.amazonaws.com');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Functions
function sendResponse(err, result, resp){
  //console.log('under sendResponse');
  
  var objResp = {
    error: false,
    message: 'success',
    data: ''
  };
  
  if (err === null) {
    //resp.send(JSON.stringify(result)); 
    objResp = {
      error: false,
      message: 'success',
      data: result
    };
  } else {
    objResp = {
      error: true,
      message: 'error',
      data: 'no data'
    };
    //resp.send('{error: true, message: "no data"}');
  }
  
  resp.send(JSON.stringify(objResp));
}

function fetchCardDetail (id, resp) {
  var options = {
    host: app.get('card_detail_url'),
    path: '/card/' + id,
    port: '8888',
    method: 'GET'
  };
  
  http.get(options, function(res) {
    //console.log("Got response: " + res.statusCode);
    res.setEncoding('utf8');
    
    var body = '';
    
    res.on('data', function(d) {
      body += d;
    });
    
    res.on('end', function() {
      try {
          var parsed = JSON.parse(body);
          //console.log('No error ' + body);
      } catch (err) {
          //console.error('Unable to parse response as JSON', err);
          return sendResponse(err, '', resp);
      }
      
      sendResponse(null, parsed, resp);
    });
  }).on('error', function(e) {
    //console.log("Got error: " + e.message);
    return sendResponse(e.message, '', resp);
  });
}

//Homepage
app.get('/', approutes.home);

//Card home
app.get('/card', approutes.card);

//Fetch card detail
app.get('/getcard/:id', function(req, res, next) {
  //console.log('Request received ' + req.params.id);
  fetchCardDetail(req.params.id, res);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});