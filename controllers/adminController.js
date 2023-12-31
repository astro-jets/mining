
// Dependencies
require('dotenv').config();
const fs = require('fs')
const moment = require('moment');
const jwt = require('jsonwebtoken')   
// Models
const Resource = require("../models/Resource");
const Company = require("../models/Company");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const Project = require("../models/Project");
const User = require("../models/User");

// Dependency Variables
const maxAge = 3 * 24 * 60 * 60;


// Create Token
const createToken = (id)=>{
    return jwt.sign({id},process.env.TOKEN_SECRET,{
        expiresIn: maxAge
    });
}

module.exports.index = async (req, res) => {
  const deposits = await Resource.find();
  const companies = await Company.find();

  const data = {
    companies:companies,
    deposits:deposits
  }
  
  res.render('admin/index',{
    layout:"layouts/admin",
    data:data,
    user:res.locals.user
  });
};

// Messages
module.exports.messages = async (req, res) => {
  try{
        const messages = await Message.find();
        const unread = []
        const all = []
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            // const user = await User.findById(message.user)
            const lastThread = message.thread.length - 1
            all.push({
                id:message._id,
                name:"Mphatso",
                // avatar:user.avatarPath,
                title:message.thread[lastThread].message,
                date: moment(Date.now()).calendar()
            })
            if(message.thread[lastThread].status == 'unread' && message.thread[lastThread].from == 'user')
            {
                unread.push({
                id:message._id,
                name:"Mphatso",
                // avatar:user.avatarPath,
                title:message.thread[lastThread].message,
                date: moment(Date.now()).calendar()
            })
            }
        }

        res.render('admin/messages',{
            all:all,
            unread:unread,
            layout:'layouts/admin'
        })
    }
    catch(err){
        console.log(err.message)
    }
}

module.exports.messageSingle = async (req, res) => {
  try{
    const message = await Message.findById(req.params.id);
    res.render("admin/messageSingle",{
      layout:"layouts/admin",
      message
    });
  }
  catch(e){res.send(e.message)}
}
// Send message
module.exports.sendMessage = async (req,res) => {
  const thread = {
      timestamp:Date.now(),
      message: req.body.message,
      from:'admin',
      status:'unread'
  };
  const id = req.params.id;
  try{
    const message = await Message.findById(id);
    if (message)
    {
      message.thread.push(thread);
      await message.save();
    }
    res.redirect("/admin/messages")
  }catch(err){
      res.send(err.message)
  }
}

// Reports
module.exports.reports = async (req,res) =>{
  try{
    await getReports();
  }catch(e){
    res.status(500).send(e.message)
  }
}

// Resources
module.exports.readResources = async (req,res) =>{
    // Get all resources
    const resources = await Resource.find();
    res.render(
        "admin/resources",{resources,layout:"layouts/admin"}
    );
}
module.exports.getGeographicalSites = async (req,res) =>{
  try{
    const resources = await Resource.find();
    res.status(200).json(resources);
  }catch(err){res.status(500).send(err.message);}
}
module.exports.resourcesMap = async (req,res) => {
  res.render("admin/resourcesmap",{layout:"layouts/admin"});
}
module.exports.createResource = async (req,res) =>{
    // Render the create resource page
    res.render("admin/resourcenew",{layout:"layouts/admin"});
}
module.exports.getResources = async (req, res) => {
    // Return the Resource data so it can be rendered in the map
    const sites = await Resource.find();
    res.status(200).json(sites);
}
module.exports.saveResource = async (req, res) => {
  try {
    // Extract the form data from the request body
    const { siteName, latitude, longitude, description, deposits } = req.body;

    // Validate and process the data as required

    // Save the geographical data to the database (using MongoDB/Mongoose)
    const newResource = new Resource({
      siteName,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      description,
      deposits
    });
    await newResource.save();

    res.status(200).json({ message: 'Geographical data saved successfully' });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: 'An error occurred while saving the geographical data '+error.message });
  }
};
module.exports.updateResources = async (req,res) =>{
    // Editing a resource
    try{
    const resource = await Resource.findById(req.params.id);
      res.render("admin/resourceedit",{resource,layout:"layouts/admin"});
    }
    catch(err){
      console.log(err.message)
    }
}

module.exports.saveUpdate = async (req,res) =>{
  const {siteName,description,deposits,latitude,longitude} = req.body;
  try{
    const resource = await Resource.findById(req.body.id);
    resource.siteName = siteName;
    resource.description = description;
    resource.deposits = deposits;
    resource.location.coordinates[0] = latitude;
    resource.location.coordinates[1] = longitude;
    await resource.save();
    res.status(200).send();
  }catch(err){console.log(err.message)}
}
module.exports.deleteResources = async (req,res) =>{
  const resourceId = req.params.id;

  try {
    // Find the resource by its ID and remove it from the database
    await Resource.findByIdAndDelete(resourceId);

    res.status(200).json({ message: 'Resource deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the resource.' });
  }
};


