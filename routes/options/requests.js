
const express = require('express');
const { isAuth } = require('../../libs/middleware/isAuth');
const router = express.Router();

router.get('/actions/pedidos',  isAuth, (req, res) => {
  var { error, success } = req.query;
  error = error ? decodeURIComponent(error) : null;
  success = success ? decodeURIComponent(success) : null;
  return res.render('pedidos', { error, success });
});


module.exports = router;