const { isValidEmail } = require('../libs/verify/Credentials')
const { PrismaClient } = require('@prisma/client');
const uuid = require('uuid');
const nodemailer = require('nodemailer');

const express = require('express');
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

 
router.post('/forgot-password', async (req, res) => {
  let { email } = req.body;

  if(email) {
    if(!isValidEmail(email))
      return res.status(400).send({message: 'Invalid email!'});

    let prisma = new PrismaClient();
    let user = await prisma.user.findUnique({ where: { email }});

    if(!user)
      return res.send(400).send({message: 'User not found!'});
    
    let token = await prisma.resetPasswordToken.findUnique({ where: { userId: user.id }});

    if(token)
      return res.status(400).send({message: 'Token already exists!'});

    try {
      let token = await prisma.resetPasswordToken.create({ data: {
        token: uuid.v4(),
        userId: user.id,
      }});

      let info = await transporter.sendMail({
        from: '"No Reply" <noreply@projamedida.pt>', // sender address
        to: user.email, // list of receivers
        subject: "Reset Password", // Subject line
        text: "You can reset your pwd by clicking in the link below this text.", // plain text body
        html: `<a>http://localhost:3000/reset-password/?token=${token.token}</a>`, // html body
      });
      return res.status(200).send({message: 'Verify your E-mail!'});
    }
    catch (e) {
      return res.status(500).send({message: 'Internal server error!'});
    }
  }
});

router.get('/forgot-password',  (req, res) => {
  const { message } = req.query;
  return res.render('forgot-password', { message });
});

router.get('/forgot-password/:message', (req, res) => {
  const { message } = req.params;
  return res.render('forgot-password', { message });
});



module.exports = router;