const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Is adminstrator
const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt;
    // Check if token exists and is valid
    if(token)
    {
        jwt.verify(token,process.env.TOKEN_SECRET,async (err,decodedToken)=>{
            if(err){
                res.redirect('/admin/login')
            }else{
                let user = await User.findById(decodedToken.id)
                if(user.userType === "admin"){next()}
                else{res.redirect('/admin/login')}
            }
        })

    }
    else{
        res.redirect('/admin/login')
    }
}

// Is Customer
const isCustomer = (req,res,next)=>{
    const token = req.cookies.jwt;
    // Check if token exists and is valid
    if(token)
    {
        jwt.verify(token,process.env.TOKEN_SECRET,(err,decodedToken)=>{
            if(err){
                // console.log(err.message)
                res.redirect('/login')
            }else{
                // console.log(decodedToken)
                next()
            }
        })

    }
    else{
        res.redirect('/login')
    }
}

const currentUser = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        
        jwt.verify(token,process.env.TOKEN_SECRET,async (err,decodedToken)=>{
            if(err){
                console.log(err.message)
                res.locals.user = null;
                next()
            }else{
                let user = await User.findById(decodedToken.id)
                res.locals.user = user;
                next()
            }
        })
    }else{res.locals.user = null;next();}
}

module.exports = {requireAuth,currentUser,isCustomer}