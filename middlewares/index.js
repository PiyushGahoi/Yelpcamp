var Campground=require("../models/campgrounds");
var Comment=require("../models/comment");

var middleware={};

middleware.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","You need to Login!");
        res.redirect("/login");
    }
}

middleware.campgroundUser=function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,campground){
            if(err)
            {
                req.flash("Campground not found!");
            res.redirect("back");
            }
            else{
                if(campground.author.id.equals(req.user._id))
                    return next();
                else
                {
                    req.flash("error","You don't have permission to do that!");
                    return res.redirect("back"); 
                }
            }
        });
    }
    else
    {
        req.flash("error","Please Login Fist to do that");
        return res.redirect("/campgrounds/"+req.params.id);
    }
}

middleware.commentUser=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId,function(err,comment){
            if(err)
            res.redirect("back");
            else
            {
                if(comment.author.id.equals(req.user._id)){
                    return next();
                }
                else
                {
                req.flash("error","You don't have permission to do that!");
                res.redirect("back");
                }
            }
        });
    }
}
module.exports=middleware;