const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const express = require('express');
const debug = require('debug')('app');

const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


const accountData = fs.readFileSync('src/json/accounts.json', { encoding: 'UTF8' });
const accounts = JSON.parse(accountData);

const userData = fs.readFileSync('src/json/users.json', { encoding: 'UTF8' });
const users = JSON.parse(userData);

app.get('/', (_req, res) => {
  res.render('index', {
    title: 'Account Summary',
    accounts
  });
});

app.get('/savings', (req, res) => {
  res.render('account', {
    account: accounts.savings
  });
});

app.get('/checking', (req, res) => {
  res.render('account', {
    account: accounts.checking
  });
});

app.get('/credit', (req, res) => {
  res.render('account', {
    account: accounts.credit
  });
});

app.get('/profile', (req, res) => {
  res.render('profile', {
    user: users[0]
  });
});

app.get('/transfer', (req, res) => {
  res.render('transfer');
});

app.post('/transfer', (req, res) => {
  const { from, to, amount } = req.body;
  debug(`${from} to ${to} for ${amount}`);
  accounts[from].balance -= parseInt(amount, 10);
  accounts[to].balance += parseInt(amount, 10);
  const accountsJSON = JSON.stringify(accounts);
  fs.writeFileSync(path.join(__dirname, '/json/accounts.json'), accountsJSON, 'UTF8');
  res.render('transfer', { message: 'Transfer Completed' });
});

app.get('/payment', (req, res) => {
  res.render('payment', { account: accounts.credit });
});

app.post('/payment', (req, res) => {
  const { amount } = req.body;

  accounts.credit.balance -= parseInt(amount, 10);
  accounts.credit.available += parseInt(amount, 10);
  const accountsJSON = JSON.stringify(accounts);
  fs.writeFileSync(path.join(__dirname, '/json/accounts.json'), accountsJSON, 'UTF8');
  res.render('payment', { message: '"Payment Successful', account: accounts.credit });
});

app.listen(3000, () => {
  console.log('PS Project Running on port 3000!');
});
