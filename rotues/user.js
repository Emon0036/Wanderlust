const express = require("express");
const router = express.Router();
const user = require("../model/user.js");
const wrapAsyn = require("../Utility/wrapAsyn.js");
const passport = require("passport");
const {originalUrl} = require("../isLogedin.js");

router.get("/signup",  (req, res) => {
    res.render("signup.ejs");
});

router.post("/signup", wrapAsyn(async (req, res) => {
    try {
    const { username,email, password } = req.body;
    const newUser = new user({ username, email});
    await user.register(newUser, password);

 //It's also a method for automatic login after signup
 req.login(newUser, (err)=> {
  if (err) { 
    return next(err);
   }
    
   req.flash("success", "You have successfully signed up");
   res.redirect("/listing");
  
});
    
    } catch (e) {
        req.flash("error", e.message);
         res.redirect("/signup");
  }
}));



router.get("/login", (req, res) => {
    res.render("login.ejs");
});


router.post("/login",originalUrl,  
  passport.authenticate("local", { failureRedirect: '/login',failureFlash:true }),
    async (req, res) => {
        req.flash("success", "Welcome back");
        if(res.locals.originalUrl)
        {
            res.redirect(res.locals.originalUrl);
        }
        else
        {
           res.redirect("/listing");
        }
        
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