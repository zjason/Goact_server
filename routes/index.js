//in the nodejs index.js you should have this 

var express = require('express');

var router = express.Router();


var mongoose = require('mongoose');

// choose any name. It will create that db for you 
mongoose.connect('mongodb://localhost/myDB');


// creates a schema for your database 
var UsersSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: {
        type: String,
        required: true,
        unique: true

    }

});

var EventSchema = new mongoose.Schema({
    eventname: {
        type: String,
        required: true,
        unique: true
    },
    hostname: String,
    eventaddress: String,
    price: String,
    month: String,
    day: String,
    hour: String,
    min: String,
    type: String,
    email: String
});

// you will use this object for making queries 
var UsersModel = mongoose.model("UsersModel", UsersSchema);
var EventModel = mongoose.model("EventModel", EventSchema);

//default path 
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Hi there, welcome to default page'});
});


// you come up with your own URIs here 
// clients make GET and POST requests 
router.get("/give", function (req, res) {

    console.log("got this on the back end:", req.query);

// searching all of the entries that have the name that was passed 

// as parameter in req.query.name 
    UsersModel.find({username: req.query.name}, function (err, users) {

        if (users) {

            res.json(users);
        }

    })


});

// you come up with your own URIs here 
// clients make GET and POST requests 
router.get("/giveall", function (req, res) {

    console.log("got this on the back end:", req.query);

// searching all of the entries that have the name that was passed 

// as parameter in req.query.name 
    UsersModel.find({}, function (err, users) {

        if (users) {
//if you use res.send() the client wont be able to interpret json object 
            console.log("reposne is", users);
            res.json(users);
        }

    })

});


//simple example of how you can pass JSON to the client that 
//calls localhost:3000/hi 
router.get("/hi", function (req, res) {

    object = {
        "user": {
            "username": "Joe",
            "password": "Doe",
            "email": "JoeDoe@yahoo.com"
        }

    }

    res.send(object);
});

router.get("/getallevent", function (req, res){
    // as parameter in req.query.name
    EventModel.find({}, function (err, events) {

        if (events) {
//if you use res.send() the client wont be able to interpret json object
            console.log("reposne is", events);
            res.json(events);
        }else{
            res.json(null);
        }

    })

});

//clients upload json object here 
// the object is inside req 

router.post("/thisispost", function (req, res) {

    console.log("request is", req.body);

//making sure the object doesn't already exist 
    UsersModel.findOne({email: req.body.eventname}, function (err, user) {

//if exists send the client [null] 
        if (user) {

            res.json(null);
            return;
        }

//if not , create a new object and save it in the db 
        else {
            var newUser = new UsersModel(req.body);

            newUser.save(function (err, user) {
                if (err) {

                    console.log("could not save newly added user" + err);
                }
                else {
// once saved, send client ok! 
                    res.send("ok!");
                }
            });

        }

    })

});


router.post("/login", function (req, res) {
    console.log("request is", req.body.email);

    UsersModel.findOne({email: req.body.email}, function (err, user) {
       if(user) {
           console.log("login result",user.password);
           console.log("login result",req.body.password);
           if (user.password == req.body.password) {
               res.send("ok!");
               return;
           }
           else {
               res.json(null);
               return;
           }
       }
        else{
           res.json(null)
       }

    })
});

router.post("/postevent", function (req, res) {
    console.log("request is", req.body.eventname);

    EventModel.findOne({eventname: req.body.eventname}, function (err, event) {

//if exists send the client [null]
        if (event) {

            res.json(null);
            return;
        }

//if not , create a new object and save it in the db
        else {
            var newEvent = new EventModel(req.body);

            newEvent.save(function (err, user) {
                if (err) {

                    console.log("could not save newly added event" + err);
                }
                else {
// once saved, send client ok!
                    res.send("ok!");
                }
            });

        }

    })
});

router.post("/eventhistory", function(req,res){
    EventModel.find({email: req.body.email}, function (err, historyevent){
        console.log("request is", req.body.email);
        if (historyevent){
            res.json(historyevent);
            console.log("request is", historyevent);
        }
        else{
            res.json(null);
        }
    })
});

router.post("/eventdelete", function(req,res){
    EventModel.remove({eventname: req.body.eventname}, function (err, event){
        console.log("delete event is", req.body.eventname);
        if(event){
            res.json("delete!")
        }else {
            res.json(null);
        }
    })
});


module.exports = router; 