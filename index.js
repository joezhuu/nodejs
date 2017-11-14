const express = require('express')
const app = express()
const router = express.Router();
const qr = require('qr-image');
const path = require("path");
const mongo = require('mongodb');
const https = require('https');
const tableName = "customers";

var MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017/mydb";
app.use(express.static('pages'));

const appid = 'wxeb5106025cb19480'
const appsecret = '965637b529c03eca39fa239dadc1f3cd'
const total = 3
for (var i = 0; i <= total; i++) {
    app.get('/'+i, function (req, res) {
        var imageid = req.path.substr(1)
        //get wechat code
        var httpslink = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appid + '&secret=' + appsecret + '&code=' + req.query.code + '&grant_type=authorization_code'
        https.get(httpslink, (resp) => {
            var body = "";
            resp.on("data", data => {
                body += data;
            });
            resp.on("end", () => {
                body = JSON.parse(body);
                //find the wechat openid
                openid = body.openid;
                //update database
                MongoClient.connect(url, function (err, db) {
                    if (err) throw err;
                    var myquery = { _id: openid };
                    //db.collection("customers").findOne(myquery, function (err, dbres) {
                    //if (err) throw err;
                    //if (dbres == null) {
                    //res.send('<form action="http://httpbin.org/post" method="post">Phone number:<br><input type="text" name="phone"/><br><input type="submit" value="Submit"/><input type="hidden" value='+openid+' name="openid"/></form>')
                    //res.send('<form action="/api/1" method="post">Phone number:<br><input type="text" name="phone"/><br><input type="submit" value="Submit"/><input type="hidden" value="2131241" name="openid"/></form>')
                    //db.close();
                    //} else {
                    var image = "image"+imageid
                    var newvalues = { $set: { _id: openid, [image]: 1 } };
                    db.collection("customers").update(myquery, newvalues, { upsert: true }, function (err, dbres) {
                        if (err) throw err;
                    });
                    db.collection("customers").findOne(myquery, function (err, dbres) {
                        var cnt = 0
                        for (var key in dbres) {
                            if (key.substr(0, 5) == "image") {
                                cnt += 1
                            }
                        }
                        if (cnt == total) {
                            res.sendFile(path.join(__dirname, "pages", "foundall.html"));
                        } else {
                            res.sendFile(path.join(__dirname, "pages", "found"+cnt+".html"));
                        }
                        db.close();
                    });
                    //}
                    //});

                });
            });
        });
    });
}
    router.post('/1', function (req, res) {
        console.log(req);
        var body = "";
        req.on("data", data => {
            body += data;
        });
        req.on("end", () => {
            body = JSON.parse(body);
            var openid = body.openid;
            //update database
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var myquery = { _id: openid };
                var newvalues = { $set: { _id: openid, image1: 1, phone: body.phone } };
                db.collection("customers").update(myquery, newvalues, { upsert: true }, function (err, dbres) {
                    if (err) throw err;
                    res.send('<h1>updated<h1/>')
                    db.close();
                });
            })
        });
    });
    app.get('/4', function (req, res) {
        res.send(req.connection.remoteAddress
        )
    });
    app.get('/qr', function (req, res) {
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

    app.listen(3000, () => console.log('Example app listening on port 3000!'))
