const user = require("../model/user.js");
const passport = require("passport");
const {originalUrl} = require("../isLogedin.js");


//signUp
module.exports.signup = async (req, res) => {
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
};

//login
module.exports.login = async (req, res) => {
        req.flash("success", "Welcome back");
        if(res.locals.originalUrl)
        {
            res.redirect(res.locals.originalUrl);
        }
        else
        {
           res.redirect("/listing");
        }
        
    };