const { isValidEmail, isValidPhone } = require('../libs/verify/Credentials')
const { PrismaClient } = require('@prisma/client');
const { isNotAuth } = require('../libs/middleware/isNotAuth');
const bcrypt = require('bcryptjs');

const express = require('express');
const router = express.Router();
 
router.post("/register", isNotAuth, async (req, res) => {
  let {company, email, phone} = req.body;
  phone.replaceAll(" ", "");
  console.log(req.body);
  if(company && email && phone) {
    if(!isValidEmail(email)) 
    return res.redirect("register/?error=" + decodeURIComponent('Invalid email!'));
  
    // if(!isValidPhone(phone))
    //   return res.redirect("register/?error=" + decodeURIComponent('Invalid phone!'));
    let prisma = new PrismaClient();

    let haveThisEmail = await prisma.provider.findUnique({ where: { email }});

    if(haveThisEmail)
      return res.redirect("register/?error=" + decodeURIComponent('Email Already registered!'));

    let provider;
    let haveThisCompany = await prisma.provider.findUnique({ where: { company }});
    await prisma.$disconnect();

    if(haveThisCompany)  
      return res.redirect("register/?error=" + decodeURIComponent('Company Already registered!'));

    try { 
      provider = await prisma.provider.create({
        data: {
          company,
          email,
          phone,
        }
      });
      await prisma.$disconnect();
      return res.redirect('/send-email-verification/provider/?email=' + provider.email);
    }
    catch(err) {
      return res.redirect("register/?error=" + decodeURIComponent('Error when Registering!'));
    }
  }
  else 
    return res.redirect("register/?error=" + decodeURIComponent('Invalid Credentials!'));
});

router.get('/register', isNotAuth, (req, res) => {
  var { error, success } = req.query;
  error = error ? decodeURIComponent(error) : null;
  success = success ? decodeURIComponent(success) : null;
  return res.render('register', { error, success });
});

  
module.exports = router;