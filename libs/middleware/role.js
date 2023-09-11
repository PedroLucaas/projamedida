const jwt = require('jsonwebtoken');

exports.is = (rolesRoutes) => {
  return async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) 
      return res.clearCookie("token").redirect('/login');

    const user = jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) 
        return res.clearCookie("token").redirect('/login/?error=' + encodeURIComponent('something went wrong! Please try again!'));
      
      verifiedEmail = decoded.verifiedEmail;
      email = decoded.email;
      role = decoded.role;
      if(role != 'ADMIN' && role != 'COLLAB')
        res.clearCookie("token").redirect('/login/?' + encodeURIComponent('something went wrong! Please try again!'));
    });

    req.user = user;

    const roleExists = rolesRoutes.includes(role);

    if (!roleExists) {
      if(!verifiedEmail)
        return res.redirect(`/send-email-verification/?email=${email}`);
      else 
        return res.redirect('/unauthorized');
    }

    return next();
  };
}

