const { isValidEmail, isValidPassword } = require('../libs/verify/Credentials')
const { PrismaClient } = require('@prisma/client');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

const express = require('express');
const router = express.Router();
 
router.post('/reset-password/', async (req, res) => {
  let { email, password, token } = req.body;
 
  console.log(req.body);
  
  if(email && password) {
    if(!isValidEmail(email))
      return res.status(400).send({message: 'Invalid email!'});

    if(!isValidPassword(password))
      return res.status(400).send({message: 'Invalid password!'});

    let prisma = new PrismaClient();
    let user = await prisma.user.findUnique({ where: { email }});

    if(!user)
      return res.status(400).send({message: 'User not found!'});

    let verifyToken = await prisma.resetPasswordToken.findUnique({ where: { token }});

    if(!verifyToken)
      return res.status(400).send({message: 'Invalid token!'});

    let bypass;
    try {
      bypass = await bcrypt.hash(password, 10);
    }
    catch (e) {
      return res.status(500).send({message: 'error new crypto pass!'});
    }
    
    try {
      await prisma.user.update({ where: { email }, data: { password: bypass } });
      await prisma.resetPasswordToken.delete({ where: { userId: user.id } });
      return res.status(200).send({message: 'Password changed!'});
    }
    catch (e) {
      return res.status(500).send({message: 'error reset password!'});
    }
  }
});


router.get('/reset-password/',  async (req, res) => {
  const { message, token  } = req.query;

  let prisma = new PrismaClient();

  const testToken = await prisma.resetPasswordToken.findUnique({ where: { token } })
  if(!testToken)
    return res.status(400).send({message: 'Invalid token!'});

  if(token != testToken.token)
    res.status(403).send({message: 'Invalid token!'});

  return res.render('reset-password', { message });
});

router.get('/reset-password/:message', (req, res) => {
  const { message } = req.params;
  return res.render('reset-password', { message });
});



module.exports = router;