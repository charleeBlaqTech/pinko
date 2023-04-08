const fs = require('fs');
const express = require('express');
const bcrypt = require('bcryptjs');
const parentModel = require('../models/parentModel');
const studentModel = require('../models/studentModel');
const pictureModel = require('../models/picturesModel');
const schoolModel = require('../models/schoolModel');
const {mailgun} = require('../models/nodemailer');
var moment = require('moment');
const boughtModel = require('../models/boughtModel');
const OrdersModel = require('../models/orderModel');
const Package = require('../models/packageModel');
const jwt = require('jsonwebtoken');

const randomn = require('crypto').randomBytes(5).toString('hex');


// addTextOnImage(pictowaterm)

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
function justDate() {
  // let mm = moment().format('MMMM Do YYYY, h:mm:ss a');
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

  schools.map(async (el, index) => {
    const schoolcode = el.schoolcode;
    const parents = await Parents.find({ schoolcode: schoolcode });
    el.parentslength = parents.length;
    await el.save();
    const students = await Students.find({ schoolcode: schoolcode });
    el.studentlength = students.length;
    await el.save();
    const teachers = await Teachers.find({ schoolcode: schoolcode });
    el.teacherlength = teachers.length;
    await el.save();
  });

  const schoole = await schoolModel.find().sort({ sn: 'desc' });
};

