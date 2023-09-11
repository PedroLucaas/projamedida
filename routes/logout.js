const express = require('express');
const { isAuth } = require('../libs/middleware/isAuth');
const router = express.Router();

router.get('/logout', isAuth, (res) => res.clearCookie("token").redirect('/login'));

module.exports = router;