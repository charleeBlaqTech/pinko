const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const emailTemplateSource = fs.readFileSync(
  path.join(__dirname, '/template.hbs'),
  'utf8'
);

const mailgunAuth = {
  auth: {
    api_key: 'key-196e380821e7163440428a567df52e34',
    domain: 'sandbox69f25b47a27041cdad3c9304f05fbb6f.mailgun.org',
  },
};

const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));

const template = handlebars.compile(emailTemplateSource);

const htmlToSend = template({ message: 'Hello!' });
// const htmlToSend = 'Hello!';

const mailgun = {
  mail: (email,subject,m1,m2) => {
    const mailOptions = {
      from: {
        name: 'PPSE',
        address: 'codarhq@gmail.com',
      },
      to: email,
      subject: subject,
      html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>PPSE</title>
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

                

                <h1>PPSE </h1>
                <h3>${subject} </h3>


                <div>
                    <span style='text-transform:capitalize;'>${m1} </span>
                    <p>${m2} </p>
                </div>


                
                
            </body>
            </html>

      `,
      // text:"hi dear"
    };

    const mailgun = smtpTransport.sendMail(
      mailOptions,
      function (error, response) {
        if (error) {
          console.log(error);
        } else {
          console.log('Successfully sent email.');
        }
      }
    );
  },
};
const mailgunh = {
  mail: (html, email, subject) => {
    const mailOptions = {
      from: {
        name: 'PPSE',
        address: 'codarhq@gmail.com',
      },
      to: email,
      subject: subject,
      html: html,
      // text:"hi dear"
    };

    const mailgun = smtpTransport.sendMail(
      mailOptions,
      function (error, response) {
        if (error) {
          console.log(error);
        } else {
          console.log('Successfully sent email.');
        }
      }
    );
  },
};



function remove_score(x) {
  const b = x.split('_').join(' ');
  return b;
}

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CODARUSER,
    pass: process.env.CODARPASS,
  },
});
const randomn = require('crypto').randomBytes(5).toString('hex');


const nodem = {
  mail:(email, subject,m1,m2) => {
    const htmlb = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>PPSE ${subject}</title>
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

                

                <h1>PPSE ${subject}</h1>

                <div>
                    <span>${m1}</span>
                    <span>${m2}</span>
                </div>


                
                
            </body>
            </html>

      `;
    var mailOptions = {
      from: {
        name: 'PPSE',
        address: 'codarhq@gmail.com',
      },
      to: email,
      subject: subject,
      // text: `Hi ${username} , verify account below ${testran}`,
      html: htmlb,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
}
const nodemh = {
  mail:(html, email, subject) => {
    var mailOptions = {
      from: {
        name: 'PPSE',
        address: 'codarhq@gmail.com',
      },
      to: email,
      subject: subject,
      // text: `Hi ${username} , verify account below ${testran}`,
      html: html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
};
const verificationmail = {
  mail: (username, email, testran) => {
    var mailOptions = {
      from: {
        name: 'PPSE',
        address: 'codarhq@gmail.com',
      },
      to: email,
      subject: 'Account verification',
      // text: `Hi ${username} , verify account below ${testran}`,
      html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>PPSE Account verification</title>
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

                

                <h1>PPSE verification page</h1>

                <div>
                    <span>Hi ${username} </span>
                    <span>Your verification pin is ${testran}</span>
                </div>


                
                
            </body>
            </html>

      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
};
const addadmin = {
  mail: (email, testran) => {
    var mailOptions = {
      from: {
        name: 'PPSE',
        address: 'codarhq@gmail.com',
      },
      to: email,
      subject: 'Admin verification',
      // text: `Hi ${username} , verify account below ${testran}`,
      html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>PPSE Admin verification</title>
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

                

                <h1>PPSE verification page</h1>


                <div>
                    <span>Hi Guest admin </span>
                    <a href=${testran}>Click to verify </a>
                </div>


                
                
            </body>
            </html>

      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
};

module.exports = { verificationmail, addadmin, mailgun ,mailgunh,nodemh,nodem};
