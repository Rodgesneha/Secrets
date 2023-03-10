require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = mongoose.Schema({
    username : String,
    password : String
});



const User = new mongoose.model("User",userSchema);

app.get("/", function(req, res){
    res.render("home");
})
app.get("/login", function(req, res){
    res.render("login");
})
app.get("/register", function(req, res){
    res.render("register");
})

app.post("/register", function(req, res){
    const newUser = new User({
        username: req.body.username,
        password : md5(req.body.password)
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    })
})

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({username : username}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    })
})

app.listen("3000", function(){
    console.log("Server running on port 3000");
})