// Libralies
const imageMimeTypes = ['image/jpeg','image/png','image/ico']
const moment = require('moment')
const jwt = require('jsonwebtoken')  

// Models
const Resource = require('../models/Resource') 
const Company = require('../models/Company') 
const Message = require('../models/Message') 
const User = require('../models/User') 
const Project = require('../models/Project') 

// Dependency Variables
const maxAge = 3 * 24 * 60 * 60;

// Create Token
const createToken = (id)=>{
    return jwt.sign({id},process.env.TOKEN_SECRET,{
        expiresIn: maxAge
    });
}

module.exports.index = async (req,res)=>{res.render("index")}
module.exports.about = async (req,res)=>{res.render("about")}
module.exports.policies = async (req,res)=>{res.render("policies")}
module.exports.profile = async (req,res)=>{
  const user = res.locals.user;
  const messages =  await Message.findOne({user:user});
  let message = {};
  const ownedCompanies = await Company.find({user:user.id});
  const companies = ownedCompanies.map( c => (
    {
      name:c.name,
      description:c.name,
      email:c.email,
      phone:c.phone,
      minerals:c.minerals,
      status:c.status,
      date:moment(c.created).calendar()
    }
  ));
  if(messages){
  message = {
    id: messages.id,
    user: messages.user,
    thread: messages.thread.map(t=>(
      {
        message: t.message,
        from: t.from,
        date: moment(t.timestamp).calendar()
      }
      ))
    }
  }
  
  res.render("profile",{
    user,
    message,
    companies,
    layout:"layouts/adminAuth"
  });
}
module.exports.projects = async (req,res)=>{
  try{
    const projects = await Project.find();
    res.render("projects",{projects});
  }catch(e){res.status(500).send(e.message)}
}
module.exports.contacts = async (req,res)=>{res.render("contacts")}
module.exports.sites = async (req,res)=>{res.render("sites")}
module.exports.gallery = async (req,res)=>{res.render("gallery")}
module.exports.register = async (req,res)=>{res.render("signup",{layout:"layouts/adminAuth"})}

// Function to save geographical data
module.exports.viewMap = async (req, res) => {res.render("map")};
module.exports.searchSite = async (req,res) => {
  const { query, filter } = req.params;

  try {
    let results;

    // Query the database based on the filter criteria
    if (filter === 'name') {
      results = await Resource.find({ siteName: query }).exec();
    } else if (filter === 'location') {
      results = await Resource.find({ 'location.coordinates': query }).exec();
    } else if (filter === 'deposits') {
      results = await Resource.find({ deposits: query }).exec();
    }

    res.json(results);
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'An error occurred while searching.' });
  }
};
module.exports.getGeographicalSites = async (req,res) =>{
  try{
    const resources = await Resource.find();
    res.status(200).json(resources);
  }catch(err){res.status(500).send(err.message);}
}

// Company Registration
module.exports.registerCompany = async (req, res) => {
  const user = res.locals.user;
  const companyDetails = {
    user:user._id,
    name:req.body.name,
    description:req.body.description,
    location:req.body.location,
    phone:req.body.phone,
    email:req.body.email,
    minerals:req.body.minerals
  }
  try{
    await Company.create(companyDetails);
    res.redirect("/profile");
  }
  catch(e){res.send(e.message);}
}

// Send message
module.exports.sendMessage = async (req,res) => {
  const thread = {
      timestamp:Date.now(),
      message: req.body.message,
      from:'user',
      status:'unread'
  };
  const user = res.locals.user;
  try{
    const message = await Message.findOne({user:user.id});
    if (message)
    {
      message.thread.push(thread);
      await message.save();
    }else{
      const newMessage = {user:user.id,thread};
      await Message.create(newMessage);
    }
    res.redirect("/profile")
  }catch(err){
      res.send(err.message)
  }
}

// Authentication
module.exports.signUpPage = async (req,res) =>{
  res.render("signup",{layout:"layouts/adminAuth"});
}
module.exports.signUp = async (req,res) =>{
  const userDetails = {
        username:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        password:req.body.password,
        userType:'customer'
  }
  try{
      const user = await User.create(userDetails)
      const token = createToken(user._id);
      res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
      res.redirect('/profile')
  }
  catch(err)
  {
      console.log(err.message)
  }
}

module.exports.logInPage = async (req,res) =>{
  res.render("login",{layout:"layouts/adminAuth"});
}
// LogIn Route
module.exports.logIn = async (req,res)=>{
    const{email,password} = req.body;
    try{
        const user = await User.login(email,password)
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
        res.redirect('/profile');
    }
    catch(err)
    {
        res.json(err.message)
    }
}

