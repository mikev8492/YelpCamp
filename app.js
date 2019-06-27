const express = require('express');
const app = express();
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('landing');
});

app.listen(3000, function(){
  console.log('YelpCamp Serving to port 3000');
});