// Projects
module.exports.newProject = async (req, res) => {res.render('admin/newProject',{layout:'layouts/admin'})}
module.exports.viewProjects = async (req, res) => {
  try{
    const results = await Project.find();
    const projects = results.map((r)=>(
      {
        name:r.name,
        description:r.description,
        date:moment(r.created).calendar()
      }
    ));
    res.render('admin/projects',{layout:'layouts/admin',projects})
  }catch(e){res.status(500).send(e.message)}
}
module.exports.saveProject = async (req, res) => {
  const {name,description}= req.body;
  console.log("Name => ",name,"Description => ",description)
  try{
    const project = new Project({name,description});

    await project.save();
    res.status(200).json("Project Saved Successfully");
  }catch(e){res.status(500).send(e.message)}
}

// Projects

// Company Routes
// Approved Companies
module.exports.viewCompanies = async (req, res) => {
  const companies = await Company.find({status:"approved"});
  res.render('admin/companies',{
    layout:"layouts/admin",
    companies:companies
  });
};

// Pending Approval
module.exports.companyApplications = async (req, res) => {
  try{
    // Get all applications that havent been atteneded to
    const applications = await Company.find({status:"pending"});
    res.render('admin/applications',{
    layout:"layouts/admin",
    applications:applications
  });
  }
  catch(e){res.send(e.message);}
}

// Declined
module.exports.declinedApplications = async (req, res) => {
  try{
    // Get all applications that havent been atteneded to
    const applications = await Company.find({status:"declined"});
    res.render('admin/declined',{
    layout:"layouts/admin",
    applications:applications
  });
  }
  catch(e){res.send(e.message);}
}

// Approve an application
module.exports.approveApplication = async (req,res) => {
  try{
    const application = await Company.findById(req.params.id);
    application.status = "approved";
    await application.save();
    const notification = {
      user: application.user,
      message: `Your application to register ${application.name} has been approved.`,
      type:"approved"
    }
    await Notification.create(notification)
    res.status(200).send()
  }
  catch(e){res.satus(500).send(e.message);}
}

// Decline an application
module.exports.declineApplication = async (req,res) => {
  try{
    const application = await Company.findById(req.params.id);
    application.status = "declined";
    await application.save();
    const email = {
      SecureToken : process.env.EMAIL_TOKEN,
      To : application.email,
      From : process.env.HOST_EMAIL,
      Subject :"Rejection of application",
      Body : "We regret to tell you that your application for mining has been rejected by the ministry of mining."
    }
    res.status(200).send(email);
  }
  catch(e){res.satus(500).send(e.message);}
}

// Function to send an email
// async function sendmail(recipientEmail, subject, message) {
//   try {
//     // Create a transporter using SMTP details or other email provider configurations
//     const transporter = nodemailer.createTransport({
//       host: 'mail.google.com',
//       auth: {
//         user: 'mphatsomtogolo30@gmail.com',
//         pass: 'tygapaintjets7@',
//       },
//     });

//     // Define email options
//     const mailOptions = {
//       from: 'mphatsomtogolo30@gmail.com',
//       to: recipientEmail,
//       subject: subject,
//       text: message,
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);

//     console.log('Email sent successfully!');
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };

module.exports.reports = async (req,res) =>{
  await getReports();
  res.render("admin/reports",{layout:"layouts/admin"});
}

async function getReports()
{
  const companies = await Company.find({status:"approved"});
  const minerals = await Resource.find();

  // Calculate the number of deposits per deposit
  const gold = minerals.filter(d => d.deposits.includes("gold")|| d.deposits.includes("Gold"));
  const uranium = minerals.filter(d => d.deposits.includes("uranium") || d.deposits.includes("Uranium"));
  const coal = minerals.filter(d => d.deposits.includes("coal") || d.deposits.includes("Coal"));

  // Calculate the number of companies per deposit
  const companiesMiningGold = companies.filter( g => g.minerals.includes("gold") || g.minerals.includes("Gold"));
  const companiesMiningCoal = companies.filter( g => g.minerals.includes("coal") || g.minerals.includes("Coal"));
  const companiesMiningUranium = companies.filter( g => g.minerals.includes("uranium") || g.minerals.includes("Uranium"));

  // Number of mineral deposits per deposit
  const minrealsCount = {
    gold : gold.length,
    uranium : uranium.length,
    coal : coal.length
  }

  // Number of companies per deposit
  const companiesCount = {
    gold : companiesMiningGold.length,
    uranium : companiesMiningUranium.length,
    coal : companiesMiningCoal.length
  }

  const report = {
    minerals : minrealsCount,
    companies: companiesCount
  }
  const data = JSON.stringify(report)
  {
    fs.writeFile('public/reports/reports.json',data, err=>{
        if(err)
        {
            console.log(err)
        }
        else{console.log('success saved report')}
    })
  }
}

module.exports.signUpPage = async (req,res) =>{
  res.render("admin/signup",{layout:"layouts/adminAuth"});
}
module.exports.signUp = async (req,res) =>{
  const userDetails = {
        username:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        password:req.body.password,
        userType:'admin'
  }
  try{
      const user = await User.create(userDetails)
      const token = createToken(user._id);
      res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
      res.redirect('/admin')
  }
  catch(err)
  {
      console.log(err.message)
  }
}

module.exports.logInPage = async (req,res) =>{
  res.render("admin/login",{layout:"layouts/adminAuth"});
}
// LogIn Route
module.exports.logIn = async (req,res)=>{
    const{email,password} = req.body;
    try{
        const user = await User.login(email,password)
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
        res.redirect('/admin');
    }
    catch(err)
    {
        res.json(err.message)
    }
}