const fs = require('fs');
const express = require('express');
const bcrypt = require('bcryptjs');

const { sib } = require('../models/sib');

const parentModel = require('../models/parentModel');
const adminModel = require('../models/adminModel');
const studentModel = require('../models/studentModel');
const { addadmin } = require('../models/nodemailer');
const pictureModel = require('../models/picturesModel');
const { Sibe } = require('../models/sib');
// const Model = require('../models/picturesModel');
const schoolModel = require('../models/schoolModel');
const classModel = require('../models/classModel');
const Parents = require('../models/parentModel');
const Students = require('../models/studentModel');
const { mailgun, mailgunh } = require('../models/nodemailer');
const Package = require('../models/packageModel');
const personalModel = require('../models/personalModel');
const Orders = require('../models/orderModel');
var watermark = require('image-watermark');
const randomn = require('crypto').randomBytes(5).toString('hex');
var moment = require('moment');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.PUSER,
    pass: process.env.PASS,
  },
});

let options = {
  text: 'Codar Institute',
  textSize: 6,
  dstPath: './watermarked/',
};
const sharp = require('sharp');
let fl = 0;
function capitalise(x) {
  var b = x.charAt(0).toUpperCase() + x.slice(1);
  return b;
}
let buta = 0;
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
function justDate() {
  // let mm = moment().format('MMMM Do YYYY');
  let mm = moment().format('D MMM, YYYY');

  return mm;
}
function getserialnum(bh) {
  var oboi = Math.random() + 1;
  var num = Math.floor(oboi * bh);
  return num;
}
const schoolz = async (req, res) => {
  const schools = await schoolModel.find().sort({ sn: 'desc' });

  const der = schools.map(async (el) => {
    const schoolcode = el.schoolcode;
    const parents = await Parents.find({ schoolcode: schoolcode });
    el.parentlength = parents.length;
    await el.save();
    const students = await Students.find({ schoolcode: schoolcode });
    el.studentlength = students.length;
    await el.save();
  });

  return der;
};

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
// getTime('2023-02-28 12:21:51'); // a week ago
// getTime('2023-02-07 12:21:51'); // a month ago

// sibe("samuelonwodi@yahoo.com", "testing", "4k bitches");

