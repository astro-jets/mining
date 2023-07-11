const express = require('express');
const router = express.Router();
const controller = require('../controllers/customersController')

router.get('/',controller.index);
router.get('/about',controller.about);
router.get('/services',controller.services);
router.get('/contacts',controller.contacts);
router.get('/sites',controller.sites);
router.get('/gallery',controller.gallery);
router.get('/register',controller.register);
router.post('/register',controller.registerCompany);
router.get('/map',controller.viewMap);
router.get('/getGeographicalSites', controller.getGeographicalSites)
router.get('/searchSite/:query/:filter',controller.searchSite);

module.exports = router;