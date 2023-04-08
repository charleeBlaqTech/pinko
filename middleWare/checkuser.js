
const Parent = require('../models/parentModel');
const pictureModel = require('../models/picturesModel');
const personalModel = require('../models/personalModel');

var moment = require('moment');


const Admin = require('../models/adminModel');

let formerg
let lastuser;

const getTime = (date) => {
  let result = moment(date).fromNow();
  const now = moment();
  const days = now.diff(date, 'days');
  const weeks = now.diff(date, 'weeks');
  if (days >= 7) {
    if (days <= 13) {
      result = `a week ago`;
    } else if (days > 13 && days <= 25) {
      result = `${weeks} weeks ago`;
    }
  }
  return result;
};

console.log(getTime('2023-04-02 15:21:51')); // 3 days ago
console.log(moment().format('YYYY-MM-DD HH:mm:ss'));

const checkUserp = async (req, res, next) => {
  const authp = req.cookies.authp;
  const parents = await Parent.find();
  

  
  // console.log('parents exist ' + parents);
  if (authp) {
    const usertype = authp.split('/')[0];
    const userid = authp.split('/')[1];

    lastuser = 'parent';
    req.user = await Parent.findOne({ userid });

    console.log(
      'current user is a Parent whose namename is ' + req.user.username
    );

    await res.cookie('authp', authp, {
      secure: true,
      maxAge: 3600000, //1hr idle time will triggere authentication
    });

    next();

    
  } else {
    requser = null;
    console.log('authentication expired ');

    

    res.render('signuppage', {
      layout: 'nothing',
      icon: 'error',
      title: 'Authentication expired !',
      alerte: 'Pls login again ',
    });
  }
};




const checkUser = async (req, res, next) => {
  const auth = req.cookies.auth;
  const parents = await Parent.find();

  parents.length > 0 ? (req.parents = true) : (req.parents = false);

  let userid;
  
  
  console.log('parents exist ' + req.parents);
  if (auth) {
    const usertype = auth.split('/')[0];
    userid = auth.split('/')[1];

    if (usertype == 'admin') {
      req.user = await Admin.findOne({ adminid: userid });

      console.log(
        'current user is an Admin whose name is ' + req.user.username
      );

      await res.cookie('auth', auth, {
        secure: true,
        maxAge: 3600000, //1hr idle time will triggere authentication
      });

      const admins = await Admin.find()
      admins.map(async (el)=>{
        el.momentago= getTime(el.moment)
        await el.save()
        console.log(el.momentago + " from checkuser")
      })
      const parents = await Parent.find()
      parents.map(async (el)=>{
        el.momentago= getTime(el.moment)
        await el.save()
        console.log(el.momentago + " parents from checkuser")
      })
      const pictures = await pictureModel.find();
      const personals = await personalModel.find();
      pictures.map(async (el)=>{
        el.momentago= getTime(el.moment)
        await el.save()
        console.log(el.momentago + " parents from checkuser")
      })
      personals.map(async (el)=>{
        el.momentago= getTime(el.moment)
        await el.save()
        console.log(el.momentago + " parents from checkuser")
      })



      next();

      
    }
    else{
      res.render('adminloginpage', {
        layout: 'login',
        alerte:
          'You can not have both admin and user accounts running simultaneously on one device kindly enter admin login details again',
        icon: 'error',
        title: 'Two user accounts detected on this device,Pls login again .',
      });

    }

    
  } else {
    requser = null;
    console.log('authentication expired ');

    res.render('adminloginpage', {
      layout: 'nothing',
      icon: 'error',
      title: 'Authentication expired !',
      alerte: 'Pls login again ',
    });
  }
};










module.exports = {checkUser,checkUserp}
