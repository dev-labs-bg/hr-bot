'use strict';

var request = require('request');
var http = require('http');
const express = require('express');
const githubapi = require('github');
const mongo = require('mongodb').MongoClient;

var lastReachedIndex = 0;

//mongo and github initialization
mongo.connect("mongodb://mongo:27017", function (err, db) {

    //cursor for going through the database
    var cursor = db.collection('index-number').find();
    cursor.forEach(function(doc, err) {
        //saving the last databse entry as lastReachedIndex
        lastReachedIndex = doc.index;
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

github.authenticate({
    type: "oauth",
    token: "58870b963599faddb13509af74b9b13a1ef63161"

})

const PORT = 8080;
const app = express();

app.get('/fetch', function (req, res) {
  var firstname, lastname, email, languages = [];
  github.users.getAll({
    since:lastReachedIndex
  }, function(err, res2) {
            firstname = lastname = email = "";
            languages = [];
            //extracting the index from the full link
            var full_user_link = res2[1].url;
            var user = full_user_link.substring(full_user_link.lastIndexOf("/") + 1, full_user_link.length);
            github.users.getForUser({ 
                user: user
             }, function(err, res3){
                //extracting both names from the name string
                if (res3.name!=null){
                    var fullname = res3.name.split(" ");
                    firstname = fullname[0];
                    if (fullname.length > 1){
                        lastname = fullname[1];
                    }
                }
                if (res3.email!=null){
                    email = res3.email;
                }
                github.repos.getForUser({ 
                    user: user

                 }, function(err, res4){
                    //getting the skills array from user's repos
                    for (var j = 0; j<res4.length; j++){
                        var isNotDuplicate = true;
                        //removes duplicates
                        for (var k = 0; k<languages.length; k++){
                            if (res4[j].language == languages[k] || res4[j].language == null) isNotDuplicate = false;
                        }
                        if (isNotDuplicate){
                            languages.push(res4[j].language);
                            isNotDuplicate = true;
                        }
                    }
                    //proper formatting
                    var skills = [];
                    for (var j = 0; j<languages.length; j++){
                        skills.push({
                            'name': languages[j]
                        })
                    };

                    postToDb(res, firstname, lastname, email, skills);

                 });
             });
        
        saveIndexToMongo(res2);

    })
});

//posts the json to the database. doesn't work due to docker container linking
function postToDb(res, firstname, lastname, useremail, skills){
    var data = {
                        'email' : useremail,
                        'first_name' : firstname,
                        'last_name' : lastname,
                        'skills' : skills
                    };
                    res.send(data);

                    var headers = {
                        'Content-Type':     'application/json'
                    }

                    var options = {
                    url: 'http://nginx/app_dev.php/users',
                    method: 'POST',
                    headers: headers,
                    form: {
                        'email' : useremail,
                        'first_name' : firstname,
                        'last_name' : lastname,
                        'skills' : skills
                    }
                    }

                    request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                    console.log(body)
                    } else {
                    }
                    })
}

//saves the last reached index in mongodb.
function saveIndexToMongo(res2){
    var full_string = res2.meta.link;
    var start_pos = full_string.indexOf('=') + 1;
    var end_pos = full_string.indexOf('>',start_pos);
    var link = full_string.substring(start_pos,end_pos);
    lastReachedIndex = parseInt(link);
    mongo.connect("mongodb://mongo:27017", function (err, db) {
            var index = {index: lastReachedIndex};
            //when a new page is /fetch-ed the lastReachedIndex increased. will fix so that it doesn't add new entries, only updating one
            db.collection('index-number').insertOne(index, function(err, result){
            console.log("Item inserted ", lastReachedIndex);

            });

        });
}

//resets the last reached index.
app.get('/fetch_reset', function (req, res) {
    lastReachedIndex = 0;
    res.send("fetch reset");
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
