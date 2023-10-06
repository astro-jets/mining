const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController')
const {requireAuth, currentUser} = require('../middleware/authMiddleware')

// Authentication and Registration
// Registration
router.get('/signup', controller.signUpPage)
router.post('/signup', controller.signUp)
// Authenticaion
router.get('/login', controller.logInPage)
router.post('/login', controller.logIn)

// Define the routes for the admin section
router.get('/*', requireAuth, currentUser)
router.get('/', controller.index)

// Sites with Mineral Resources
router.get('/resources', controller.readResources)
router.get('/resources/getGeographicalSites', controller.getGeographicalSites)
router.get('/resources/map', controller.resourcesMap)
router.post('/resources/save', controller.saveResource)
router.get('/getresources', controller.getResources)
router.get('/resources/new', controller.createResource)
router.get('/resources/edit/:id', controller.updateResources)
router.put('/resources/save', controller.saveUpdate)
router.get('/resources/delete/:id', controller.deleteResources)
// Sites with Mineral Resources

// Companies
router.get('/companies', controller.viewCompanies)
router.get('/companies/applications', controller.companyApplications)
router.get('/companies/declined', controller.declinedApplications)
router.put('/companies/approve/:id', controller.approveApplication)
router.get('/companies/decline/:id', controller.declineApplication)
// router.get('/company/edit/:id', controller.updateCompany)
// router.put('/company/save', controller.saveCompanyUpdate)
// router.get('/company/delete/:id', controller.deleteCompany)
// Companies

// Projects
router.get('/projects', controller.viewProjects)
router.get('/projects/new', controller.newProject)
router.post('/projects/new', controller.saveProject)
// Projects
//Messages
router.get('/messages/', controller.messages)
router.get('/messages/:id', controller.messageSingle)
router.post('/message/:id', controller.sendMessage)
// Messages



// Reports
router.get('/reports', controller.reports)
// Reports

// Export the router
module.exports = router;
