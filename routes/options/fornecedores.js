
const express = require('express');
const { isAuth } = require('../../libs/middleware/isAuth');
const { is } = require('../../libs/middleware/role');
const router = express.Router();

router.get('/actions/collab/fornecedores',  isAuth, (req, res) => {
  var { error, success } = req.query;
  error = error ? decodeURIComponent(error) : null;
  success = success ? decodeURIComponent(success) : null;
  return res.render('collab/fornecedores', { error, success });
});

router.get('/actions/admin/fornecedores',  isAuth, is(['ADMIN']), (req, res) => {
  var { error, success } = req.query;
  error = error ? decodeURIComponent(error) : null;
  success = success ? decodeURIComponent(success) : null;
  
  return res.render('admin/fornecedores', { error, success });
});

module.exports = router;