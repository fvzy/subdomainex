var MongoClient = require('mongodb').MongoClient;
exports.user = (req, res, next) => {
 if(req.user == null){
res.redirect('/auth');
} else {
let user = req.user
var url = "mongodb://localhost:27017/";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
var dbo = db.db("subdo");
dbo.collection("users").findOne({username: user.username}, function(err, result) {
if (err) throw err;
res.render('account', {user: user, sub: result});
console.log(result);
next()
  });
});
}
};
