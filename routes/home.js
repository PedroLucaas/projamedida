const { isValidEmail, isValidPassword } = require('../libs/verify/Credentials')
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../libs/middleware/ensuredAuthenticated');

const express = require('express');
const router = express.Router();
 
router.get('/home', isAuthenticated,  (req, res) => {
  const { message } = req.query;
  res.render('home', { message });
});

router.get('/home/:message', (req, res) => {
  const { message } = req.params;
  res.render('home', { message });
});

module.exports = router;