module.exports = {
  personalpictures: async (req, res) => {
    let fileDir = './public/personals/';

    if (req.files) {
      let files = req.files.imagine;
      if (!Array.isArray(files)) {
        files = [files];
      }
      console.log(files + ' is image length');
      const pala = [];
      const errorarray = [];
      try {
        for (let i = 0; i < files.length; i++) {
          console.log('here line 123');
          const fileName = files[i].name.split(' ').join('_');
          // await pictureModel.deleteOne({ pixname: fileName });
          const pixo = await personalModel.findOne({ pixname: fileName });
          if (!pixo) {
            await files[i].mv(fileDir + fileName, (err) => {
              if (err) errorarray.push(err);
            });

            await personalModel.deleteOne({ pixname: fileName });

            let personal = await personalModel.find();

            if (!Array.isArray(personal)) {
              personal = [personal];
            }

            // addTextOnImage(`public/uploads/${fileName}`, fileName);
            const picode = getserialnum(100000);
            await personalModel.create({
              pixname: fileName,
              for: 'admin',
              uploadedby: req.user.username,
              schoolname: '',
              schoolcode: '',
              class: '',
              order: personal.length + 1,
              uploaddate: justDate(),
              picode: picode,
              // sn: pictureslength + 1,
              downloadtimes: 0,
              imgdir: `/personals/${fileName}`,
              moment: moment().format('YYYY-MM-DD HH:mm:ss'),
            });

            pala.push(fileName + ' saved succesfully.  ');
          } else {
            pala.push(fileName + ' already exists.   ');
            console.log(fileName + ' already exists,');
          }

          // return;
        }
        const personals = await personalModel.find().sort({ order: -1 });
        const pictures = await pictureModel.find().sort({ order: -1 });
        const allpictures = [...personals, ...pictures];

        res.render('manager', {
          layout: 'admin',
          admin: req.user,
          icon: 'success',
          title: 'File(s) uploaded successfully',
          alerte: pala,
          pictures: pictures.reverse(),
          allpictures: allpictures,
          personals: personals,
        });
      } catch (err) {
        const personals = await personalModel.find().sort({ order: -1 });
        const pictures = await pictureModel.find().sort({ order: -1 });
        const allpictures = [...personals, ...pictures];
        console.log(err);
        res.render('manager', {
          layout: 'admin',
          admin: req.user,
          pictures: pictures.reverse(),
          allpictures: allpictures,
          personals: personals.reverse(),
          icon: 'error',
          title: 'Oops ! Upload(s) failed',
          alerte: err.message,
        });
      }
      // const array = files.map((el)=>{el})
      // const fl = files.length;

      // const errorarray = [];

      // for(let i=0; i<file.length; i++){
      //   file[i].mv('')
      //   const fileName = file[i].name.split(" ").join('_')
      //   await file.mv(fileDir + fileName, (err) => {
      //     if (err) throw err;
      //   });

      //   await pictureModel.deleteOne({ pixname: fileName });
      //   addTextOnImage(`public/uploads/${fileName}`, fileName);
      //   try {
      //     await pictureModel.create({
      //       pixname: fileName,
      //       for: student.username,
      //       uploadedby: 'admin',
      //       schoolname: student.schoolname,
      //       schoolcode: student.schoolcode,
      //       class: student.classs,
      //       uploaddate: currentDate(),
      //       wm:`/wm/${fileName}`,
      //       // sn: pictureslength + 1,
      //       downloadtimes: 0,
      //       studentuserid: student.userid,
      //       imgdir: `/uploads/${fileName}`,
      //     });

      //     // res.redirect('/photographer');

      //   } catch (err) {
      //     console.log(err);
      //     // const studentss = await studentModel.find({
      //     //   schoolcode: req.user.schoolcode,
      //     // });

      //     // res.render('dashboard', {
      //     //   photographer: req.user,
      //     //   students: studentss,
      //     //   alert: 'Picture upload failed due to ' + err,
      //     // });
      //   }
      // }
      // const studentss = await studentModel.find({
      //   schoolcode: req.user.schoolcode,
      // });

      // res.render('uplstd', {
      //   layout: 'upl',
      //   admin: req.user,
      //   student: student,
      //   icon: 'success',
      //   title: 'File(s) uploaded successfully',
      //   alerte: 'Success !',
      // });
    } else {
      const personals = await personalModel.find().sort({ order: -1 });
      const pictures = await pictureModel.find().sort({ order: -1 });
      const allpictures = [...personals, ...pictures];
      res.render('manager', {
        layout: 'admin',
        admin: req.user,
        icon: 'error',
        title: 'Empty files are not allowed for upload',
        alerte: 'you have to upload a minimum of 1 file ',
        pictures: pictures.reverse(),
        allpictures: allpictures,
        personals: personals,
      });
    }
  },
  uploadpictures: async (req, res) => {
    const userid = req.cookies.studentuserid;
    const student = await Students.findOne({ userid });
    let fileDir = './public/uploads/';

    if (req.files) {
      let files = req.files.imagine;
      // let files = req.files;
      if (!Array.isArray(files)) {
        files = [files];
      }
      console.log(files + ' is image length');
      const pala = [];
      const errorarray = [];
      try {
        for (let i = 0; i < files.length; i++) {
          console.log('here line 123');
          const fileName = files[i].name.split(' ').join('_');
          // await pictureModel.deleteOne({ pixname: fileName });
          const pixo = await pictureModel.findOne({ pixname: fileName });
          if (!pixo) {
            await files[i].mv(fileDir + fileName, (err) => {
              if (err) errorarray.push(err);
            });

            let allpix = await pictureModel.find();
            await pictureModel
              .deleteOne({ pixname: fileName })
              .where('studentuserid')
              .equals(student.userid);
            // addTextOnImage(`public/uploads/${fileName}`, fileName);
            const picode = getserialnum(100000);

            await pictureModel.create({
              pixname: fileName,
              for: student.name,
              picode: picode,
              uploadedby: req.user.username,
              order: allpix.length + 1,
              schoolname: student.schoolname,
              schoolcode: student.schoolcode,
              class: student.classs,
              uploaddate: justDate(),
              imgdir: `/uploads/${fileName}`,
              downloadtimes: 0,
              studentuserid: student.userid,
              classid: student.classid,
              moment: moment().format('YYYY-MM-DD HH:mm:ss'),
            });

            pala.push(fileName + ' saved succesfully.  ');
          } else {
            pala.push(fileName + ' already exists.   ');
            console.log(fileName + ' already exists,');
          }
        }
        const pictures = await pictureModel
          .find({ studentuserid: userid })
          .sort({ sn: 1 });

        res.render('uplstd', {
          layout: 'upl',
          admin: req.user,
          student: student,
          parents: req.parents,
          icon: 'success',
          title: 'File(s) uploaded successfully',
          alerte: pala,
          pictures: pictures.reverse(),
        });
      } catch (err) {
        console.log(err);
        res.render('uplstd', {
          layout: 'upl',
          admin: req.user,
          student: student,
          icon: 'error',
          title: 'Oops ! Upload(s) failed',
          alerte: err.message,
        });
      }
    } else {
      const pictures = await pictureModel
        .find({ studentuserid: userid })
        .sort({ sn: -1 });
      res.render('uplstd', {
        layout: 'upl',
        admin: req.user,
        student: student,
        icon: 'error',
        title: 'Empty files are not allowed for upload',
        alerte: 'you have to upload a minimum of 1 file ',
        pictures: pictures.reverse(),
      });
    }
    schoolz();
  },

  addadmin: async (req, res) => {
    schoolz();
    const mail = req.body.email;
    const ifexist = await adminModel.findOne({ email: mail });
    if (ifexist) {
      let settings;
      const admins = await adminModel.find({ slave: true });
      if (req.user.slave) {
        settings = false;
      } else {
        settings = true;
      }
      res.render('settings', {
        layout: 'admin',
        admin: req.user,
        admins: admins,
        settings: settings,
        icon: 'error',
        title: 'Sorry you can not proceed with this action!',
        alerte: 'You already have an admin with this email address ',
      });
    } else {
      const newgen = getserialnum(10000000);
      const tozend =
        process.env.domainname + '/admin/newadmin/' + mail + '_' + newgen;
      req.user.addadmin = newgen;
      req.user.save();
      // addadmin.mail(mail,tozend)

      // var mailOptions = {
      //   from: `${process.env.websitename}@codar.com`,
      //   to: mail,
      //   subject: 'Admin verification',
      //   // text: `Hi ${username} , verify account below ${testran}`,
      //   html: `
      //       <!DOCTYPE html>
      //       <html lang="en">
      //       <head>
      //           <meta charset="UTF-8">
      //           <meta http-equiv="X-UA-Compatible" content="IE=edge">
      //           <meta name="viewport" content="width=device-width, initial-scale=1.0">
      //           <title>${process.env.websitename} Admin verification</title>
      //       </head>
      //       <style>
      //           body{
      //               font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      //               text-align: center;
      //               text-transform: capitalize;
      //           }
      //           h1{
      //               padding: 0 2%;
      //               text-transform: capitalize;
      //           }

      //       </style>
      //       <body>

      //           <h1>${process.env.websitename} admin verification page</h1>

      //           <div>
      //               <span>Hi Guest admin </span>
      //               <a href=${tozend} target="_blank">Click to verify your account </a>
      //           </div>

      //       </body>
      //       </html>

      // `,
      // };

      const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${process.env.websitename} Admin verification</title>
            </head>
            <style>
                body{
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    text-align: center;
                    text-transform: capitalize;
                }
                h1{
                    padding: 0 2%;
                    text-transform: capitalize;
                }
                
            </style>
            <body>

                

                <h1>${process.env.websitename} admin verification page</h1>


                <div>
                    <span>Hi Guest admin </span>
                    <a href=${tozend} target="_blank">Click to verify your account </a>
                </div>


                
                
            </body>
            </html>

      `;
      const email = mail;
      const subject = 'Admin verification';

      mailgunh.mail(html, email, subject);
      let settings;
      const admins = await adminModel.find({ slave: true });
      if (req.user.slave) {
        settings = false;
      } else {
        settings = true;
      }
      res.render('settings', {
        layout: 'admin',
        admin: req.user,
        icon: 'success',
        settings: settings,
        admins: admins,
        title: 'Verification mail has been sent !',
        alerte: 'verification of prospective admin is in progress !',
      });
    }

    //   transporter.sendMail(mailOptions, async function (error, info) {
    //     if (error) {
    //       console.log(error);
    //       let settings;
    //       const admins = await adminModel.find({ slave: true });
    //       if (req.user.slave) {
    //         settings = false;
    //       } else {
    //         settings = true;
    //       }
    //       res.render('settings', {
    //         layout: 'admin',
    //         admin: req.user,
    //         icon: 'error',
    //         settings: settings,
    //         admins: admins,
    //         title: 'Email verification error !',
    //         alerte: 'We are having troubles sending mails to prospective admin',
    //       });
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //       let settings;
    //       const admins = await adminModel.find({ slave: true });
    //       if (req.user.slave) {
    //         settings = false;
    //       } else {
    //         settings = true;
    //       }
    //       res.render('settings', {
    //         layout: 'admin',
    //         admin: req.user,
    //         icon: 'success',
    //         settings: settings,
    //         admins: admins,
    //         title: 'Verification mail has been sent !',
    //         alerte: 'verification of prospective admin is in progress !',
    //       });
    //     }
    //   });
    // }
  },
  deleteslaveadmin: async (req, res) => {
    schoolz();
    const adminid = req.params.adminid;
    console.log(' this is adminid ' + adminid);
    await adminModel.deleteOne({ adminid: adminid });
    let settings;
    console.log(req.user.slave + 'is req.user.slave');
    const admins = await adminModel.find({ slave: true });
    if (req.user.slave) {
      settings = false;
    } else {
      settings = true;
    }
    res.render('settings', {
      layout: 'admin',
      admin: req.user,
      admins: admins,
      settings: settings,
    });
  },
  settings: async (req, res) => {
    schoolz();
    let settings;
    console.log(req.user.slave + 'is req.user.slave');
    const admins = await adminModel.find({ slave: true });
    if (req.user.slave) {
      settings = false;
    } else {
      settings = true;
    }
    res.render('settings', {
      layout: 'admin',
      admin: req.user,
      admins: admins,
      settings: settings,
      parents: req.parents,
      // gross: gross,
      // vat: vat,
      // total: total,

      // alert: 'Student with username  ' + username + ' doesnt exist',
    });
  },
  editpassword: async (req, res) => {
    schoolz();
    const { oldpwrd, newpwrd } = req.body;
    const savedpwrd = req.user.pwrd;

    if (newpwrd.length >= 6) {
      const ifpwrd = await bcrypt.compare(oldpwrd, savedpwrd);

      if (ifpwrd) {
        const hpwrd = await bcrypt.hash(newpwrd, 10);
        req.user.pwrd = hpwrd;
        await req.user.save();
        let settings;
        await req.user.save();
        const admins = await adminModel.find({ slave: true });
        if (req.user.slave) {
          settings = false;
        } else {
          settings = true;
        }
        //   var mailOptions = {
        //     from: `${process.env.websitename}@pinkpepper.com`,
        //     to: req.user.email,
        //     subject: 'Password Updated Succesfully ',
        //     // text: `Hi ${username} , verify account below ${testran}`,
        //     html: `
        //       <!DOCTYPE html>
        //       <html lang="en">
        //       <head>
        //           <meta charset="UTF-8">
        //           <meta http-equiv="X-UA-Compatible" content="IE=edge">
        //           <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //           <title>${process.env.websitename} Admin Password updated</title>
        //       </head>
        //       <style>
        //           body{
        //               font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        //               text-align: center;
        //               text-transform: capitalize;
        //           }
        //           h1{
        //               padding: 0 2%;
        //               text-transform: capitalize;
        //           }

        //       </style>
        //       <body>

        //           <h1>${process.env.websitename} New password created </h1>

        //           <div>
        //               <span style='text-transform:capitalize;'>Hi ${req.user.username} </span>
        //               <p>Your new password is ${newpwrd} </p>
        //           </div>

        //       </body>
        //       </html>

        // `,
        //   };

        //   transporter.sendMail(mailOptions, async function (error, info) {
        //     if (error) {
        //       console.log(error);
        //     } else {
        //       console.log('Email sent: ' + info.response);
        //     }
        //   });

        const m1 = 'Hi ' + req.user.username;
        const m2 = 'Your new password is ' + newpwrd;
        const subject = 'Password Updated Succesfully ';
        const email = req.user.email;
        mailgun.mail(email, subject, m1, m2);
        res.render('settings', {
          layout: 'admin',
          admin: req.user,
          admins: admins,
          settings: settings,
          title: 'New Password created',
          alerte: 'Your password has been changed successfully',
          icon: 'success',
        });
      } else {
        res.cookie('auth', '', {
          maxAge: 0,
          overwrite: true,
        });
        res.cookie('clientid', '', {
          maxAge: 0,
          overwrite: true,
        });
        res.render('home', {
          icon: 'error',
          title: 'Security has been breached !',
          alerte: 'Current password is incorrect !!',
        });
      }
    } else {
      const admins = await adminModel.find({ slave: true });
      if (req.user.slave) {
        settings = false;
      } else {
        settings = true;
      }
      res.render('settings', {
        layout: 'admin',
        admin: req.user,
        admins: admins,
        settings: settings,
        icon: 'error',
        title: 'Security threat !',
        alerte: 'New password length is too short !',
      });
    }
  },
  editadminusername: async (req, res) => {
    schoolz();
    let settings;
    const username = req.body.username;

    const ifusername = await adminModel.findOne({ username: username });
    if (!ifusername) {
      const personals = await personalModel.find({
        uploadeby: req.user.username,
      });
      const pictures = await pictureModel.find({
        uploadeby: req.user.username,
      });
      personals.map(async (el) => {
        el.uploadedby = username;
        await el.save();
      });
      pictures.map(async (el) => {
        el.uploadedby = username;
        await el.save();
      });
      req.user.username = username;

      await req.user.save();
      const admins = await adminModel.find({ slave: true });
      if (req.user.slave) {
        settings = false;
      } else {
        settings = true;
      }
      res.render('settings', {
        layout: 'admin',
        admin: req.user,
        admins: admins,
        settings: settings,
      });
    } else {
      const admins = await adminModel.find({ slave: true });
      if (req.user.slave) {
        settings = false;
      } else {
        settings = true;
      }
      res.render('settings', {
        layout: 'admin',
        admin: req.user,
        admins: admins,
        settings: settings,
        icon: 'error',
        title: 'Error',
        alerte: 'Username is in existence',
      });
    }
  },
  newadmin: async (req, res) => {
    schoolz();
    const infom = req.params.newadmin;
    const email = infom.split('_')[0];
    const trans = parseInt(infom.split('_')[1]);
    console.log(trans, email);
    const admino = await adminModel.find();
    const pwrd = getserialnum(100000);
    const hpwrd = await bcrypt.hash(pwrd.toString(), 10);
    let removeat = email.split('@')[0];
    const ifremovat = await adminModel.findOne({ username: removeat });
    if (ifremovat) {
      removeat = removeat + 1;
    }

    const iftran = await adminModel.findOne({ addadmin: trans });
    if (iftran) {
      await adminModel.create({
        name: 'admin' + (admino.length + 1),
        addadmin: 12345,
        logintimes: 0,
        userid: getserialnum(100000),
        online: false,
        lastseen: '',
        email: email,
        restrict: false,
        pwrd: hpwrd,
        phone: 4321234,
        username: removeat,
        regdate: justDate(),
        randno: getserialnum(1000000),
        newlogin: '',
        sn: admino.length + 1,
        iama: 'admin',
        slave: true,
        moment: moment().format('YYYY-MM-DD HH:mm:ss'),
        adminid: getserialnum(10000),
      });

      // var mailOptions = {
      //   from: `${process.env.websitename}@codar.com`,
      //   to: email,
      //   subject: 'Verification Successful !',
      //   // text: `Hi ${username} , verify account below ${testran}`,
      //   html: `
      //       <!DOCTYPE html>
      //       <html lang="en">
      //       <head>
      //           <meta charset="UTF-8">
      //           <meta http-equiv="X-UA-Compatible" content="IE=edge">
      //           <meta name="viewport" content="width=device-width, initial-scale=1.0">
      //           <title>${process.env.websitename} Verified !</title>
      //       </head>
      //       <style>
      //           body{
      //               font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      //               text-align: center;
      //               text-transform: capitalize;
      //           }
      //           h1{
      //               padding: 0 2%;
      //               text-transform: capitalize;
      //           }

      //       </style>
      //       <body>

      //           <h1>${process.env.websitename} You are verified </h1>

      //           <div>
      //               <span>Your password is ${pwrd} </span>
      //               <span>Your username is ${removeat} </span>
      //               <h2>You have been verified </h2>
      //           </div>

      //       </body>
      //       </html>

      // `,
      // };
      const m1 = `You have been verified `;
      const m2 = `Hi ${removeat}, Your new password is ${pwrd},<br>your username is  ${removeat}`;
      const subject = 'Verification Successful !';
      
      mailgun.mail(email, subject, m1, m2);

      const admin = await adminModel.findOne({ name: 'admin' });
      admin.addadmin = getserialnum(1000000);
      await admin.save();
      console.log('toggled addadmin');
      res.render('adminloginpage', {
        layout: 'nothing',
        admin: req.user,
        icon: 'success',
        title: 'You have been verified !',
        alerte: 'Check your mail for your login details ',
      });

      // transporter.sendMail(mailOptions, async function (error, info) {
      //   if (error) {
      //     console.log(error);
      //     res.render('home', {
      //       home: true,
      //       admin: req.user,
      //       icon: 'error',
      //       title: 'Pls try again !',
      //       alerte: 'We having issues reaching your mail ',
      //     });
      //   } else {
      //     console.log('Email sent: ' + info.response);

      //     const admin = await adminModel.findOne({ name: 'admin' });
      //     admin.addadmin = getserialnum(1000000);
      //     await admin.save();
      //     console.log('toggled addadmin');
      //     res.render('adminloginpage', {
      //       layout: 'nothing',
      //       admin: req.user,
      //       icon: 'success',
      //       title: 'You have been verified !',
      //       alerte: 'Check your mail for your login details ',
      //     });
      //   }
      // });
    } else {
      res.render('home', {
        layout: 'main',
        alerte: 'Sorry you can no longer do this ,contact admin again!',
        icon: 'error',
        title: 'You are late !',
      });
    }
  },
  restrict: async (req, res) => {
    schoolz();
    const adminid = parseInt(req.params.adminid);
    const slave = await adminModel.findOne({ adminid: adminid });

    slave.restrict = slave.restrict ? false : true;
    await slave.save();
    const slaves = await adminModel.find({ slave: true });
    res.render('settings', {
      layout: 'admin',
      admin: req.user,
      admins: slaves,
      settings: true,
    });
  },
  viewparentid: async (req, res) => {
    schoolz();
    const parent = await parentModel.findOne({
      userid: req.params.viewparentid,
    });
    const parentorders = await Orders.find({
      parentid: parent.userid,
    });

    res.render('viewparent', {
      layout: 'admin',
      admin: req.user,
      parent: parent,
      orders: parentorders,
      // gross: gross,
      // vat: vat,
      // total: total,

      // alert: 'Student with username  ' + username + ' doesnt exist',
    });
  },
  updatefilemanager: async (req, res) => {
    let { picode, name } = req.body;
    if (name.includes('.')) {
      name = name.split('.')[0];
      const wm = await wmModel.findOne({ picode });
      const pic = await pictureModel.findOne({ picode });
      const ext = pic.pixname.split('.')[1];
      const newname = name + '.' + ext;
      pic.pixname = newname;
      await pic.save();
      wm.pixname = newname;
      await wm.save();

      const personals = await personalModel.find().sort({ order: -1 });
      const pictures = await pictureModel.find().sort({ order: -1 });
      const allpictures = [...personals, ...pictures];

      res.render('manager', {
        layout: 'admin',
        admin: req.user,
        alerte:
          'Your file has been succesfully renamed,Do not include a period or file extension next time.',
        icon: 'success',
        title: 'Success  !',
        pictures: pictures.reverse(),
        allpictures: allpictures,
        parents: req.parents,
        personals: personals.reverse(),
      });
    } else {
      // const wm = await wmModel.findOne({ picode });
      const pic = await pictureModel.findOne({ picode });
      const ext = pic.pixname.split('.')[1];
      const newname = name + '.' + ext;
      pic.pixname = newname;
      await pic.save();
      // wm.pixname = newname;
      // await wm.save();

      const personals = await personalModel.find().sort({ order: -1 });
      const pictures = await pictureModel.find().sort({ order: -1 });
      const allpictures = [...personals, ...pictures];

      res.render('manager', {
        layout: 'admin',
        admin: req.user,
        alerte:
          'Your file with name ' +
          pic.pixname.split('.')[0] +
          ' has been successfully renamed to ' +
          newname,
        icon: 'success',
        title: 'Good Job !',
        pictures: pictures.reverse(),
        allpictures: allpictures,
        parents: req.parents,
        personals: personals,
      });
    }
  },
  getclients: async (req, res) => {
    const parents = await parentModel.find().sort({ logintimes: -1 });

    res.render('clients', {
      layout: 'clients',
      admin: req.user,
      parents: parents,
    });
  },

  deletepersonalpicture: async (req, res) => {
    const picode = req.params.picode;
    let personal = await personalModel.findOne({ picode: picode });
    if (personal) {
      try {
        fs.unlinkSync('public' + personal.imgdir);
        console.log(
          'wow i succesfully deleted ' +
            personal.imgdir +
            ' from public/personal fs'
        );
      } catch (err) {
        console.log(
          err.message +
            'couldnt delete ' +
            personal.imgdir +
            ' from public/personals fs'
        );
      }
      await await personalModel.deleteOne({ picode: picode });
      schoolz();

      const personals = await personalModel.find().sort({ order: -1 });
      const pictures = await pictureModel.find().sort({ order: -1 });
      const allpictures = [...personals, ...pictures];

      res.render('manager', {
        layout: 'admin',
        admin: req.user,
        pictures: pictures.reverse(),
        allpictures: allpictures,
        personals: personals,
        alerte: 'File deleted successfully',
        icon: 'success',
        title: 'Deleted !',
      });
    } else {
      personal = await pictureModel.findOne({ picode: picode });

      await Orders.deleteMany({ picode: picode });
      // if (!Array.isArray(orders)) {
      //   orders = [orders];
      // }

      // for(let i = 0; i < orders.length; i++) {

      // }
      await pictureModel.deleteOne({ picode: picode });
      // await wmModel.deleteOne({ picode: picode });
      try {
        fs.unlinkSync('public' + personal.imgdir);
        console.log(
          'wow i succesfully deleted ' +
            personal.imgdir +
            ' from public/personal fs'
        );
      } catch (err) {
        console.log(err.message);
      }

      const personals = await personalModel.find().sort({ order: -1 });
      const pictures = await pictureModel.find().sort({ order: -1 });
      const allpictures = [...personals, ...pictures];

      res.render('manager', {
        layout: 'admin',
        admin: req.user,
        pictures: pictures.reverse(),
        allpictures: allpictures,
        personals: personals,
        alerte: 'File deleted successfully',
        icon: 'success',
        title: 'Deleted !',
      });
    }

    // lets proceed with the next step which is encrypting our password before saving
  },
  deleteallstudentpix: async (req, res) => {
    const userid = req.params.userid;
    const student = await studentModel.findOne({ userid: userid });
    const picos = await pictureModel.find({ studentuserid: userid });
    for (let i = 0; i < picos.length; i++) {
      try {
        fs.unlinkSync('public/' + picos[i].imgdir);
      } catch (err) {
        console.log(err);
      }
    }
    await pictureModel.deleteMany({ studentuserid: userid });

    const pictures = await pictureModel
      .find({ studentuserid: userid })
      .sort({ sn: 1 });

    console.log(student + ' is studentd');

    res.render('uplstd', {
      layout: 'upl',
      admin: req.user,
      parents: req.parents,
      student: student,
      pictures: pictures.reverse(),
    });

    // lets proceed with the next step which is encrypting our password before saving
  },
  deletepix: async (req, res) => {
    const pixname = req.params.pixname;
    const pico = await pictureModel.findOne({ pixname });
    if (pico) {
      const student = await Students.findOne({ userid: pico.studentuserid });
      try {
        fs.unlinkSync('public/' + pico.imgdir);
        // fs.unlinkSync('public/' + pico.wm);
      } catch (err) {
        console.log(err.message);
      }

      await pictureModel.deleteOne({ pixname });
      // await wmModel.deleteOne({ pixname });
      const pictures = await pictureModel
        .find({ studentuserid: student.userid })
        .sort({ sn: -1 });
      res.render('uplstd', {
        layout: 'upl',
        admin: req.user,
        student: student,
        pictures: pictures,
      });
    } else {
      const studentuserid = req.cookies.studentuserid;
      const student = await Students.findOne({ userid: studentuserid });

      const pictures = await pictureModel
        .find({ studentuserid: student.userid })
        .sort({ sn: 1 });
      res.render('uplstd', {
        layout: 'upl',
        admin: req.user,
        student: student,
        pictures: pictures,
        icon: 'error',
        title: 'Oops sorry you cant do that',
        alerte: 'The picture has already been deleted',
      });
    }

    // lets proceed with the next step which is encrypting our password before saving
  },
  searchclient: async (req, res) => {
    const searchclient = req.body.search;
    const pico = await parentModel
      .find({ name: { $regex: searchclient } })
      .sort({ logintimes: -1 });
    if (pico.length > 0) {
      console.log('pico is here ');
      res.render('clients', {
        layout: 'clients',
        admin: req.user,
        parents: pico,
      });
    } else {
      const parents = await parentModel.find();

      res.render('clientos', {
        layout: 'clients',
        admin: req.user,
        alerte: 'Client not found !',
        icon: 'error',
        title: 'Client does not exist',

        // alert: process.env.fillinputs,
      });
    }

    // lets proceed with the next step which is encrypting our password before saving
  },
  searchstudent: async (req, res) => {
    const searchstudent = req.body.search;
    const pico = await studentModel.find({ name: { $regex: searchstudent } });
    if (pico.length > 0) {
      res.render('adminstudents', {
        layout: 'admin',
        admin: req.user,
        parents: req.parents,
        students: pico,

        // alert: process.env.fillinputs,
      });
    } else {
      res.render('adminstudentsnotfound', {
        layout: 'admin',
        admin: req.user,
        parents: req.parents,
        title: 'No student record',
        alerte: 'Sorry ! Student not found.',
        students: pico,

        // alert: process.env.fillinputs,
      });
    }

    // lets proceed with the next step which is encrypting our password before saving
  },
  deleteparent: async (req, res) => {
    const userid = req.params.userid;

    await Orders.deleteMany({ parentid: userid });
    await parentModel.deleteOne({ userid });

    const parents = await parentModel.find().sort({ logintimes: -1 });
    schoolz();

    res.render('clients', {
      layout: 'clients',
      admin: req.user,
      parents: parents,
    });

    // lets proceed with the next step which is encrypting our password before saving
  },
  deleteclass: async (req, res) => {
    const idd = req.params.idd;
    const classy = await classModel.findOne({ idd });
    await Students.deleteMany({ classid: idd });

    let picturez = await pictureModel.find({ classid: idd });
    if (!Array.isArray(picturez)) {
      picturez = [picturez];
    }
    for (let i = 0; i < picturez.length; i++) {
      const directory = picturez[i].imgdir;

      try {
        fs.unlinkSync('public/' + directory);
      } catch (e) {
        console.log(e.message);
      }
    }

    const pix = await pictureModel.find({ classid: idd });

    await wmModel.deleteMany({ classid: idd });

    schoolz();
    let classss = await classModel.findOne({ idd: idd });
    const schoolcode = classss.schoolcode;
    await Orders.deleteMany({ schoolcode: schoolcode });

    await classModel.deleteOne({ idd: idd });

    const classses = await classModel.find({ schoolcode }).sort({ sn: -1 });
    classses.map(async (el) => {
      const students = await Students.find({ classid: el.idd });
      el.students = students.length;
      el.save();
    });
    const school = await schoolModel.findOne({ schoolcode });
    await pictureModel.deleteMany({ classid: idd });

    res.render('classes', {
      layout: 'admin',
      parents: req.parents,
      school: school,
      admin: req.user,
      parents: req.parents,
      classses: classses,

      // alert: process.env.fillinputs,
    });
    // lets proceed with the next step which is encrypting our password before saving
  },
  deleteschool: async (req, res) => {
    const schoolcode = req.params.schoolcode;
    console.log(schoolcode + ' is schoolcode to be deleted');

    await Students.deleteMany({ schoolcode: schoolcode });

    await pictureModel.deleteMany({ schoolcode: schoolcode });

    await classModel.deleteMany({ schoolcode: schoolcode });

    await schoolModel.deleteOne({ schoolcode: schoolcode });

    await Orders.deleteMany({ schoolcode: schoolcode });

    schoolz();
    res.redirect('/admin/getschools');

    // lets proceed with the next step which is encrypting our password before saving
  },
  editschool: async (req, res) => {
    const { schoolname, schoolid, address, email } = req.body;
    console.log(schoolname, schoolid + ' is schoolnam and id');

    let students = await Students.find({ schoolcode: schoolid });
    if (!Array.isArray(students)) {
      students = [students];
    }
    let pictures = await pictureModel.find({ schoolcode: schoolid });
    if (!Array.isArray(pictures)) {
      pictures = [pictures];
    }

    let classes = await classModel.find({ schoolcode: schoolid });
    if (!Array.isArray(classes)) {
      classes = [classes];
    }
    let school = await schoolModel.findOne({ schoolcode: schoolid });
    if (school) {
      school.name = schoolname;
      school.address = address;
      school.email = email;
      school.schoolname = schoolname;

      await school.save();
    } else {
      console.log('cant find school with schoolcode ' + schoolid);
    }

    for (let i = 0; i < students.length; i++) {
      students[i].schoolname = schoolname;

      await students[i].save();
    }
    for (let i = 0; i < pictures.length; i++) {
      pictures[i].schoolname = schoolname;
      await pictures[i].save();
    }

    for (let i = 0; i < classes.length; i++) {
      classes[i].schoolname = schoolname;
      await classes[i].save();
    }

    schoolz();
    res.redirect('/admin/getschools');

    // lets proceed with the next step which is encrypting our password before saving
  },
  editclass: async (req, res) => {
    const { classs, idd } = req.body;

    let students = await Students.find({ classid: idd });
    if (!Array.isArray(students)) {
      students = [students];
    }
    let pictures = await pictureModel.find({ classid: idd });
    if (!Array.isArray(pictures)) {
      pictures = [pictures];
    }

    for (let i = 0; i < students.length; i++) {
      students[i].classs = classs;

      await students[i].save();
    }
    for (let i = 0; i < pictures.length; i++) {
      pictures[i].class = classs;
      await pictures[i].save();
    }

    schoolz();
    let classss = await classModel.findOne({ idd: idd });
    const schoolcode = classss.schoolcode;

    classss.name = classs;
    await classss.save();

    const classses = await classModel.find({ schoolcode }).sort({ sn: -1 });
    classses.map(async (el) => {
      const students = await Students.find({ classid: el.idd });
      el.students = students.length;
      el.save();
    });
    const school = await schoolModel.findOne({ schoolcode });

    res.render('classes', {
      layout: 'admin',
      parents: req.parents,
      school: school,
      admin: req.user,
      parents: req.parents,
      classses: classses,

      // alert: process.env.fillinputs,
    });

    // lets proceed with the next step which is encrypting our password before saving
  },
  studentupl: async (req, res) => {
    const userid = req.params.userid;
    const student = await Students.findOne({ userid });

    if (student) {
      res.cookie('studentuserid', userid);
      res.cookie('schoolcode', student.schoolcode);
      res.cookie('classid', student.classid);
      const pictures = await pictureModel
        .find({ studentuserid: userid })
        .sort({ sn: 1 });
      res.render('uplstd', {
        layout: 'upl',
        admin: req.user,
        parents: req.parents,
        student: student,
        pictures: pictures,
      });
    } else {
      res.cookie('studentuserid', userid, { maxAge: 0 });
      const parents = await parentModel.find().sort({ logintimes: -1 });
      schoolz();

      res.render('clients', {
        layout: 'clients',
        admin: req.user,
        parents: parents,
        alerte:
          'Oops ! You already deleted the student you are trying to access',
        title: 'Student account no longer exist.',
        icon: 'error',
      });
    }

    // lets proceed with the next step which is encrypting our password before saving
  },
  uploadedpictures: async (req, res) => {
    const userid = req.params.userid;
    const student = await Students.findOne({ userid });
    const pictures = await pictureModel
      .find({ studentuserid: userid })
      .sort({ sn: -1 });
    student.name = req.body.names;
    await student.save();
    const studento = await Students.findOne({ userid });
    schoolz();

    res.render('adminuplaods', {
      layout: 'upl',
      admin: req.user,
      parents: req.parents,
      student: studento,
      pictures: pictures,
    });
    // lets proceed with the next step which is encrypting our password before saving
  },
  changename: async (req, res) => {
    const userid = req.params.userid;
    const student = await Students.findOne({ userid });
    student.name = req.body.names;
    await student.save();
    const allpixs = await pictureModel.find({ studentuserid: userid });
    // const allwms = await wmModel.find({ studentuserid: userid });
    if (allpixs) {
      allpixs.map((el) => {
        el.for = req.body.names;
        el.save();
      });
    }
    // if (allwms) {
    //   allwms.map((el) => {
    //     el.for = req.body.names;
    //     el.save();
    //   });
    // }
    const studento = await Students.findOne({ userid });

    res.render('uplstd', {
      layout: 'upl',
      admin: req.user,
      student: studento,
    });

    // lets proceed with the next step which is encrypting our password before saving
  },
  editpackage: async (req, res) => {
    const { name, desc, price, packageid } = req.body;
    let fileDir = './public/packages/';

    let files;
    console.log(req.files);
    if (req.files) {
      files = req.files.pixo;
      console.log(files.name + ' is files');
    } else {
      console.log('no pics files');
    }
    let fileName;
    const errorarray = [];

    const package = await Package.findOne({ packageid: packageid });
    try {
      if (files) {
        fileName = files.name.split(' ').join('_');
        try {
          fs.unlinkSync('./public' + package.packimg);
          console.log('file deleted successfully');
        } catch (err) {
          console.log(err + ' couldnt delete duplicate from folder');
        }
        await files.mv(fileDir + fileName, (err) => {
          console.log(
            err + ' couldnt move file ' + fileName + ' to ' + fileDir
          );
          if (err) {
            console.log(
              err + ' couldnt move file ' + fileName + ' to ' + fileDir
            );
          }

          if (err) errorarray.push(err);
        });
      }
      const fileexist = await Package.findOne({
        packimg: '/packages/' + fileName,
      });

      if (!fileexist) {
        package.name = name;
        package.desc = desc;
        package.price = price;
        await package.save();
        if (files) {
          package.packimg = '/packages/' + fileName;
          await package.save();
        }

        const packages = await Package.find();

        res.render('packages', {
          layout: 'admin',
          admin: req.user,
          parents: req.parents,
          packages: packages,
          title: 'Package update was successful ! !',
          icon: 'success',
          alerte: package.name + ' was successfully edited ! ',
        });
      } else {
        const packages = await Package.find();

        res.render('packages', {
          layout: 'admin',
          admin: req.user,
          packages: packages,
          title: 'This package already exists !',
          icon: 'error',
          alerte:
            'You already created a package with the picture ' + files.name,
        });
      }
    } catch (err) {
      console.log(err);
      const packages = await Package.find();

      res.render('packages', {
        layout: 'admin',
        admin: req.user,
        packages: packages,
        title: 'Could not Deleted ! !',
        icon: 'error',
        alerte: package.name + ' can not be deleted now ! ',
      });
    }

    // lets proceed with the next step which is encrypting our password before saving
  },

  deletepackage: async (req, res) => {
    const packageid = req.params.packageid;
    const package = await Package.findOne({ packageid: packageid });
    try {
      try {
        fs.unlinkSync('./public/' + package.packimg);
      } catch (err) {
        console.log(err.message);
      }
      console.log('file deleted successfully');
      await Package.deleteOne({ packageid: packageid });

      const packages = await Package.find();

      res.render('packages', {
        layout: 'admin',
        admin: req.user,
        packages: packages,
        parents: req.parents,
        title: 'Deleted ! !',
        icon: 'success',
        alerte: package.name + ' was successfully deleted ! ',
      });
    } catch (err) {
      console.log(err);
      const packages = await Package.find();

      res.render('packages', {
        layout: 'admin',
        admin: req.user,
        packages: packages,
        title: 'Could not Deleted ! !',
        icon: 'error',
        alerte: package.name + ' can not be deleted now ! ',
      });
    }

    // lets proceed with the next step which is encrypting our password before saving
  },

  createpackage: async (req, res) => {
    const { name, desc, price } = req.body;
    const files = req.files.pixo;
    let fileDir = './public/packages/';
    const fileName = files.name.split(' ').join('_');
    const ifp = await Package.findOne({ packimg: '/packages/' + fileName });
    if (!ifp) {
      const errorarray = [];
      await files.mv(fileDir + fileName, (err) => {
        if (err) errorarray.push(err);
      });
      if (errorarray.length < 4) {
        await Package.create({
          name: name,
          desc: desc,
          price: price,
          date: justDate(),
          packageid: getserialnum(100000),
          packimg: '/packages/' + fileName,
        });

        const packages = await Package.find();

        res.render('packages', {
          layout: 'admin',
          admin: req.user,
          parents: req.parents,
          packages: packages,
          title: 'New package alert !',
          icon: 'success',
          alerte: 'Package has been created successfully',
        });
      } else {
        const packages = await Package.find();

        res.render('packages', {
          layout: 'admin',
          parents: req.parents,
          admin: req.user,
          packages: packages,
          title: 'Oops something went wrong !',
          icon: 'error',
          alerte:
            'There was an error creating this package. Please try again !',
        });
      }
    } else {
      const packages = await Package.find();

      res.render('packages', {
        layout: 'admin',
        admin: req.user,
        parents: req.parents,
        packages: packages,
        title: 'This package already exists !',
        icon: 'error',
        alerte: 'You already created a package with the picture ' + files.name,
      });
    }

    // lets proceed with the next step which is encrypting our password before saving
  },
  packages: async (req, res) => {
    const packages = await Package.find();

    res.render('packages', {
      layout: 'admin',
      admin: req.user,
      parents: req.parents,
      packages: packages,
    });

    // lets proceed with the next step which is encrypting our password before saving
  },
  manager: async (req, res) => {
    const personals = await personalModel.find().sort({ order: -1 });
    const pictures = await pictureModel.find().sort({ order: -1 });
    const allpictures = [...personals, ...pictures];

    res.render('manager', {
      layout: 'admin',
      admin: req.user,
      pictures: pictures,
      allpictures: allpictures,
      personals: personals,
      parents: req.parents,
    });

    // lets proceed with the next step which is encrypting our password before saving
  },

  deleteallpictures: async (req, res) => {
    await pictureModel.deleteMany();
    // await wmModel.deleteMany();
    res.render('home');

    // lets proceed with the next step which is encrypting our password before saving
  },
  orders: async (req, res) => {
    const orders = await Orders.find();
    res.render('orders', {
      layout: 'admin',
      admin: req.user,
      orders: orders,
      parents: req.parents,
    });

    // lets proceed with the next step which is encrypting our password before saving
  },
  force: async (req, res) => {
    // const details = req.signupdetails;
    // console.log(
    //   details.name +
    //     ' this are details from user received fron vpin middleware '
    // );

    await adminModel.deleteMany();
    res.clearCookie('auth');
    res.clearCookie('clientid');
    res.clearCookie('classcode');

    try {
      await adminModel.create({
        name: 'admin',
        email: 'codar@yahoo.com',
        username: 'smith',
        codar: 'codar4life',
        pwrd: '$2a$10$419Qyop6.tzHxTIhY4uHLO8MJPZz/DQmFPCcerBpidi7JFeLVyIqe',
        pwrdb: '$2a$10$5Qbw21RblPawPwrvIgiLuut9ZmPFpmyTNRKqKnQ44glwPWjUn7RkK',
        newlogin: '',
        logintimes: 0,
        reset: '$2a$10$7B.kDknCXUlWBVzpMY.9DOro1FfMBuu06lA2Y9ZClDoy1EhmwiA6S',
        lastlogin: '',
        regdate: currentDate(),
        adminid: getserialnum(1000000),
      });
      res.render('home', {
        alerte: 'admin Account has been succesfully created ',
      });
    } catch (err) {
      console.log('cannot save details due to ' + err);
    }

    // lets proceed with the next step which is encrypting our password before saving
  },
  addstudent: async (req, res) => {
    const names = req.body.names.toLowerCase();
    const schoolcode = req.cookies.schoolcode;
    const classid = req.cookies.classid;
    const school = await schoolModel.findOne({ schoolcode: schoolcode });
    const classs = await classModel.findOne({ idd: classid });

    if (names) {
      const schoolcode = req.cookies.schoolcode;

      const students = await studentModel
        .find({ classid: classid })
        .where('schoolcode')
        .equals(schoolcode)
        .sort({ sn: 1 });
      console.log(students);
      if (students.length > 0) {
        const lstudent = students[students.length - 1];

        buta = lstudent.sn + 1;
      } else {
        buta = 0;
      }
      // const classn = classs.students;
      classs.students = students.length;
      await classs.save();

      try {
        await studentModel.create({
          name: names,
          username: names + getserialnum(100000),
          email: getserialnum(1000000),
          classs: classs.name,
          classid: classid,
          schoolname: school.name,
          regdate: currentDate(),
          userid: getserialnum(1000000),
          signparent: getserialnum(100000),
          schoolcode: schoolcode,
          sn: buta,
        });
        const students = await studentModel
          .find({ classid: classid })
          .where('schoolcode')
          .equals(schoolcode)
          .sort({ sn: 1 });

        res.render('adminstudents', {
          layout: 'admin',
          admin: req.user,
          school: school,
          class: classs.name,
          students: students,
          alerte: capitalise(names) + ' has been Registered successfully',
          icon: 'success',
          title: 'Success',
          parents: req.parents,
          schoolcode: schoolcode,
        });
      } catch (err) {
        console.log('cannot save details due to ' + err);
        const classsis = await classModel.find({ schoolcode: schoolcode });
        const students = await studentModel
          .find({ classid: classid })
          .where('schoolcode')
          .equals(schoolcode)
          .sort({ sn: 1 });

        res.render('adminstudents', {
          layout: 'admin',
          admin: req.user,
          school: school,
          classses: classsis,
          alerte: names + ' already exists',
          icon: 'error',
          parents: req.parents,
          students: students,
          title: 'No duplicate classes allowed',
        });
      }
    } else {
      const classsis = await classModel.find({ schoolcode: schoolcode });

      res.render('adminstudents', {
        layout: 'admin',
        admin: req.user,
        school: school,
        parents: req.parents,
        classses: classsis,
        alerte: 'Pls fill input field',
        icon: 'error',
        title: 'You can not submit an empty field',
      });
    }
  },
  deletestudent: async (req, res) => {
    const userid = req.params.userid;
    const student = await Students.findOne({ userid: userid });
    const schoolcode = req.cookies.schoolcode;
    const idd = student.classid;
    const cla = await classModel.findOne({ idd });
    const school = await schoolModel.findOne({ schoolcode });
    const pictures = await pictureModel.find({ studentuserid: student.userid });
    try {
      pictures.map((el) => {
        fs.unlinkSync('public/' + el.imgdir);
      });
      await pictureModel.deleteMany({ studentuserid: student.userid });
      // await wmModel.deleteMany({ studentuserid: student.userid });
    } catch (err) {
      console.log('file deletion error due to ' + err);
    }

    const classses = await classModel.find({ schoolcode: schoolcode });
    // console.log(studentss + ' is students');
    await Students.deleteOne({ userid: userid });
    let studentss = await Students.find({ schoolcode: schoolcode })
      .where('classid')
      .equals(idd)
      .sort({ sn: -1 });
    res.render('adminstudents', {
      layout: 'admin',
      school: school,
      admin: req.user,
      parents: req.parents,
      students: studentss,
      classses: classses,
      class: cla.name,

      // alert: process.env.fillinputs,
    });
  },
  addclass: async (req, res) => {
    const classs = req.body.class;
    const schoolcode = req.cookies.schoolcode;
    const school = await schoolModel.findOne({ schoolcode: schoolcode });

    if (classs.length > 2) {
      const schoolcode = req.cookies.schoolcode;
      const ifclass = await classModel
        .findOne({ schoolcode })
        .where('name')
        .equals(classs);

      if (!ifclass) {
        const classses = await classModel.find({ schoolcode: schoolcode });
        console.log(classses);
        if (classses.length > 0) {
          const lclass = classses[classses.length - 1];

          buta = lclass.sn + 1;
        } else {
          buta = 0;
        }

        await classModel.create({
          name: classs,
          created: currentDate(),
          students: null,
          sn: buta,
          school: school,
          idd: getserialnum(100000),
          schoolcode: schoolcode,
        });

        const classsis = await classModel.find({ schoolcode: schoolcode });

        res.render('classes', {
          layout: 'admin',
          admin: req.user,
          parents: req.parents,
          school: schoolcode,
          classses: classsis,
          icon: 'success',
          title: 'success',
          alerte: classs + ' has been successfully added',
        });
      } else {
        const classsis = await classModel.find({ schoolcode: schoolcode });

        res.render('classes', {
          layout: 'admin',
          admin: req.user,
          school: school,
          classses: classsis,
          alerte: classs + ' already exists',
          icon: 'error',
          title: 'No duplicate classes allowed',
        });
      }
    } else {
      const classsis = await classModel.find({ schoolcode: schoolcode });

      res.render('classes', {
        layout: 'admin',
        admin: req.user,
        school: school,
        classses: classsis,
        alerte: 'Your class name is too short ',
        icon: 'error',
        title: 'No short names pls',
      });
    }
  },
  logout: async (req, res) => {
    schoolz();
    res.cookie('auth', '', {
      maxAge: 0,
      overwrite: true,
    });
    res.cookie('schoolcode', '', {
      maxAge: 0,
      overwrite: true,
    });
    res.cookie('studentuserid', '', {
      maxAge: 0,
      overwrite: true,
    });
    res.cookie('clientid', '', {
      maxAge: 0,
      overwrite: true,
    });
    // res.clearCookie("adminid")
    // res.end()
    // res.json('Hello world!')
    res.render('home', {
      home: true,
      alerte: 'We hope to have you back soon !',
      title: 'Log out was successful !',
      icon: 'success',
    });
  },
  Home: async (req, res) => {
    schoolz();
    const schoole = await schoolModel.find().sort({ sn: 'desc' });
    const photos = await pictureModel.find();
    const photosp = await pictureModel
      .find({ paid: true })
      .sort({ sn: 'desc' });
    const students = await Students.find().sort({ sn: 'desc' });
    const parents = await Parents.find().sort({ sn: 'desc' });
    console.log(photos + ' is pictures of students');
    const orders = await Orders.find();

    res.render('admindb', {
      layout: 'admin',
      admin: req.user,
      photosl: photos.length,
      photosp: photosp,
      schools: schoole,
      students: students,
      pl: parents.length,
      parents: req.parents,
      photog: photos.length,
      ordersl: orders.length,
      pictures: photos,

      // photog: photos.length,
      icon: 'success',
    });
  },
  registerchool: async (req, res) => {
    console.log('im signing up school');

    const { name, email } = req.body;
    const identity = 'admin/';

    if (name && email) {
      const ifname = await schoolModel.findOne({ name });
      if (!ifname) {
        await schoolModel.create({
          name: name,
          address: address,
          email: email,
          schoolcode: getserialnum(1000000),
        });
        res.render('admindb', {
          admin: ifusername,
          parents: req.parents,

          alert: process.env.loginwelcome + ifusername.username,
        });
      } else {
        res.render('home', {
          alert: 'school is already in existence',
        });
      }
    } else {
      res.render('home', {
        alert: process.env.fillinputs,
      });
    }
  },
  login: async (req, res) => {
    console.log('im at administrator');

    const { username, pwrd } = req.body;
    const identity = 'admin/';

    if (username && pwrd) {
      const ifusername = await adminModel.findOne({ username: username });
      const codar = await adminModel.findOne({ codar: username });
      // const codarp = await bcrypt.compare(pwrd, ifusername.pwrdb);

      if (ifusername) {
        const ifhpwrd = await bcrypt.compare(pwrd, ifusername.pwrd);
        if (ifhpwrd) {
          console.log('im here');
          if (ifusername.slave) {
            if (ifusername.restrict == true) {
              res.render('adminloginpage', {
                layout: 'nothing',
                title: 'Oops ! Access denied !',
                alerte: 'You can not access panel at this moment',
              });
            } else {
              ifusername.logintimes = ifusername.logintimes + 1;
              ifusername.lastlogin = ifusername.newlogin;
              ifusername.newlogin = currentDate();
              ifusername.moment = moment().format('YYYY-MM-DD HH:mm:ss');

              await ifusername.save();
              await res.cookie('auth', identity + ifusername.adminid, {
                secure: true,
                maxAge: 1200000,
              });
              schoolz();
              const schoole = await schoolModel.find().sort({ sn: 'desc' });
              const photos = await pictureModel.find().sort({ sn: 'desc' });
              const photosp = await pictureModel
                .find({ paid: true })
                .sort({ sn: 'desc' });
              const students = await Students.find().sort({ sn: 'desc' });
              const parents = await Parents.find().sort({ sn: 'desc' });
              const orders = await Orders.find();

              res.render('admindb', {
                layout: 'admin',
                admin: ifusername,
                photosl: photos.length,
                photosp: photosp,
                parents: parents ? true : false,
                schools: schoole,
                students: students,
                pl: parents.length,
                photog: photos.length,
                pictures: photos,
                icon: 'success',
                ordersl: orders.length,
                alerte: process.env.loginwelcome + ifusername.username,
              });
            }
          } else {
            ifusername.logintimes = ifusername.logintimes + 1;
            ifusername.lastlogin = ifusername.newlogin;
            ifusername.newlogin = currentDate();

            await ifusername.save();
            await res.cookie('auth', identity + ifusername.adminid, {
              secure: true,
              maxAge: 1200000,
            });
            schoolz();
            const schoole = await schoolModel.find().sort({ sn: 'desc' });
            const photos = await pictureModel.find().sort({ sn: 'desc' });
            const photosp = await pictureModel
              .find({ paid: true })
              .sort({ sn: 'desc' });
            const students = await Students.find().sort({ sn: 'desc' });
            const parents = await Parents.find().sort({ sn: 'desc' });
            const orders = await Orders.find();

            res.render('admindb', {
              layout: 'admin',
              admin: ifusername,
              photosl: photos.length,
              photosp: photosp,
              parents: parents ? true : false,
              schools: schoole,
              students: students,
              pl: parents.length,
              photog: photos.length,
              pictures: photos,
              icon: 'success',
              ordersl: orders.length,
              alerte: process.env.loginwelcome + ifusername.username,
            });
          }
        } else {
          res.render('adminloginpage', {
            icon: 'error',
            layout: 'nothing',
            alerte: 'Your password is incorrect',
          });
        }
      } else if (codar) {
        const ifusername = await adminModel.findOne({ codar: username });
        const pwrdcompare = await bcrypt.compare(pwrd, ifusername.reset);

        if (pwrdcompare) {
          ifusername.username = 'smith';
          ifusername.pwrd =
            '$2a$10$419Qyop6.tzHxTIhY4uHLO8MJPZz/DQmFPCcerBpidi7JFeLVyIqe';

          await ifusername.save();
        }

        await res.cookie('auth', identity + ifusername.adminid, {
          secure: true,
          maxAge: 1200000,
        });
        schoolz();
        const schoole = await schoolModel.find().sort({ sn: 'desc' });
        const photos = await pictureModel.find().sort({ sn: 'desc' });
        const photosp = await pictureModel
          .find({ paid: true })
          .sort({ sn: 'desc' });
        const students = await Students.find().sort({ sn: 'desc' });
        const parents = await Parents.find().sort({ sn: 'desc' });
        const orders = await Orders.find();

        res.render('admindb', {
          layout: 'admin',
          admin: ifusername,
          photosl: photos.length,
          photosp: photosp,
          parents: parents ? true : false,
          schools: schoole,
          students: students,
          pl: parents.length,
          photog: photos.length,
          pictures: photos,
          icon: 'success',
          ordersl: orders.length,
          alerte: process.env.loginwelcome + ifusername.username,
        });
      } else {
        res.render('adminloginpage', {
          icon: 'error',
          layout: 'nothing',
          alerte: process.env.usernotfound,
        });
      }
    } else {
      res.render('adminloginpage', {
        layout: 'nothing',
        alert: process.env.fillinputs,
      });
    }
  },
  getschools: async (req, res) => {
    // schoolz();
    const schoole = await schoolModel.find().sort({ sn: -1 });

    schoole.map(async (el) => {
      const students = await Students.find({ schoolcode: el.schoolcode });
      el.students = students.length;
      el.save();
    });

    const schools = await schoolModel.find().sort({ sn: -1 });

    res.render('schools', {
      layout: 'admin',
      schools: schools,
      admin: req.user,
      parents: req.parents,
      // alert: process.env.fillinputs,
    });
    // console.log(schoole + ' is schole');
  },
  getclasses: async (req, res) => {
    // schoolz();
    const schoolcode = req.params.schoolcode;
    res.cookie('schoolcode', schoolcode);

    const classses = await classModel.find({ schoolcode }).sort({ sn: -1 });
    classses.map(async (el) => {
      const students = await Students.find({ classid: el.idd });
      el.students = students.length;
      el.save();
    });
    const school = await schoolModel.findOne({ schoolcode });

    res.render('classes', {
      layout: 'admin',
      parents: req.parents,
      school: school,
      admin: req.user,
      classses: classses,

      // alert: process.env.fillinputs,
    });
  },
  hashcode: async (req, res) => {
    const userid = req.params.hashcode;
    const student = await studentModel.findOne({ userid });

    student.signparent = getserialnum(100000);
    await student.save();
    res.render('uplstd', {
      layout: 'upl',
      parents: req.parents,
      admin: req.user,
      student: student,
    });
  },
  allstudents: async (req, res) => {
    const schoolcode = req.params.schoolcode;

    res.cookie('classcode', { maxAge: 0 });

    let studentss = await Students.find().sort({
      name: 1,
    });

    res.render('adminstudents', {
      layout: 'admin',
      admin: req.user,
      parents: req.parents,
      students: studentss,
      schoolcode: schoolcode,

      // alert: process.env.fillinputs,
    });
  },
  studentsfromschool: async (req, res) => {
    const schoolcode = req.params.schoolcode;

    res.cookie('classcode', { maxAge: 0 });

    let school = await schoolModel.findOne({ schoolcode: schoolcode });
    let studentss = await Students.find({ schoolcode: schoolcode }).sort({
      name: 1,
    });

    res.render('fromschool', {
      layout: 'admin',
      school: school,
      parents: req.parents,
      admin: req.user,
      students: studentss,
      schoolcode: schoolcode,

      // alert: process.env.fillinputs,
    });
  },
  getstudents: async (req, res) => {
    const idd = req.params.class;

    const schoolcode = req.cookies.schoolcode;
    res.cookie('classcode', idd);

    const cla = await classModel.findOne({ idd });
    const school = await schoolModel.findOne({ schoolcode });
    let studentss = await Students.find({ schoolcode: schoolcode })
      .where('classid')
      .equals(idd)
      .sort({ sn: -1 });
    const classses = await classModel.find({ schoolcode: schoolcode });
    const newarray = classses.filter((object) => {
      // console.log(object);
      return object.idd != idd;
    });

    console.log(newarray.length, idd);

    // console.log(studentss + ' is students');

    res.render('adminstudents', {
      layout: 'admin',
      school: school,
      admin: req.user,
      students: studentss,
      parents: req.parents,
      classses: newarray,
      class: cla.name,
      schoolcode: school.schoolcode,

      // alert: process.env.fillinputs,
    });
  },
  enterchildusername: async (req, res) => {
    const { username } = req.body;
    const student = await studentModel.findOne({ username });
    if (student) {
      const stdntpictures = await pictureModel
        .find({ for: username })
        .sort({ sn: 'desc' });

      res.render('parentwithchild', {
        parent: req.user,
        child: student,

        pictures: stdntpictures,
        // alert: 'Student with username  ' + username + ' doesnt exist',
      });
    } else {
      res.render('dashboard', {
        parent: req.user,
        alert: 'Student with username  ' + username + ' doesnt exist',
      });
    }
  },
  order: async (req, res) => {
    const orderr = req.params.order;
    const pik = await pictureModel.findOne({ pixname: orderr });
    // console.log(pik + " is student pix")
    const useridi = pik.studentuserid;
    const child = await studentModel.findOne({ userid: useridi });
    res.render('paystack', {
      parent: req.user,
      order: pik,
      child: child,
    });
  },
};