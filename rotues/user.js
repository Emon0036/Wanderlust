const express = require("express");
const router = express.Router();
const user = require("../model/user.js");
const wrapAsyn = require("../Utility/wrapAsyn.js");
const passport = require("passport");

router.get("/signup",  (req, res) => {
    res.render("signup.ejs");
});

router.post("/signup", wrapAsyn(async (req, res) => {
    try {
          const { username,email, password } = req.body;
    const newUser = new user({ username, email});
    await user.register(newUser, password);
    req.flash("success", "You have successfully signed up");
    res.redirect("/listing");
    } catch (e) {
        req.flash("error", e.message);
         res.redirect("/signup");
  }
}));



router.get("/login",  (req, res) => {
    res.render("login.ejs");
});


router.post("/login", 
  passport.authenticate("local", { failureRedirect: '/login',failureFlash:true }),
    async (req, res) => {
        req.flash("success", "Welcome back");
        res.redirect("/listing");
    });
  

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