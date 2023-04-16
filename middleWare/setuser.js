const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');
const Parent = require('../models/parentModel');
const School = require('../models/schoolModel');
const Photographer = require('../models/photographerModel');
const Admin = require('../models/adminModel');
const parentModel = require('../models/parentModel');
const Orders = require('../models/orderModel');
var moment = require('moment');

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
      if(req.user){
        // console.log(
        //   'after checking current user is an admin whose username is ' +
        //     req.user.username
        // );
        const orders = await Orders.find();
        orders.map(async (el) => {
          el.momentago = getTime(el.moment);
          await el.save();
          // console.log(el.momentago + ' from checkuser');
        });
        next();
      }
      else{
        next()
      }
    }
    else {
      // req.user = "i";
      // console.log('no user available yet');
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
      if(req.user){
        // console.log(
        //   'after checking current user is an admin whose username is ' +
        //     req.user.username
        // );
        const orders = await Orders.find();
        orders.map(async (el) => {
          el.momentago = getTime(el.moment);
          await el.save();
          // console.log(el.momentago + ' from checkuser');
        });
        next();
      }
      else{
        next()
      }
    }
    else {
      // req.user = "i";
      // console.log('no user available yet');
      next();
    }
    
  } catch (err) {
    // console.log(err.message);
    res.clearCookie('auth');
  }
  
};

module.exports = { setUser, setUserp };
