const fs = require('fs');
const express = require('express');

const randomn = require('crypto').randomBytes(5).toString('hex');

function capitalise(x) {
  var b = x.charAt(0).toUpperCase() + x.slice(1);
  return b;
}
function currentDate() {
  let ddate = new Date();
  const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  let dateFormat = weekday[ddate.getDay()] + ',' + ddate.toLocaleString();
  return dateFormat;
}

module.exports = {
  signuppage: async (req, res) => {
    res.render('signuppage', { layout: 'nothing' });
    // console.log(req.user + "req.user");
  },
  adminloginpage: async (req, res) => {
    res.render('adminloginpage', { layout: 'nothing' });
    // console.log(req.user + "req.user");
  },
  fgw: async (req, res) => {
    res.render('fgw',{layout:"nothing"});
    // console.log(req.user + "req.user");
  },
  loginpage: async (req, res) => {
    res.render('signuppage',{layout:"nothing"});
    // console.log(req.user + "req.user");
  },
  getHome: async (req, res) => {
    // res.clearCookie('auth');
    res.clearCookie('clientid');
    res.clearCookie('classcode');
    res.clearCookie('adminid');
    // res.clearCookie("adminid")
    // res.end()
    // res.json('Hello world!')
    res.render('home', {
      home: true
    });
    // console.log(req.user + "req.user");
  },
  adminsignuppage: async (req, res) => {
    res.render('adminsignuppage');
    // console.log(req.user + "req.user");
  },
  signupwho: async (req, res) => {
    const iam = req.body.iam;

    if (iam == 'student') {
      res.redirect(307, '/student/studentsignup');
    } else if (iam == 'parent') {
      res.redirect(307, '/parent/parentsignup');
    } else if (iam == 'teacher') {
      res.redirect(307, '/teacher/teachersignup');
    } else if (iam == 'photographer') {
      res.redirect(307, '/photographer/photographersignup');
    } else {
      res.render('home', {
        title: 'PhotoG !',
        icon: 'error',
        alerte: 'Something went wrong !!',
      });
    }
  },
  service: async (req, res) => {
    res.render('service',{
      services:true,
      home:true
    });
  },
  about: async (req, res) => {
    res.render('about',{
      about:true,
      home:true

    });
  },
  contact: async (req, res) => {
    res.render('contact', {
      contact: true,
      home: true,
    });
  },
  faq: async (req, res) => {
    res.render('faqs',{
      faq:true,
      home:true

    });
  },
}; 
