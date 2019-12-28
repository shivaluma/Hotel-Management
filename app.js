require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const clientRouter = require('./routes/client');
const adminRouter = require('./routes/admin');
var createError = require('http-errors');
//value
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/', clientRouter);
app.use('/admin', adminRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get('/', (req, res) => {
  res.send(`Listening on port ${PORT}`);
});

app.use(function(req, res, next) {
  res.status(404).json({ message: 'Not found' });
});
