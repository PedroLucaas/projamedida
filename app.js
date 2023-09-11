const path = require('path');
const cookieParser = require('cookie-parser');

const express = require('express');
const app = express();

app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

const routes = {
  providers: require('./routes/options/fornecedores'),
  requests: require('./routes/options/requests'),
  newAdmin: require('./routes/new-admin'),
  sendEmailVerification: require('./routes/send-email-verification'),
  verifyEmail: require('./routes/verify-email'),
  resetPassword: require('./routes/reset-password'),
  forgotPassword: require('./routes/forgot-password'),
  logout: require('./routes/logout'),
  login: require('./routes/login'),
  register: require('./routes/register'),
  home: require('./routes/home'),
}


app.use(routes.providers);
app.use(routes.requests)
app.use(routes.newAdmin);
app.use(routes.resetPassword);
app.use(routes.forgotPassword);

app.use(routes.verifyEmail);
app.use(routes.sendEmailVerification);

app.use(routes.logout);
app.use(routes.login);
app.use(routes.register)
app.use(routes.home);

app.listen(3000, () => console.log('App listening on port 3000!'));
