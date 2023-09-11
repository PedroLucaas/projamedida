const { isValidEmail, isValidPassword } = require('../libs/verify/Credentials')
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const express = require('express');
const { isNotAuth } = require('../libs/middleware/isNotAuth');
const router = express.Router();
 
router.post('/reset-password/', isNotAuth, async (req, res) => {
  let { email, password, token } = req.body;
 
  console.log(req.body);
  
  if(email && password) {
    if(!isValidEmail(email))
      return res.redirect("reset-password/?error=" + encodeURIComponent('Invalid Email!'));

    if(!isValidPassword(password))
      return res.redirect("reset-password/?error=" + encodeURIComponent('Invalid Password!'));

    let prisma = new PrismaClient();
    let user = await prisma.user.findUnique({ where: { email }});
    await prisma.$disconnect();

    if(!user)
      return res.redirect("reset-password/?error=" + encodeURIComponent('User Not Found!'));

    let verifyToken = await prisma.resetPasswordToken.findUnique({ where: { token }});

    if(!verifyToken)
      return res.redirect("reset-password/?error=" + encodeURIComponent('Invalid Token!'));

    let bypass;
    
    try {
      bypass = await bcrypt.hash(password, 10);
    }
    catch (e) {
      return res.redirect("reset-password/?error=" + encodeURIComponent('Invalid Password!'));
    }
    
    try {
      await prisma.user.update({ where: { email }, data: { password: bypass } });
      await prisma.resetPasswordToken.delete({ where: { userId: user.id } });
      await prisma.$disconnect();
      return res.redirect("login/?success=" + encodeURIComponent('User Updated'));
    }
    catch (e) {
      return res.redirect("reset-password" + encodeURIComponent('Invalid Password!'));
    }
  }
});


router.get('/reset-password/', isNotAuth, async (req, res) => {
  var { token, success, error  } = req.query;
  error = error ? decodeURIComponent(error) : null;
  success = success ? decodeURIComponent(success) : null;

  let prisma = new PrismaClient();

  const testToken = await prisma.resetPasswordToken.findUnique({ where: { token } })
  prisma.$disconnect();
  if(!testToken)
    return res.send({message: 'Invalid token!'});

  if(token != testToken.token)
    res.send({message: 'Invalid token!'});

  return res.render('reset-password', { success, error });
});

module.exports = router;