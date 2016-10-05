'use strict';

const express = require('express');
const githubapi = require('github');

var github = new githubapi({
    // optional args
    debug: true,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    pathPrefix: "", // for some GHEs; none for GitHub
    headers: {
        "user-agent": "HR_Bot" // GitHub is happy with a unique user agent
    },
    Promise: require('bluebird'),
    followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
    timeout: 5000
});

// Constants
const PORT = 8080;

// App
const app = express();
var sinceIndex = 1;

app.get('/', function (req, res) {
  res.send('Hello world :)\n');
});

app.get('/fetch', function (req, res) {
  github.users.getAll({
    since:sinceIndex
  }, function(err, res2) {
        res.send(JSON.stringify(res2));
        console.log("console: ", res2.meta.link + " asd");
    // if (github.hasNextPage(res2)) {
    //    github.getNextPage(res2, function(err, res3) {
    //         res.send(JSON.stringify(res2));
    //    });
    // }
    })
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
