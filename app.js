//jshint esversion: 6

const express = require('express');
const app = express();
app.use(express.static('public')); //To render my static files
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const request = require('request');
const https = require('https');


app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html');
});


app.post('/', function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = 'https://us7.api.mailchimp.com/3.0/lists/417ba350cd';

    const options = {
        method: "POST",
        auth: "andrea1:358f48741c0379c26600642c9d677211-us7"
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post('/failure', function(req, res){
    res.redirect('/');
});


app.listen(process.env.PORT || 3000, ()=>{
    console.log('Server is running');
});


//Mailchimp API key 358f48741c0379c26600642c9d677211-us7

//Mailchimp List ID 417ba350cd