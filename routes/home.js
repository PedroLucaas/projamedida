const { isAuth } = require('../libs/middleware/isAuth');
const { is } = require('../libs/middleware/role');
const { PrismaClient } = require('@prisma/client');

const express = require('express');
const router = express.Router();
 
router.get('/admin', isAuth, is(['ADMIN']), (req, res) => {
  var { error, success } = req.query;
  error = error ? decodeURIComponent(error) : null;
  success = success ? decodeURIComponent(success) : null;
  let admin = true;
  res.render('dashboard', { success, error, admin });
});

router.get('/collab', isAuth, (req, res) => {
  var { error, success } = req.query;
  error = error ? decodeURIComponent(error) : null;
  success = success ? decodeURIComponent(success) : null;
  let admin = false;
  res.render('dashboard', { success, error, admin });
});

router.get('/home', isAuth, async (req, res) => {
  const { id } = req.cookies;
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({ where: { id }});
  prisma.$disconnect();
  res.redirect(`/${user.role.toLowerCase()}`);
});

router.get('/', isAuth, async (req, res) => {
  const { id } = req.cookies; 
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({ where: { id }});
  prisma.$disconnect();
  res.redirect(`/${user.role.toLowerCase()}`);
});

module.exports = router;