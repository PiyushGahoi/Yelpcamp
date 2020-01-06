var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware=require("../middlewares/index");

router.post("/comment",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        {
            req.flash("error","Oops!Something went wrong");
            console.log(err);
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err)
                {
                    req.flash("error","Oops!Something went wrong");
                    console.log(err);
                }
                else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username.toUpperCase();
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Comment Added!!");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

router.delete("/comment/:commentId",middleware.commentUser,function(req,res){
    Comment.findByIdAndRemove(req.params.commentId,function(err){
        if(err){
            req.flash("error","Oops!Something went wrong");
            res.redirect("/campgrounds/"+req.params.id);
        }
        else{
            req.flash("success","Comment Deleted!");
            res.redirect("/campgrounds/"+req.params.id);
        }    
    });
});



module.exports=router;