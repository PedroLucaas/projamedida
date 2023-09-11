const express = require('express');
const router = express.Router();
const { is } = require('../libs/middleware/role')
const { isValidEmail } = require('../libs/verify/Credentials')
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "projamedida.pt",
  port: 465,
  secure: true,
  auth: {
    user: 'noreply@projamedida.pt',
    pass: process.env.NOREPLY_EMAIL_PASSWORD
  }
});

router.get('/send-email-verification/provider', async (req, res) => {
  let { email } = req.query;
  if(!isValidEmail(email))
    return res.redirect('login/?error=' + encodeURIComponent("Error: Invalid email"));

  let prisma = new PrismaClient();
  let provider = await prisma.provider.findUnique({ where: { email }});

  if(!provider)
    return res.redirect('login/?error=' + encodeURIComponent("Error: No such provider"));
  
  try {
    let info = await transporter.sendMail({
      from: '"No Reply" <noreply@projamedida.pt>', // sender address
      to: provider.email, // list of receivers
      subject: "Verify Your Email", // Subject line
      text: "You can Verify your email by clicking in the link below this text.", // plain text body
      html: `<a>http://${process.env.URL}/verify-email/provider/?token=${provider.emailToken}&email=${provider.email}</a>`,   
    });
  } 
  catch(err) {
    return res.clearCookie('token').redirect("/error/500");
  }
  finally {
    return res.clearCookie('token').redirect('/login/?success=' + encodeURIComponent('Success: Verify Your Email!'));
  }
});

router.get('/send-email-verification/user', async (req, res) => {
  let { email } = req.query;
  if(!isValidEmail(email))
    return res.redirect('login/?error=' + encodeURIComponent("Error: Invalid email"));

  let prisma = new PrismaClient();
  let user = await prisma.user.findUnique({ where: { email }});

  if(!user)
    return res.redirect('login/?error=' + encodeURIComponent("Error: No such user"));
  
  try {
    let info = await transporter.sendMail({
      from: '"No Reply" <noreply@projamedida.pt>', // sender address
      to: user.email, // list of receivers
      subject: "Verify Your Email", // Subject line
      text: "You can Verify your email by clicking in the link below this text.", // plain text body
      html: `<a>http://${process.env.URL}/verify-email/user/?token=${user.emailToken}&email=${user.email}</a>`,   
    });
  } 
  catch(err) {
    return res.clearCookie('token').redirect("/error/500");
  }
  finally {
    return res.clearCookie('token').redirect('/login/?success=' + encodeURIComponent('Success: Verify Your Email!'));
  }
});
module.exports = router;