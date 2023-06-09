const express = require('express');
const app = express()
const router = express.Router();
const adminControllers = require('../controllers/adminController');


const mainControllers = require('../controllers/mainControllers');

router.get("/", mainControllers.getHome);

router.post("/sendfile");
router.get('/loginpage', mainControllers.loginpage);
router.get('/admin', mainControllers.adminloginpage);
router.get('/fgw', mainControllers.fgw);
router.get('/signuppage', mainControllers.signuppage);
router.get('/adminsignuppage', mainControllers.adminsignuppage);
router.post("/signup",mainControllers.signupwho);
// router.get('/*',  adminControllers.errorpagea);


//homepages
router.get('/service', mainControllers.service);
router.get('/about', mainControllers.about);
router.get('/contact', mainControllers.contact);
router.get('/faq', mainControllers.faq);
// router.get('/admin', mainControllers.faq);
// router.get('/faq', mainControllers.faq);








module.exports = router