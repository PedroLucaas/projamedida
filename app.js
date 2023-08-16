const path = require('path');
const cookieParser = require('cookie-parser');

const express = require('express');
const { isAuthenticated } = require('./libs/middleware/ensuredAuthenticated');
const app = express();

app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

const routes = {
  resetPassword: require('./routes/reset-password'),
  forgotPassword: require('./routes/forgot-password'),
  // logout: require('./routes/logout'),
  home: require('./routes/home'),
  login: require('./routes/login'),
  register: require('./routes/register'),
}

app.use(routes.resetPassword);
app.use(routes.forgotPassword);
// app.use('/logout', routes.logout)
app.use(routes.home)
app.use(routes.login)
app.use(routes.register)


app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
