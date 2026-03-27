const express = require("express");
const router = express.Router();
const wrapAsyn = require("../Utility/wrapAsyn.js");
const passport = require("passport");
const {originalUrl} = require("../isLogedin.js");
const controler = require("../Controler/user.js");

router.get("/signup",  (req, res) => {
    res.render("signup.ejs");
});

router.post("/signup", wrapAsyn(controler.signup));


router.get("/login", (req, res) => {
    res.render("login.ejs");
});

//login
router.post("/login",originalUrl,  
  passport.authenticate("local", { failureRedirect: '/login',failureFlash:true }),
  wrapAsyn(controler.login)
    );
  

//logout   
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have successfully loged out!");
        res.redirect("/listing");
    }); 
});


module.exports = router;