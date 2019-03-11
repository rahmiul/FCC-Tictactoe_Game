var express = require('express');
var app = express();
app.use(express.static('public'));


var listener = app.listen(3000);