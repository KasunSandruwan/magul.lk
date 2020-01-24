const express = require('express');
const app = express();

app.disable('x-powered-by');

port = 4660;

app.use('/', express.static('public'));

app.all('/*', function(req, res, next) {
  res.sendFile('./public/index.html', { root: __dirname });
});

app.listen(port, function() {
  console.log('app up on port: ' + port);
});
