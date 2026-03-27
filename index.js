//credentials

if(process.env.NODE_ENV !="production")
{
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./model/listing.js");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const customError = require("./Utility/expressError.js"); 
const session = require("express-session");  
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");


const listing = require("./rotues/listing.js");
const review = require("./rotues/review.js");
const user = require("./rotues/user.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "/public")));

const sessions = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};



main().then(()=>{
    console.log("Server is working");
}).catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

}

// All these are for athuentication
app.use(session(sessions));
app.use(flash());

//It's from passport
app.use(passport.initialize());
app.use(passport.session());

//It's from passport local mongoose
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middle ware for show flash message
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.userInfo = req.user; 
    next();
});

app.use("/listing", listing);
app.use("/listing/:id/review", review);
app.use("/", user);




app.use((req, res,next) => {
    next(new customError(404, "Page not found"));  
});


//middleware
app.use((err, req, res,next) => {
    let { status=500, message="Something went wrong" } = err;
    res.status(status).render("error.ejs",{err});
});





app.listen(8080,()=>{
  console.log("server is running");
});

app.get("/",(req,res)=>{
    res.send("Welcome into this page");
})