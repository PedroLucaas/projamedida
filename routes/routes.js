const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client')
const uuid = require('uuid');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const router = express.Router()


router.post('/reset-password/', async (req, res) => {
  let { token, email, password } = req.body;
  let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

  if(token && email && password) {
    if(!emailRegex.test(email))
      return res.status(400).send({message: 'Invalid email!'});

    if(!passwordRegex.test(password))
      return res.status(400).send({message: 'Invalid password!'});

    let prisma = new PrismaClient();
    let user = await prisma.user.findUnique({ where: { email }});

    if(!user)
      return res.sendStatus(400).send({message: 'User not found!'});

    let testToken = await prisma.token.findUnique({ where: { token: token }});

    if(!testToken)
      return res.status(400).send({message: 'Invalid token!'});

    if(testToken.type !== 'RESETPASSWORD') 
      return res.status(400).send({message: 'Invalid token!'});

    try {
      let bypass = await bcrypt.hash(password, 10);
      await prisma.user.update({ where: { email }, data: { password: bypass } });
      await prisma.token.delete({ where: { token: token } });
      return res.sendStatus(200).send({message: 'Password changed!'});
    }
    catch (e) {
      return res.status(500).send({message: 'Internal server error!'});
    }
  }
});

router.get('/logout', async (req, res) => {
  let { token } = req.body;
  let prisma = new PrismaClient();

  if(!token)
    return res.status(400).send({message: 'please provide a valid token!'});
  
  let result = await prisma.token.findUnique({ where: { token }});
  if(result) {
    try {
      await prisma.token.delete({ where: { token: token } });
    }
    catch(err) {
      return res.status(500).send({message: 'Internal server error!'});
    }
    finally {
      return res.status(200).send({message: 'User logged out!'});
    }
  }
  else
  return res.status(400).send({message: 'Invalid token!'});
});

router.post('/send-email-verification', async (req, res) => {
  let { email } = req.body;
  let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if(email) {
    if(!emailRegex.test(email))
    return res.status(400).send({message: 'Invalid email!'});
  
  let prisma = new PrismaClient();
  let user = await prisma.user.findUnique({ where: { email }});
  
  if(!user)
  return res.status(400).send({message: 'User not found!'});

try {
  let info = await transporter.sendMail({
    from: '"No Reply" <noreply@projamedida.pt>', // sender address
    to: user.email, // list of receivers
    subject: "Verify Your Email", // Subject line
    text: "You can Verify your email by clicking in the link below this text.", // plain text body
    html: `<a>${process.env.URL}/?token=${user.emailToken}?email=${user.email}</a>`, // html body
  });
}
catch(err) {
  return res.status(500).send({message: 'Internal server error!'});
}
finally {
  return res.status(200).send({message: 'Email sent!'});
}
}
});

router.post('/verify-email', async (req, res) => {
  let { token, email } = req.body;
  let user;
  let prisma = new PrismaClient();
  try {
    user = await prisma.user.findUnique({ where: { email: email }});
  } catch (e) {
    return res.status(500).send({message: 'Cannot find user!'});
  }

  if(!user)
    return res.status(400).send({message: 'User not found!'});
  
  if(user.emailToken != token)
    return res.status(400).send({message: 'Invalid token!'});

  if(user.verifiedEmail) 
    return res.status(400).send({message: 'Email already verified!'});

  try {
    let update = await prisma.user.update({
      where: { id: user.id },
      data: { verifiedEmail: true }
    });
    return res.status(200).send({message: 'Email successfully verified!'});
  } 
  catch(err) {
    return res.status(500).send({message: 'Cannot update user!'});
  }
});

router.post('/new-admin', (req, res) => {
  let { email, password, token } = req.body;
  let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

  if(email && password && token) {
    let prisma = new PrismaClient();
    let testToken = prisma.token.findUnique({ where: { token: token }});
    if(!testToken)
      return res.status(400).send({message: 'Invalid token!'});

    if(testToken.type!== 'ADMIN') 
      return res.status(400).send({message: 'Invalid token!'});

    if(!emailRegex.test(email))
      return res.status(400).send({message: 'Invalid email!'});

    if(!passwordRegex.test(password))
      return res.status(400).send({message: 'Invalid password!'});

    let admin = prisma.user.findUnique({ where: { email }});

    if(admin)
      return res.status(400).send({message: 'User already exists!'});

    try {
      let bypass = bcrypt.hash(password, 10);
      let user = prisma.user.create({
        data: {
          email,
          password: bypass,
          role: 'ADMIN',
          validEmail: true,
        }
      });
      return res.status(200).send({message: 'Admin created!'});
    }
    catch(err) {
      return res.status(500).send({message: 'Internal server error!'});
    }
  }
});



module.exports = router;