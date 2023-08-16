const { isValidEmail, isValidPassword } = require('../libs/verify/Credentials')
const { PrismaClient } = require('@prisma/client');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

const express = require('express');
const { isNotAuthenticated } = require('../libs/middleware/isNotAuthenticated');
const router = express.Router();
 
router.post("/register", async (req, res) => {
  console.log(req.body);
  let {company, email, password} = req.body;
  
  if(email && password && company) {
    if(!isValidEmail(email)) 
    return res.status(400).redirect("/register/Invalid email!");
  
  if(!isValidPassword(password))
  return res.status(400).redirect("/register/Invalid password!");

let prisma = new PrismaClient();

let haveThisEmail = await prisma.user.findUnique({ where: { email }});
if(haveThisEmail)
return res.status(400).redirect("/register/User already exists!");

haveThisCompany = await prisma.user.findUnique({ where: { company }});
if(haveThisCompany)  
return res.status(400).redirect("/register/User already exists!");

try {
  let bypass = await bcrypt.hash(password, 10);
  let user = await prisma.user.create({
    data: {
      email,
      password: bypass,
      company
    }
  });
  prisma.$disconnect();
}
catch(err) {
  console.log(err);
  return res.status(500).redirect("/register/Internal server error!");
}
finally {  
  return res.status(200).send({message: 'User created!'});
}
}
else 
return res.status(400).redirect("/register/Invalid credentials!");
});

router.get('/register', isNotAuthenticated, (req, res) => {
  const { message } = req.query;
  return res.render('register', { message });
});


module.exports = router;