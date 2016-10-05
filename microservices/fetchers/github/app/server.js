'use strict';

const express = require('express');
const githubClient = require('github-client');

// Constants
const PORT = 8080;

// App
const app = express();
app.get('/', function (req, res) {
  res.send('Hello worldss :)))\n');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
