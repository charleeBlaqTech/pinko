
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const Parent = require('../models/parentModel');
const School = require('../models/schoolModel');
const Photographer = require('../models/photographerModel');
const Admin = require('../models/adminModel');



let userid;
let usertype;
const setUser = async (req, res, next) => {
  
  const auth = req.cookies.auth;
  req.admin = await Admin.findOne({ username: 'smith' });
  req.students = await Student.find();
  req.schools = await School.find();


  
  try{
    if (auth) {
      usertype = auth.split('/')[0];
      userid = auth.split('/')[1];

      if (usertype == 'admin') {
        req.user = await Admin.findOne({ adminid: userid });
        // await req.user.save();
        console.log(
          'after checking current user is an admin whose username is ' +
            req.user.username
        );
      } else {
        req.user = await Parent.findOne({ userid: userid });

        console.log(
          'after checking current user is a parent whose username is ' +
            req.user.username
        );
      }
      next();
    } else {
      // req.user = "i";
      console.log('no user available yet');
      next();
    }
  }
  catch(err){
    console.log(err.nessage)
    await res.cookie('auth', auth, {
      secure: true,
      maxAge: 0, //1hr idle time will triggere authentication
    });
  }
};

module.exports = setUser; 