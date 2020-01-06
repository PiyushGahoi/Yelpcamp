var express=require('express'),
    app=express(),
    bodyParser=require('body-parser'),
    passport=require('passport'),
    methodOverride=require('method-override'),
    LocalStrategy=require('passport-local'),
    flash=require('connect-flash'),
    User=require('./models/user'),
    mongoose=require('mongoose'),
    seeds=require("./seeds");

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true,useFindAndModify:false});
app.set('view engine', "ejs");
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(require('express-session')({
    secret: "Android is a great OS",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
res.locals.currentUser =req.user;
res.locals.error=req.flash("error");
res.locals.success=req.flash("success");
next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// seeds();

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use("/campgrounds/:id",commentRoutes);

var port=process.env.PORT ||3000;
app.listen(port,process.env.IP,function(){
    console.log("The yelpcamp server has started at "+port);
});