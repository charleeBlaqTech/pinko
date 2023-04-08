const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const Parent = require('../models/parentModel');
const School = require('../models/schoolModel');
const Photographer = require('../models/photographerModel');
const Admin = require('../models/adminModel');
const parentModel = require('../models/parentModel');

let userid;
let usertype;
const setUser = async (req, res, next) => {
  const auth = req.cookies.auth;
  const authp = req.cookies.authp;
  req.admin = await Admin.findOne({ username: 'smith' });
  req.students = await Student.find();
  req.schools = await School.find();

  try {
    if (auth) {
      usertype = auth.split('/')[0];
      userid = auth.split('/')[1];

      req.user = await Admin.findOne({ adminid: userid });
      // await req.user.save();
      console.log(
        'after checking current user is an admin whose username is ' +
          req.user.username
      );
      next();
    } else {
      // req.user = "i";
      console.log('no user available yet');
      next();
    }
    
  } catch (err) {
    console.log(err.message);
    res.clearCookie('auth');
  }
  
};
const setUserp = async (req, res, next) => {
  const auth = req.cookies.authp;
  req.admin = await Admin.findOne({ username: 'smith' });
  req.students = await Student.find();
  req.schools = await School.find();

  try {
    if (auth) {
      usertype = auth.split('/')[0];
      userid = auth.split('/')[1];

      req.user = await parentModel.findOne({ userid: userid });
      // await req.user.save();
      console.log(
        'after checking current user is an admin whose username is ' +
          req.user.username
      );
      next();
    } else {
      // req.user = "i";
      console.log('no user available yet');
      next();
    }
    
  } catch (err) {
    console.log(err.message);
    res.clearCookie('auth');
  }
  
};

module.exports = { setUser, setUserp };
