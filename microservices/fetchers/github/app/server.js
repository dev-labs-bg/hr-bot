'use strict';

const express = require('express');
const githubapi = require('github');
const mongo = require('mongodb').MongoClient;
var sinceindex = 0;
mongo.connect("mongodb://mongo:27017", function (err, db) {

    //cursor for going through the database
    var cursor = db.collection('index-number').find();
    cursor.forEach(function(doc, err) {
        //saving the last databse entry as sinceindex
        sinceindex = doc.index;
    });
});
var github = new githubapi({
    debug: true,
    protocol: "https",
    host: "api.github.com",
    pathPrefix: "",
    headers: {
        "user-agent": "HR_Bot"
    },
    Promise: require('bluebird'),
    followRedirects: false,
    timeout: 5000
});

const PORT = 8080;

const app = express();

app.get('/', function (req, res) {
  res.send('Hello world :)\n');
});

app.get('/fetch', function (req, res) {
  github.users.getAll({
    since:sinceindex
  }, function(err, res2) {
        //extracting the number from the full link
        res.send(JSON.stringify(res2));
        var full_string = res2.meta.link;
        var start_pos = full_string.indexOf('=') + 1;
        var end_pos = full_string.indexOf('>',start_pos);
        var link = full_string.substring(start_pos,end_pos);
        sinceindex = parseInt(link);

        mongo.connect("mongodb://mongo:27017", function (err, db) {
            var index = {index: sinceindex};
            //when a new page is /fetch-ed the sinceindex increased. will fix so that it doesn't add new entries, only updating one
            db.collection('index-number').insertOne(index, function(err, result){
            console.log("Item inserted ", sinceindex);

            });

        });

    })
});

app.get('/fetch_reset', function (req, res) {
    sinceindex = 0;
    res.send("fetch reset");
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
