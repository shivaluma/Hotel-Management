const User = require('../models/User');
const validateRegistration = require('../validation/signup');
const validateLoginInput = require('../validation/login');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const keys = require('../config/keys');
exports.createUser = (req, res, next) => {
  const { errors, isValid } = validateRegistration(req.body);
  if (!isValid) {
    return res.status(400).json({ errors: errors });
  } else {
    // Check if user email already exists in the database
    const userEmail = req.body.email.toLowerCase();
    User.findOne({ email: userEmail }).then(user => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json({ errors: errors });
      } else {
        // Check if user phoneNumber already exists in the database
        User.findOne({ phoneNumber: req.body.phoneNumber })
          .then(user => {
            if (user) {
              errors.phoneNumber = 'Phone number already exists';
              return res.status(400).json({ errors: errors });
            } else {
              const { phoneNumber, email, password, firstName, lastName, address } = req.body;
              // Create new user and save it
              const newUser = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                password: password,
                address: address
              });

              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser.save().then(user => res.status(200).json({ user: user }));
                });
              });
              //res.status(200).json({ userChecked: true });
            }
          })
          .catch(err => console.log(err));
      }
    });
  }
};

exports.userLogin = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json({ errors: errors });
  }

  const email = req.body.email;
  const password = req.body.password;

  // Check if user email already exists in the database
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(400).json({ errors: errors });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        const payload = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          role: user.role
        }; // Create JWT Payload

        if (user.role === 1) {
          jwt.sign(payload, keys.secretOrKey, { expiresIn: 36000 }, (err, token) => {
            res.json({
              user: payload,
              token: token,
              role: 1
            });
          });
        } else {
          jwt.sign(payload, keys.secretOrKey, { expiresIn: 36000 }, (err, token) => {
            res.json({
              user: payload,
              token: token,
              role: 0
            });
          });
        }
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json({ errors: errors });
      }
    });
  });
};
