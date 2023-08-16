const express = require('express');
const { isAuthenticated } = require('../libs/middleware/isAuthenticated');
const router = express.Router();

router.get('/logout', isAuthenticated, async (req, res) => res.clearCookie("token").redirect('/login'));

module.exports = router;