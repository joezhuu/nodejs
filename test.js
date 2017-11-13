var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myquery = { _id: "joez" };
  var newvalues = {$set: {_id: "joez", image9: 1}};
  db.collection("customers").update(myquery, newvalues, {upsert:true}, function(err, dbres) {
    if (err) throw err;
    console.log("1 document updated");
  });
  var searchquery = { _id: "joez"};
  db.collection("customers").findOne(searchquery, function(err, dbres) {
    if (err) throw err;
for( var key in dbres) {
    if (key == null) {
        console.log('no image')
    } else{
        console.log(key)   
    }
}
  });
  db.close();
}); 