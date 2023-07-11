const Resource = require("../models/Resource");
const Company = require("../models/Company");

module.exports.index = async (req, res) => {
  const deposits = await Resource.find();
  const companies = await Company.find();

  const data = {
    companies:companies,
    deposits:deposits
  }
  
  res.render('admin/index',{
    layout:"layouts/admin",
    data:data
  });
};

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
    console.log(req.body)

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

module.exports.approveApplication = async (req, res) => {
  try{
    const company = await Company.findById(req.params.id)
    company.status = "approved";
    company.save();
    res.redirect("/admin/companies/applications");
  }
  catch(e){res.send(e.message);}
}
module.exports.declineApplication = async (req, res) => {
  try{
    const company = await Company.findById(req.params.id)
    company.status = "declined";
    company.save();
    res.redirect("/admin/companies/applications");
  }
  catch(e){res.send(e.message);}
}

module.exports.updateCompany = async (req, res) => {}
module.exports.saveCompanyUpdate = async (req, res) => {}
module.exports.deleteCompany = async (req, res) => {}

module.exports.reports = async (req, res) => {
 res.render('admin/reports',{
    layout:"layouts/admin",
  });
};