module.exports = {
  saveSignupdetails: async (req, res) => {
    const details = req.signupdetails;
    console.log(
      details.name +
        ' this are details from user received fron vpin middleware '
    );

    const hpwrd = await bcrypt.hash(details.pwrd, 10);

    const parid = getserialnum(1000000);

    try {
      await parentModel.create({
        name: details.name,
        email: details.email,
        phone: details.phone,
        username: details.username,
        pwrd: hpwrd,
        newlogin: '',
        logintimes: 0,
        laststudentname: 'None',
        lastlogin: justDate(),
        // schoolname: student.schoolname,
        regdate: currentDate(),
        userid: parid,
        // schoolcode: student.schoolcode,
        // childuserid: student.userid,
      });
      res.render('signuppage', {
        layout: 'nothing',
        alerte: 'Your Account has been succesfully created ',
        title: 'Congratulations',
        icon: 'success',
        // home:true
      });
    } catch (err) {
      console.log('cannot save details due to ' + err);
      res.render('signuppage', {
        alerte:
          'This operation can not be completed at this moment ,pls try again later.',
        icon: 'error',
        layout: 'nothing',
        title: 'Pls try again later.',
        // home: true,
      });
    }

    // lets proceed with the next step which is encrypting our password before saving
  },
  confirmpayment: async (req, res) => {
    const packages = await Package.find();

    res.render('pdb', {
      layout: 'parent',
      parent: req.user,
      alerte: 'Your order has been placed succesfully ',
      title: 'Success !',
      icon: 'success',
      packages: packages,
    });
  },
  packages: async (req, res) => {
    const packages = await Package.find();

    res.render('parentpackages', {
      layout: 'parent',
      parent: req.user,
      packages: packages,
    });
  },
  login: async (req, res) => {
    const { username, pwrd } = req.body;
    const identity = 'parent/';

    if (username && pwrd) {
      const ifusername = await parentModel.findOne({ username: username });
      if (ifusername) {
        const ifhpwrd = await bcrypt.compare(pwrd, ifusername.pwrd);
        if (ifhpwrd) {
          ifusername.logintimes = ifusername.logintimes + 1;
          ifusername.lastlogin = ifusername.newlogin;
          ifusername.newlogin = currentDate();
          ifusername.moment = moment().format('YYYY-MM-DD HH:mm:ss');

          await ifusername.save();
          await res.cookie('authp', identity + ifusername.userid, {
            secure: true,
            maxAge: 3600000,
          });
          // const student= await studentModel.findOne({userid:ifusername.childuserid})
          ifusername.logintimes = ifusername.logintimes + 1;
          ifusername.lastseen = currentDate();
          await ifusername.save();
          // const pictures = await wmModel.find({ studentuserid :student.userid});
          // console.log(pictures+ " is wm")
          const packages = await Package.find();
          console.log(packages + ' packages');

          res.render('pdb', {
            layout: 'parent',
            parent: ifusername,
            icon: 'success',
            packages: packages,
            title: 'Logged in Successfully',
            // pictures: pictures,
            alerte: 'Welcom ' + capitalise(ifusername.username),
          });
        } else {
          res.render('signuppage', {
            icon: 'error',
            layout: 'nothing',
            title: 'Security concern ',
            alerte: ' Incorrect Password !',
          });
        }
      } else {
        res.render('signuppage', {
          icon: 'error',
          layout: 'nothing',

          alerte: process.env.usernotfound,
        });
      }
    } else {
      res.render('signuppage', {
        icon: 'error',
        layout: 'nothing',
        alerte: process.env.fillinputs,
      });
    }
  },

  enterchildusername: async (req, res) => {
    const { username } = req.body;
    const student = await studentModel.findOne({ username });
    if (student) {
      const stdntpictures = await pictureModel
        .find({ for: username })
        .sort({ sn: 'desc' });

      const pico = stdntpictures.map((el) => {
        addTextOnImage('public/' + el.imgdir);
      });
      console.log(pico);

      res.render('parentwithchild', {
        parent: req.user,
        child: student,
        pictures: pico,
        // alert: 'Student with username  ' + username + ' doesnt exist',
      });
    } else {
      res.render('dashboard', {
        parent: req.user,
        alert: 'Student with username  ' + username + ' doesnt exist',
      });
    }
  },
  tocart: async (req, res) => {
    const tocart = req.body.pics;
    const student = await studentModel.findOne({
      userId: req.body.studentuserid,
    });

    let withpackages = req.body.opt;
    console.log(withpackages + ' is with packages');

    try {
      if (!Array.isArray(withpackages)) {
        withpackages = [withpackages];
      }
      let indee = 1;
      const objarray = [];
      withpackages.map(async (el) => {
        console.log(el + ' is el');
        const packagecode = el.split('/')[0];
        const imagename = el.split('/')[1];
        const package = await Package.findOne({ packageid: packagecode });
        const img = await pictureModel.findOne({ pixname: imagename });
        console.log(' is eachobj ', img, package);

        const eachobj = {
          wm: img.imgdir,
          name: 'Item' + indee,
          price: package.price,
          packagename: package.name,
          packageid: package.packageid,
        };
        indee++;
        objarray.push(eachobj);
      });
      console.log(objarray + ' is objarray');
      const stdntpictures = await pictureModel
        .find({ studentuserid: student.userid })
        .sort({ sn: 'desc' });
      const packages = await Package.find();

      // console.log(cba + ' is wms')

      res.render('checkout', {
        layout: 'parent',
        parent: req.user,
        child: student,
        cart: objarray,
        wm: stdntpictures,
        packages: packages,
      });
    } catch (e) {
      console.log(e).message;
      const user = req.user;
      // cont orderss = await Booked.find({for:req.user.username})
      res.render('pdb', {
        layout: 'parent',
        parent: req.user,
        // order: orders,
      });
    }
  },
  deletefromparent: async (req, res) => {
    const parent = req.user;
    const ordercode = req.params.ordercode;
    await OrdersModel.deleteOne({
      ordercode: ordercode,
    });
    const myorders = await OrdersModel.find({
      parentid: parent.userid,
    });

    res.render('myorders', {
      layout: 'parent',
      parent: req.user,
      orders: myorders,
      // gross: gross,
      // vat: vat,
      // total: total,

      // alert: 'Student with username  ' + username + ' doesnt exist',
    });
  },
  psettings: async (req, res) => {
    res.render('psettings', {
      layout: 'parent',
      parent: req.user,
      // gross: gross,
      // vat: vat,
      // total: total,

      // alert: 'Student with username  ' + username + ' doesnt exist',
    });
  },
  myorders: async (req, res) => {
    const parent = req.user;
    const myorders = await OrdersModel.find({
      parentid: parent.userid,
    });

    res.render('myorders', {
      layout: 'parent',
      parent: req.user,
      orders: myorders,
      // gross: gross,
      // vat: vat,
      // total: total,

      // alert: 'Student with username  ' + username + ' doesnt exist',
    });
  },

  editusername: async (req, res) => {
    const { username, name } = req.body;
    const fusername = req.user.username;
    req.user.name = name;
    await req.user.save();
    const ifusername = await parentModel.findOne({ username: username });
    if (username == fusername) {
      res.render('psettings', {
        layout: 'parent',
        parent: req.user,
      });
    } else if (!ifusername) {
      const orders = await OrdersModel.find({
        parentid: req.user.userid,
      });

      orders.map(async (el) => {
        el.username = username;
        await el.save();
        console.log(el.username);
      });
      req.user.username = username;

      await req.user.save();

      res.render('psettings', {
        layout: 'parent',
        parent: req.user,
      });
    } else {
      res.render('psettings', {
        layout: 'parent',
        parent: req.user,
        icon: 'error',
        title: 'Error',
        alerte: 'Username is in existence',
      });
    }
  },
  finalresetpassword: async (req, res) => {
    const { vpin } = req.body;
    const jwtvcode = req.cookies.vcode;

    if (jwtvcode) {
      const object = jwt.verify(jwtvcode, process.env.SECRET);
      if (vpin == object.vcode) {
        const parent = await parentModel.findOne({ email: object.email })
        const pwrd = getserialnum(1000000).toString()
        const hpwrd = await bcrypt.hash(pwrd,10)
        parent.pwrd= hpwrd
        await parent.save()

        res.clearCookie('vcode');
        const m1 = 'Hi ' + parent.username;
        const m2 = 'Your Reset password is ' + pwrd;
        const subject = 'Password Resset Successfull';
        mailgun.mail(object.email, subject, m1, m2);
        res.render('signuppage', {
          layout: 'nothing',
          title: 'Check your mail for reset password!',
          alerte: 'Your password has been reset ',
          icon: 'success',
        });
      }
      else {
        res.clearCookie('vcode')

        res.render('signuppage', {
          layout: 'nothing',
          title: 'Incorrect !',
          alerte: 'You have entered an incorrect code',
          icon: 'error',
        });
      }
    }
    else {
      res.render('signuppage', {
        layout: 'nothing',
        icon: 'error',
        alerte: 'Password recovery expired',
        title: 'Verification failed ! ',
      });
    }
  },
  emailupdate: async (req, res) => {
    const { vpin } = req.body;
    const jwtvcode = req.cookies.vcode;

    if (jwtvcode) {
      const object = jwt.verify(jwtvcode, process.env.SECRET);
      if (vpin == object.vcode) {
        req.user.email = object.email;
        res.clearCookie('vcode');
        await req.user.save();

        res.render('psettings', {
          layout: 'parent',
          parent: req.user,
          title: 'Updated !',
          alerte: 'Your email has been succesfully updated',
          icon: 'success',
        });
      } else {
        res.clearCookie('vcode');

        res.render('psettings', {
          layout: 'parent',
          parent: req.user,
          title: 'Incorrect !',
          alerte: 'You have entered an incorrect code',
          icon: 'error',
        });
      }
    } else {
      res.render('psettings', {
        layout: 'parent',
        parent: req.user,
        icon: 'error',
        alerte: 'Email verification expired',
        title: 'Verification failed ! ',
      });
    }
  },
  verifymailforgotpwrd: async (req, res) => {
    const { email } = req.body;
    const ifEmail = await parentModel.findOne({ email: email });
    if (ifEmail) {
      const vcode = getserialnum(100000);
      const object = {
        vcode: vcode,
        email: email,
      };
      const secret = process.env.SECRET;

      const jwtvcode = jwt.sign(object, secret, {
        expiresIn: 7200,
      });
      console.log(jwtvcode + ' is jwt vcode');
      res.cookie('vcode', jwtvcode, {
        maxAge: 7200000,
      });
      const m1 = 'Hi ' + ifEmail.username;
      const m2 = 'Your verification code is ' + vcode;
      const subject = 'Password Recovery';
      mailgun.mail(email, subject, m1, m2);
      res.render('getfgvcode', {
        layout: 'nothing',
        title: 'Check your mail !',
        alerte: 'A verification code has been sent to  ' + email,
        icon: 'success',
      });
    } else {
      res.render('signuppage', {
        layout: 'nothing',
        icon: 'error',
        alerte:
          'We do not have any user associated with the email you provided',
        title: 'No user record found',
      });
    }
  },
  editemail: async (req, res) => {
    const { email } = req.body;
    const ifEmail = await parentModel.findOne({ email: email });
    if (!ifEmail) {
      const vcode = getserialnum(100000);
      const object = {
        vcode: vcode,
        email: email,
      };
      const secret = process.env.SECRET;

      const jwtvcode = jwt.sign(object, secret, {
        expiresIn: 7200,
      });
      console.log(jwtvcode + ' is jwt vcode');
      res.cookie('vcode', jwtvcode, {
        maxAge: 7200000,
      });
      const m1 = 'Hi ' + req.user.username;
      const m2 = 'Your verification code is ' + vcode;
      const subject = 'Email verification';
      mailgun.mail(email, subject, m1, m2);
      res.render('emailupdate', {
        layout: 'nothing',
        parent: req.user,
        title: 'Check your mail !',
        alerte: 'A verification code has been sent to  ' + email,
        icon: 'success',
      });
    } else {
      res.render('psettings', {
        layout: 'parent',
        parent: req.user,
        icon: 'error',
        alerte: 'Email is in use ',
        title: 'Security Concern ',
      });
    }
  },
  editpassword: async (req, res) => {
    const { oldpwrd, newpwrd } = req.body;
    const savedpwrd = req.user.pwrd;

    if (newpwrd.length >= 6) {
      const ifpwrd = await bcrypt.compare(oldpwrd, savedpwrd);

      if (ifpwrd) {
        const hpwrd = await bcrypt.hash(newpwrd, 10);
        req.user.pwrd = hpwrd;
        await req.user.save();

        const m1 = 'Hi ' + req.user.username;
        const m2 = 'Your new password is ' + newpwrd;
        const subject = 'Password Updated Succesfully ';
        const email = req.user.email;
        mailgun.mail(email, subject, m1, m2);
        res.render('psettings', {
          layout: 'parent',
          parent: req.user,
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
      res.render('psettings', {
        layout: 'parent',
        parent: req.user,
        icon: 'error',
        title: 'Security threat !',
        alerte: 'New password length is too short !',
      });
    }
  },
  findstudent: async (req, res) => {
    const find = req.body.find;
    const student = await studentModel.findOne({ signparent: find });
    if (student) {
      req.suserid = student.userid;
      console.log(req.suserid + ' is child');

      // const boughts = await boughtModel.find({ parentuserid: req.user.userid });
      // if (boughts) {
      //   const realpictures = await pictureModel
      //     .find({ studentuserid: student.userid })
      //     .sort({ sn: 'desc' });
      //   const rl = realpictures.length;

      //   // const paids = paidpixs.filter((el)=>{

      //   // })
      //   const mypix = [];

      //   for (let i = 0; i < boughts.length; i++) {
      //     for (let j = 0; j < rl; j++) {
      //       if (realpictures[j].name == boughts[i].name) {
      //         mypix.push(realpictures[j]);
      //         return realpictures[j];
      //       }
      //     }
      //   }
      //   const stdntpictures = await wmModel
      //     .find({ studentuserid: student.userid })
      //     .sort({ sn: 'desc' });
      //   const packages = await Package.find();
      //   req.user.laststudentname=student.name
      //   req.user.laststudentid=student.userid
      //   await req.user.save()

      //   // console.log(packages);

      //   res.render('parentwithchild', {
      //     layout: 'parent',
      //     parent: req.user,
      //     child: student,
      //     wm: stdntpictures,
      //     packages: packages,
      //     // alert: 'Student with username  ' + username + ' doesnt exist',
      //   });
      // } else {
      //   const stdntpictures = await wmModel
      //     .find({ studentuserid: student.userid })
      //     .sort({ sn: 'desc' });
      //   req.wm = stdntpictures;

      //   res.render('parentwithchild', {
      //     parent: req.user,
      //     layout: 'parent',
      //     child: student,
      //     wm: stdntpictures,
      //     // alert: 'Student with username  ' + username + ' doesnt exist',
      //   });
      // }

      const stdntpictures = await pictureModel.find({
        studentuserid: student.userid,
      });

      req.wm = stdntpictures;
      const packages = await Package.find();

      if (stdntpictures.length > 0 && packages.length > 0) {
        res.render('parentwithchild', {
          parent: req.user,
          layout: 'parent',
          child: student,
          watermark: stdntpictures,
          packages: packages,
          studentuserid: student.userid,
          // alert: 'Student with username  ' + username + ' doesnt exist',
        });
      } else {
        const packages = await Package.find();
        console.log('stdnt pictures');

        const user = req.user;
        // cont orderss = await Booked.find({for:req.user.username})
        res.render('pdb', {
          layout: 'parent',
          parent: req.user,
          packages: packages,
          alerte: 'try again later',
          title: ' Pictures are unavailable at the moment',
          // order: orders,
        });
      }
      // if(packages.length > 0) {
      //   // console.log('parentwithchild entered ' + Package+ " consoled");

      // }
      // else{
      //   console.log("parentnopackage template")
      //   res.render('parentnopackage', {
      //     parent: req.user,
      //     layout: 'parent',
      //     child: student,
      //     wm: stdntpictures,
      //     title:"Valid code",
      //     icon:"success",
      //     alerte:"Oops packages are currently not available for this student,you can only view student gallery."

      //     // alert: 'Student with username  ' + username + ' doesnt exist',
      //   });
      // }
    } else {
      const packages = await Package.find();

      const user = req.user;
      // cont orderss = await Booked.find({for:req.user.username})
      res.render('pdb', {
        layout: 'parent',
        parent: req.user,
        packages: packages,
        icon: 'error',
        title: 'Incorrect findcode',
        alerte: 'Student with findcode ' + find + ' doesnt exist',
        // order: orders,
      });
    }
  },
  proceedtopayment: async (req, res) => {
    let { imgdir, packageid, quantity } = req.body;
    const { gross, vat, total } = req.body;
    const studentuserid = req.body.studentuserid;
    const student = await studentModel.findOne({ userid: studentuserid });

    let ordercodes = {};

    if (total > 0) {
      if (!Array.isArray(imgdir)) {
        imgdir = [imgdir];
      }
      if (!Array.isArray(packageid)) {
        packageid = [packageid];
      }
      if (!Array.isArray(quantity)) {
        quantity = [quantity];
      }
      const length = imgdir.length;

      console.log(length + ' is length');
      for (let i = 0; i < length; i++) {
        const package = await Package.findOne({ packageid: packageid[i] });
        const ordercode = getserialnum(100000);
        // ordercodes.[i]=ordercode

        const totalu = package.price * quantity[i];
        await OrdersModel.create({
          ordercode: ordercode,
          sn: ordercode,
          orderavatar: imgdir[i],
          packageid: packageid[i],
          quantity: quantity[i],
          packagename: package.name,
          priceperpackage: package.price,
          totalunitsprice: totalu,
          justdate: justDate(),
          dateordered: currentDate(),
          username: req.user.username,
          studentname: student.name,
          parentid: req.user.userid,
          studentid: studentuserid,
          paid: false,
          schoolcode: student.schoolcode,
        });
      }
      // console.log(ordercodes);
      // const secret = process.env.SECRET;

      // const gbadun = jwt.sign(ordercodes, secret, {
      //   expiresIn: 300000,
      // });
      // res.cookie('gbadunforlife', gbadun, {
      //   maxAge: 300000,
      // });

      const others = {
        gross: gross,
        vat: vat,
        total: total,
      };
      // order.push(others);

      // console.log(order + " is orders")

      // console.log(imgdir, packageid, quantity);

      console.log(studentuserid + ' this are images');
      res.render('payment', {
        layout: 'parent',
        parent: req.user,
        child: student,
        gross: gross,
        vat: vat,
        total: total,

        // alert: 'Student with username  ' + username + ' doesnt exist',
      });
    } else {
      const packages = await Package.find();

      const user = req.user;
      // cont orderss = await Booked.find({for:req.user.username})
      res.render('pdb', {
        layout: 'parent',
        parent: req.user,
        packages: packages,
        title: 'Empty Cart',
        alerte: 'You cannot proceed with an empty cart',
        // order: orders,
      });
    }
  },
  home: async (req, res) => {
    const packages = await Package.find();

    const user = req.user;
    // cont orderss = await Booked.find({for:req.user.username})
    res.render('pdb', {
      layout: 'parent',
      parent: req.user,
      packages: packages,
      // order: orders,
    });
  },
  updateshipping: async (req, res) => {
    const {
      fname,
      semail,
      lname,
      sphone,
      state,
      city,
      addressline1,
      addressline2,
    } = req.body;

    req.user.fname = fname;
    req.user.lname = lname;
    req.user.sphone = sphone;
    req.user.state = state;
    req.user.semail = semail;
    req.user.city = city;
    req.user.addressline1 = addressline1;
    addressline2.length > 1
      ? (req.user.addressline2 = addressline2)
      : (req.user.addressline2 = '');
    await req.user.save();

    // const user = req.user;
    // cont orderss = await Booked.find({for:req.user.username})
    res.render('shippingdetails', {
      layout: 'parent',
      parent: req.user,
      // order: orders,
    });
  },
  shippingdetails: async (req, res) => {
    const user = req.user;
    // cont orderss = await Booked.find({for:req.user.username})
    res.render('shippingdetails', {
      layout: 'parent',
      parent: req.user,
      // order: orders,
    });
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
