const path = require('path');
const express = require('express');

const { accounts, users } = require('./data');
const accountRoutes = require('./routes/accounts');
const servicesRoutes = require('./routes/services');

const app = express();

// app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/account', accountRoutes);
app.use('/services', servicesRoutes);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (_req, res) => {
  res.render('index', {
    title: 'Account Summary',
    accounts
  });
});

app.get('/profile', (req, res) => {
  res.render('profile', {
    user: users[0]
  });
});

app.listen(3000, () => {
  console.log('PS Project Running on port 3000!');
});
