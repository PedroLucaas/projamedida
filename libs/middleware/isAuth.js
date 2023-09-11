exports.isAuth = (req, res, next) => {
  const isAuth = req.cookies.token ? true : false;

  if(isAuth) 
    return next();
  else  
    return res.clearCookie('token').redirect("/login"); 
};