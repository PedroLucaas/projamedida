const jwt = require("jsonwebtoken");

export const ensuredAuthenticated = () => {
  return async (request, response, next) => {
    const { token } = request.cookies;

    if (!token) {
      return response.status(401).json({ error: "Token is missing" });
    }

    try {
      const user = jwt.verify(token, process.env.SECRET_JWT);
      request.user = user;

      return next();
    } catch (err) {
      return response.status(401).clearCookie('token').redirect('/login');
    }
  };
};