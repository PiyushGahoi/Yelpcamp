var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var middleware=require("../middlewares/index");

router.get('/campgrounds',function(req,res){
    Campground.find({},function(err,campgrounds){
        if(err)
        console.log("Something went wrong");
        else
        res.render('campgrounds',{campgrounds:campgrounds});
    });
});

router.get('/campgrounds/new',middleware.isLoggedIn,function(req,res){
    res.render('new');
});

router.get('/campgrounds/:id',function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,campground){
        if(err){
            req.flash("error","Cannot Find Campground!");
            res.redirect("/campgrounds/");
        }
        else
        res.render('show',{campground:campground});
    });
    });

router.post('/campgrounds',middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image= req.body.image;
    var description=req.body.desc;
    var price=req.body.price;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    var newCampground={
        name: name,
        image: image,
        price: price,
        description:description,
        author:author
    };
    Campground.create(newCampground,function(err,campground){
        if(err){
            req.flash("error","Could not create Campground!");
            res.redirect("/campgrounds/");
        }
        else{
            req.flash("success","Successfully Created!");
            res.redirect("/campgrounds/"+campground._id);
        }
    });
});

router.get('/campgrounds/:id/edit',middleware.campgroundUser,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        res.redirect('/campground/'+req.params.id);
        else{
            res.render('edit',{campground:campground});
        }
    });
});

router.put('/campgrounds/:id',middleware.campgroundUser,function(req,res){
Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,cammpground){
    if(err)
    res.redirect('/campgrounds/'+req.params.id);
    else
    {
        req.flash("success","Succesfully Edited!");
        res.redirect("/campgrounds/"+req.params.id);
    }
});
});

router.delete('/campgrounds/:id',middleware.campgroundUser,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
            req.flash("error","Could not delete Campground!");
            res.redirect("/campgrounds/"+req.params.id);
        }
        else
        {
            req.flash("success","Successfully deleted Campground!");
            res.redirect("/campgrounds/");
        }
    });
});

module.exports=router;