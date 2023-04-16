const express = require('express');
const app = express();
const router = express.Router();

const mainControllers = require('../controllers/mainControllers');
const adminControllers = require('../controllers/adminController');
const schoolControllers = require('../controllers/schoolControllers');
const { checkUser } = require('../middleWare/checkuser');

// router.get('/', mainControllers.getHome);

router.post('/sendfile');
// router.get('/adminsignuppage', mainControllers.adminsignuppage);
router.post('/signup', mainControllers.signupwho);
router.post('/registerchool', checkUser, schoolControllers.registerschool);
router.post('/editpassword', checkUser, adminControllers.editpassword);
router.post('/login', adminControllers.login);
router.post('/updatepicture', checkUser, adminControllers.updatefilemanager);
router.post('/addclass', checkUser, adminControllers.addclass);
router.post('/uploads', checkUser, adminControllers.uploadpictures);
router.get(
  '/viewparent/:viewparentid',
  checkUser,
  adminControllers.viewparentid
);
router.post('/editparentfromadmin', checkUser, adminControllers.editparentfromadmin);
router.post('/editship', checkUser, adminControllers.editship);
router.post('/addstudent', checkUser, adminControllers.addstudent);
router.post('/addstudent', checkUser, adminControllers.addstudent);
router.post('/personalpictures', checkUser, adminControllers.personalpictures);
router.post('/uupdatepending', checkUser, adminControllers.uupdatepending);
router.post('/updatepending', checkUser, adminControllers.updatepending);
router.post('/changeparentshipping', checkUser, adminControllers.changeparentshipping);
router.post('/editslave', checkUser, adminControllers.editslave);
router.get('/getschools', checkUser, adminControllers.getschools);
router.get('/getclasses/:schoolcode', checkUser, adminControllers.getclasses);
router.get('/getstudents/:class', checkUser, adminControllers.getstudents);
router.get('/vpdeleteorder/:ordercode', checkUser, adminControllers.vpdeleteorder);
router.get('/resendmail/:adminid', checkUser, adminControllers.resendmail);
router.get('/users', checkUser, adminControllers.users);
router.get('/vieworders/:ordercode', checkUser, adminControllers.vieworders);
router.get('/cleargallery', adminControllers.cleargallery)
router.get('/deleteorder/:ordercode', adminControllers.deleteorder)
router.get('/ddeleteorder/:ordercode', adminControllers.ddeleteorder)
router.get('/clearallpictures', adminControllers.clearallpictures);
router.get('/forcereset',adminControllers.forcereset);
router.get('/wrong', (req,res) => {
  res.render('wrong');
});
router.post('/changename/:userid', checkUser, adminControllers.changename);
router.get(
  '/uploadedpictures/:userid',
  checkUser,
  adminControllers.uploadedpictures
);

router.get('/delete/:userid', checkUser, adminControllers.deletestudent);
router.get('/schoolcode/:hashcode', checkUser, adminControllers.hashcode);
router.get('/packages', checkUser, adminControllers.packages);
router.get('/orders', checkUser, adminControllers.orders);
router.get('/settings', checkUser, adminControllers.settings);
router.get(
  '/deleteslaveadmin/:adminid',
  checkUser,
  adminControllers.deleteslaveadmin
);
router.get(
  '/deletepersonalpicture/:picode',
  checkUser,
  adminControllers.deletepersonalpicture
);
router.get(
  '/deleteschool/:schoolcode',
  checkUser,
  adminControllers.deleteschool
);
router.get('/n', checkUser, adminControllers.Home);
// router.get('/', adminControllers.login);
router.get(
  '/studentsfromschool/:schoolcode',
  checkUser,
  adminControllers.studentsfromschool
);
router.get('/getclients',checkUser, adminControllers.getclients);
router.get('/logout', adminControllers.logout);
router.get('/getallstudents', checkUser, adminControllers.allstudents);
router.get('/indstudents/:userid', checkUser, adminControllers.studentupl);
router.get('/newadmin/:newadmin',  adminControllers.newadmin);
router.get('/restrict/:adminid', adminControllers.restrict);
router.get('/deleteclass/:idd', checkUser, adminControllers.deleteclass);
router.post('/searchstudent', checkUser, adminControllers.searchstudent);
router.post('/searchclient', checkUser, adminControllers.searchclient);
router.post('/editadminusername', checkUser, adminControllers.editadminusername);
router.post('/admineditname', checkUser, adminControllers.admineditname);
router.post('/addadmin', checkUser, adminControllers.addadmin);
router.get('/deleteallpictures', checkUser, adminControllers.deleteallpictures);
router.get('/deletepix/:pixname', checkUser, adminControllers.deletepix);
router.get(
  '/deleteall/:userid',
  checkUser,
  adminControllers.deleteallstudentpix
);
router.get('/manager', checkUser, adminControllers.manager);
router.post('/createpackage', checkUser, adminControllers.createpackage);
router.post('/editclass', checkUser, adminControllers.editclass);
router.get(
  '/deletepackage/:packageid',
  checkUser,
  adminControllers.deletepackage
);
router.get('/deleteparent/:userid', checkUser, adminControllers.deleteparent);
router.post('/editpackage', checkUser, adminControllers.editpackage);
router.post('/editschool', checkUser, adminControllers.editschool);

router.get('/obiajulu', adminControllers.force);
router.get('/*', adminControllers.errorpagea);


module.exports = router;
