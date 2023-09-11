const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const { PrismaClient } = require('@prisma/client');
 
router.get('/verify-email/provider', async (req, res) => {
  let { token, email } = req.query;
  let prisma = new PrismaClient();
  console.log(email, token)
  let provider = await prisma.provider.findUnique({ where: { email }});

  if(!provider) 
    return res.redirect("/login/?error=" + encodeURIComponent("something went wrong. Please try again."));

  if(provider.emailToken != token) {
    await prisma.provider.update({ where: { id: provider.id }, data: { emailToken: token }});
    return res.redirect("/login/?error=" + encodeURIComponent("invalid Token Please try again."));
  }

  if(provider.verifiedEmail) 
    return res.redirect("/login/?success=" + encodeURIComponent("Your email already verified! Please login to continue."));

  try {
    let update = await prisma.provider.update({
      where: { id: provider.id },
      data: { emailToken: uuid.v4(), verifiedEmail: true }
    });
    prisma.$disconnect();
    return res.redirect("/login/?success=" + encodeURIComponent("Your email has been verified! Please login to continue."));
  } 
  catch(err) {
    return res.redirect("/login/?error=" + encodeURIComponent("Internal Server Error."));
  }
});

router.get('/verify-email/user', async (req, res) => {
  let { token, email } = req.query;
  let prisma = new PrismaClient();
  console.log(email, token)
  let user = await prisma.user.findUnique({ where: { email }});

  if(!user) 
    return res.redirect("/login/?error=" + encodeURIComponent("something went wrong. Please try again."));

  if(user.emailToken != token) {
    await prisma.user.update({ where: { id: user.id }, data: { emailToken: token }});
    return res.redirect("/login/?error=" + encodeURIComponent("invalid Token Please try again."));
  }

  if(user.verifiedEmail) 
    return res.redirect("/login/?success=" + encodeURIComponent("Your email already verified! Please login to continue."));

  try {
    let update = await prisma.user.update({
      where: { id: user.id },
      data: { emailToken: uuid.v4(), verifiedEmail: true }
    });
    prisma.$disconnect();
    return res.redirect("/login/?success=" + encodeURIComponent("Your email has been verified! Please login to continue."));
  } 
  catch(err) {
    return res.redirect("/login/?error=" + encodeURIComponent("Internal Server Error."));
  }
});
module.exports = router;