const { isValidEmail } = require('../libs/verify/Credentials')
const { PrismaClient } = require('@prisma/client');
const uuid = require('uuid');
const nodemailer = require('nodemailer');

const express = require('express');
const { isNotAuth } = require('../libs/middleware/isNotAuth');
const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "projamedida.pt",
  port: 465,
  secure: true,
  auth: {
    user: 'noreply@projamedida.pt',
    pass: process.env.NOREPLY_EMAIL_PASSWORD
  }
});

 
router.post('/forgot-password', isNotAuth, async (req, res) => {
  let { email } = req.body;

  if(email) {
    if(!isValidEmail(email))
      return res.redirect('/forgot-password/?error=' + encodeURIComponent('Invalid Email!'));
    
    let prisma = new PrismaClient();
    let user = await prisma.user.findUnique({ where: { email }});
    await prisma.$disconnect();
    if(!user)
      return res.redirect('forgot-password' + encodeURIComponent('User not found!'));

    await prisma.$connect();
    let token = await prisma.resetPasswordToken.findUnique({ where: { userId: user.id }});
    await prisma.$disconnect();


    if(token)
      return res.status(400).send({message: 'Token already exists!'});

    try {
      let token = await prisma.resetPasswordToken.create({ data: {
        token: uuid.v4(),
        userId: user.id,
      }});

      let info = await transporter.sendMail({
        from: '"No Reply" <noreply@projamedida.pt>',
        to: user.email, // list of receivers
        subject: "Reset Password", // Subject line
        text: "You can reset your pwd by clicking in the link below this text.", // plain text body
        html: `<a>http://localhost:3000/reset-password/?token=${token.token}</a>`, // html body
      });

      return res.redirect('/forgot-password/?success=' + encodeURIComponent('Success, Please Verify your E-mail!'));
    }
    catch (e) {
      return res.redirect('/forgot-password/error=' + encodeURIComponent('Error: Internal server error!'));
    }
  }
});

router.get('/forgot-password', isNotAuth, (req, res) => {
  var { error, success } = req.query;
  error = error ? decodeURIComponent(error) : null;
  success = success ? decodeURIComponent(success) : null;
  return res.render('forgot-password', { error, success });
});



module.exports = router;