var express = require('express');
var app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json())
require('./api/routes')(app);

var path = require('path');
app.use("/", express.static('./'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});



app.listen("3000", ()=>console.log("on 3000"));
