//jshint esversion:6
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
const app = express();

mongoose.connect("mongodb://localhost:27017/userDB");
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.render("home");
})
app.get("/login",function(req,res){
  res.render("login");
})
app.get("/register",function(req,res){
  res.render("register");
})

const userSchema = new mongoose.Schema({
  email : String,
  password: String
});
const secrets = process.env.SECRETS;
userSchema.plugin(encrypt, { secret: secrets,encryptedFields: ["password"]});


const User = new mongoose.model("User",userSchema);

app.post("/register",function(req,res){
  const NewUser = new User({
    email: req.body.username,
    password : req.body.password
  });
  NewUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email:username},function(err,foundResults){
    if(err){
      console.log(err);
    }
    else if(foundResults){
      if(foundResults.password === password){
        res.render("secrets");
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
