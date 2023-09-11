const { isValidEmail, isValidPassword } = require('../libs/verify/Credentials')
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const express = require('express');
const { is } = require('../libs/middleware/role');
const router = express.Router();
 
router.post("/new-admin", is(["ADMIN"]), async (req, res) => {
  let {email, password} = req.body;
  
  if(email && password) {
    if(!isValidEmail(email)) 
      return res.redirect("new-admin/?error=" + encodeURIComponent('Invalid Email!'));
    
  
    if(!isValidPassword(password))
      return res.redirect("new-admin/?error=" + encodeURIComponent('Invalid password!'));
    

    let prisma = new PrismaClient();

    let haveThisEmail = await prisma.user.findUnique({ where: { email }});
    if(haveThisEmail)
      return res.redirect("new-admin/?error=" + encodeURIComponent('User Already Registered!'));

    try {
      let bypass = await bcrypt.hash(password, 10);
      let user = await prisma.user.create({
        data: {
          email,
          password: bypass,
          role: "ADMIN",
          verifiedEmail: true
        }
      });
      await prisma.$disconnect();
    }
    catch(err) {
      return res.redirect("new-admin/?error=" + encodeURIComponent('Internal Server Error!'));
    }
    finally {  
      return res.redirect("new-admin/?success=" + encodeURIComponent('Successfully Registered New Admin!'));
    }
  }
else
  return res.redirect("new-admin/?error=" + encodeURIComponent('Invalid Credentials! Please try again.'));
});

router.get("/new-admin", is('ADMIN'), (req, res) => {
  var { error, success } = req.query;
  error = error ? decodeURIComponent(error) : null;
  success = success ? decodeURIComponent(success) : null;
  return res.render('admin/new-admin', { error, success})
});


module.exports = router;