// Libralies
const imageMimeTypes = ['image/jpeg','image/png','image/ico']
const Resource = require('../models/Resource') 
const Company = require('../models/Company') 


module.exports.index = async (req,res)=>{res.render("index")}
module.exports.about = async (req,res)=>{res.render("about")}
module.exports.policies = async (req,res)=>{res.render("policies")}
module.exports.contacts = async (req,res)=>{res.render("contacts")}
module.exports.sites = async (req,res)=>{res.render("sites")}
module.exports.gallery = async (req,res)=>{res.render("gallery")}
module.exports.register = async (req,res)=>{res.render("register")}

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
  const companyDetails = {
    name:req.body.name,
    description:req.body.description,
    phone:req.body.phone,
    email:req.body.email,
    minerals:req.body.deposit
  }
  try{
    await Company.create(companyDetails);
    res.redirect("/register");
  }
  catch(e){res.send(e.message);}
}

