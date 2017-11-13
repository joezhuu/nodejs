const express = require('express')
const app = express()
const router = express.Router();
const qr = require('qr-image');
const path = require("path");
const mongo = require('mongodb'); 
const tableName = "customers";

var MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017/mydb";



//router.get('/1', (req, res) => res.sendFile(path.join(__dirname,'found1.html')))
//router.get('/2', (req, res) => res.sendFile(path.join(__dirname,'found2.html')))
router.get('/1', function(req, res){
    var openid = getopenid(req);
    //update database
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var myquery = { _id: openid };
      var newvalues = {$set: {_id: openid, image1: 1}};
      db.collection("customers").update(myquery, newvalues, {upsert:true}, function(err, dbres) {
        if (err) throw err;
      });
        var searchquery = { _id: openid, image1: 1, image2: 1, image3: 1};
      db.collection("customers").findOne(searchquery, function(err, dbres) {
        if (err) throw err;
        if (dbres == null) {
            res.send('<H1> More to go !!!</H1>')
        } else {
            res.send('<H1> Great, you have found all of them.<br>here is your reward !!!</H1>')
        }
      });
      db.close();
    }); 
});

router.get('/4', function(req, res) { 
    res.send(req.connection.remoteAddress
    )
});

router.get('/qr', function(req,res){
   var code = qr.image('abc', {
        type: 'png', 
        ec_level: 'H', 
        size: 10, 
        margin: 0 
    });
   console.log(code.read())
   res.setHeader('Content-type', 'image/png');
   code.pipe(res);
});

app.use('/api', router)
app.listen(3000, () => console.log('Example app listening on port 3000!'))


function getopenid(req){
    const https = require('https');    
    const appid = 'wxeb5106025cb19480'
    const appsecret = '965637b529c03eca39fa239dadc1f3cd'
    //get wechat code
    var httpslink = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appid+'&secret='+appsecret+'&code='+req.query.code+'&grant_type=authorization_code'
    https.get(httpslink, (resp) => {
        var body = "";
        resp.on("data", data => {
          body += data;
        });
        resp.on("end", () => {
          body = JSON.parse(body);
          //find the wechat openid
          return body.openid;
          //update database
        });
    });
}