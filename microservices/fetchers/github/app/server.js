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

github.authenticate({
    type: "oauth",
    token: "58870b963599faddb13509af74b9b13a1ef63161"

})

app.get('/', function (req, res) {
  res.send('Hello world :)\n');
});

app.get('/fetch', function (req, res) {
  var firstname, lastname, useremail, languages = [], fullname = [];
  github.users.getAll({
    since:sinceindex
  }, function(err, res2) {
        //extracting the number from the full link. also, some magic
        for (var i = 0; i<1; i++){
            firstname = lastname = useremail = "";
            languages = fullname = [];
            var full_user_link = res2[i].url;
            var user = full_user_link.substring(full_user_link.lastIndexOf("/") + 1, full_user_link.length);
            github.users.getForUser({ 
                user: user
             }, function(err, res3){
                //extracting both names from the name string
                if (res3.name!=null){
                    fullname = res3.name.split(" ");
                    firstname = fullname[0];
                    if (fullname.length > 1){
                        lastname = fullname[1];
                    }
                }
                if (res3.email!=null){
                    useremail = res3.email;
                }
                github.repos.getForUser({ 
                    user: user

                 }, function(err, res4){
                    //getting the skills array from user's repos
                    for (var j = 0; j<res4.length; j++){
                        var shouldAdd = true;
                        for (var k = 0; k<languages.length; k++){
                            if (res4[j].language == languages[k] || res4[j].language == null) shouldAdd = false;
                        }
                        if (shouldAdd){
                            languages.push(res4[j].language);
                            shouldAdd = true;
                        }
                    }
                    var skills = [{}];
                    for (var j = 0; j<languages.length; j++){
                        skills.push({
                            'name': languages[j]
                        })
                    };

                    var data = {
                        'email' : useremail,
                        'first_name' : firstname,
                        'last_name' : lastname,
                        'skills' : languages
                    };
                    // res.send(data);
                    // console.log(data);

                 });
             });
        }
        //res.send(JSON.stringify(res2));
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
