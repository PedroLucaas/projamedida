const { isValidEmail, isValidPassword } = require('../libs/verify/Credentials')
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const express = require('express');
const router = express.Router();
 
router.post(async (req, res) => {
  let {email, password} = req.body;

  if(email && password) {
    if(!isValidEmail(email)) 
    return res.status(400).redirect("login/Invalid email!");
  
  if(!isValidPassword(password))
    return res.status(400).redirect("login/Invalid password!");

  let prisma = new PrismaClient();
  let user = await prisma.user.findUnique({ where: { email }});
  prisma.disconnect();
  
  if(user) {
    let valid = await bcrypt.compare(password, user.password);
    if(valid) {
      let token = jwt.sign({
        id: user.id,
        email: user.email,
        company: user.company,
        role: user.role,
      }, process.env.JWT_SECRET, { expiresIn: '1h' });

      console.log('successfully logged in')
      res.cookie('token', token, {
        maxAge: 3600000,
      })
      return res.redirect("/home");
    }
    else
    return res.status(400).redirect("login/Invalid credentials!");
  }
  else 
  return res.status(400).redirect("login/Invalid credentials!");

  }
  else 
  return res.status(400).redirect("login/Invalid credentials!");
});

router.get('/login', (req, res) => {
  const { message } = req.query;
  res.render('login', { message });
});

router.get('/login/:message', (req, res) => {
  const { message } = req.params;
  res.render('login', { message });
});

module.exports = router;