var express = require('express')
var app = express()
var router = express.Router();
var qr = require('qr-image');
var path = require("path");
var mongo = require('mongodb'); 

app.get('/1', (req, res) => res.sendFile(path.join('C:/Users/Joe/myapp','found1.html')))
app.get('/2', (req, res) => res.sendFile(path.join('C:/Users/Joe/myapp','found2.html')))
app.get('/3', (req, res) => res.sendFile(path.join('C:/Users/Joe/myapp','found3.html')))
app.get('/4', (req, res) => res.send(req.connection.remoteAddress))

router.get('/qr/:text', function(req,res){
   var code = qr.image('abc', { type: 'png', ec_level: 'H', size: 10, margin: 0 });
   res.setHeader('Content-type', 'image/png');
   code.pipe(res);
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))