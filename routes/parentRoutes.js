const express = require('express');
const app = express();
const router = express.Router();

const parentControllers = require('../controllers/parentControllers');
const parentprg = require('../prgs/parentprg');
const { checkUserp } = require('../middleWare/checkuser');

const { vpin, authparent } = require('../middleWare/parentmw');
router.post('/editusername', checkUserp, parentControllers.editusername);

router.get('/prg', parentprg.signup);
router.post('/editpassword', checkUserp, parentControllers.editpassword);

router.post('/parentsignup', authparent);
router.post('/verifymailforgotpwrd', parentControllers.verifymailforgotpwrd);
router.post('/finalresetpassword', parentControllers.finalresetpassword);
router.post('/emailupdate', checkUserp, parentControllers.emailupdate);
router.post('/vpin', vpin, parentControllers.saveSignupdetails);
router.post('/login', parentControllers.login);
router.post('/confirmpayment', parentControllers.confirmpayment);
router.post('/editemail', checkUserp, parentControllers.editemail);
router.post('/updateshipping', checkUserp, parentControllers.updateshipping);
router.get('/order/:order', checkUserp, parentControllers.order);
router.get('/db', checkUserp, parentControllers.home);
router.get('/psettings', checkUserp, parentControllers.psettings);
router.get('/packages', checkUserp, parentControllers.packages);
router.get('/myorders', checkUserp, parentControllers.myorders);
router.get('/shippingdetails', checkUserp, parentControllers.shippingdetails);
router.get(
  '/deletefromparent/:ordercode',
  checkUserp,
  parentControllers.deletefromparent
);
router.post('/findstudent', checkUserp, parentControllers.findstudent);
router.post(
  '/enterchildusername',
  checkUserp,
  parentControllers.enterchildusername
);
router.post('/tocart', checkUserp, parentControllers.tocart);
router.post(
  '/proceedtopayment',
  checkUserp,
  parentControllers.proceedtopayment
);

module.exports = router;