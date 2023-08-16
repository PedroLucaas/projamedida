exports.isNotAuthenticated = (req, res, next) => {
  const isAuth = req.cookies.token ? true : false;

  if(isAuth) 
    res.status(401).redirect("/"); 
  else 
    next();

  
  
};