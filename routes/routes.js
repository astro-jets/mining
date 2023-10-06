const express = require('express');
const router = express.Router();
const controller = require('../controllers/customersController')
const {isCustomer, currentUser} = require('../middleware/authMiddleware')

router.get('/',controller.index);
router.get('/about',controller.about);
router.get('/projects', controller.projects);
router.get('/policies',controller.policies);
router.get('/profile',isCustomer,currentUser, controller.profile);
router.get('/contacts',controller.contacts);
router.get('/sites',controller.sites);
router.get('/gallery',controller.gallery);
router.get('/register',controller.register);
router.post('/register',isCustomer,currentUser,controller.registerCompany);
router.get('/map',controller.viewMap);
router.get('/getGeographicalSites', controller.getGeographicalSites)
router.get('/searchSite/:query/:filter',controller.searchSite);
router.post('/message',isCustomer,currentUser,controller.sendMessage);

// Authentication and Registration
// Registration
router.get('/signup', controller.signUpPage)
router.post('/signup', controller.signUp)
// Authenticaion
router.get('/login', controller.logInPage)
router.post('/login', controller.logIn)

module.exports = router;