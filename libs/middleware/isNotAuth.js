exports.isNotAuth = (req, res, next) => {
  const isAuth = req.cookies.token ? true : false;

  if(!isAuth) 
    return next();
  else 
    return res.redirect("/"); 

};