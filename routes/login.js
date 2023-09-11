const { isValidEmail, isValidPassword } = require('../libs/verify/Credentials')
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const express = require('express');
const { isNotAuth } = require('../libs/middleware/isNotAuth');
const router = express.Router();
 
router.post("/login", isNotAuth, async (req, res) => {
  let {email, password} = req.body;

  if(email && password) {
    if(!isValidEmail(email)) 
    return res.redirect("login/?error=" + encodeURIComponent("Invalid Email!"));
  
    if(!isValidPassword(password))
      return res.redirect("login/?error=" + encodeURIComponent("Invalid Password!"));

    let prisma = new PrismaClient();
    let user = await prisma.user.findUnique({ where: { email }});
    await prisma.$disconnect();
    
    if(user) {
      let valid = await bcrypt.compare(password, user.password);
      console.log(valid);
        if(valid) {
          let token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

          res.cookie('token', token, {
            maxAge: 3600000,
          })

          res.cookie('id', user.id, {
            maxAge: 3600000,
          })

          return res.redirect("/" + user.role.toLowerCase());
        }
        else
          return res.redirect(`login/?error=` + encodeURIComponent('Invalid Credentials!'));
      }
      else
        return res.redirect(`login/?error=` + encodeURIComponent('User Not Found!'));
    }
    else
      return res.redirect(`login/?error=` + encodeURIComponent('Invalid Password!'));
  });

router.get('/login', isNotAuth, (req, res) => {
  var { error, success } = req.query;
  error = error ? decodeURIComponent(error) : null;
  success = success ? decodeURIComponent(success) : null;
  res.render('login', { error, success });
});


module.exports = router;