const { isAuthenticated } = require('../libs/middleware/isAuthenticated');

const express = require('express');
const router = express.Router();
 
router.get('/', isAuthenticated, (req, res) => {
  const { message } = req.query;
  res.render('home', { message });
});


module.exports = router;