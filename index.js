var express = require('express');
var app = express();

const userRoute = require('./api/routes/user.route');

app.use('/api/user',userRoute);


var path = require('path');
app.use("/", express.static('./'));
// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


app.get('/api/test',(req,res)=>{
    res.send([1,2,3,4,7]);
})



app.listen("3000", ()=>console.log("on 3000"));