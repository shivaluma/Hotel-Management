const Validator = require("validator");
const isEmpty = require("../utils/checkEmpty");

module.exports = function(data) {
  let errors = {};

  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "a";
  data.address = !isEmpty(data.address) ? data.address : "";

  // Identity Number Validation

  if (data.phoneNumber.length !== 10) {
    errors.phoneNumber = "Phone number must be 10 digits";
  }

  if (Validator.isEmpty(data.phoneNumber)) {
    errors.phoneNumber = "Phone number field is required";
  }

  // Email Validation

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isEmail(data.email) && !Validator.isEmpty(data.email)) {
    errors.email = "Email is invalid";
  }

  // Password Validation

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  // First Name Validation

  if (!Validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors.firstName = "First Name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "First Name field is required";
  }

  // Last Name Validation

  if (!Validator.isLength(data.lastName, { min: 2, max: 30 })) {
    errors.lastName = "Last Name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Last Name field is required";
  }

  // Address Field Validation
  if (Validator.isEmpty(data.address)) {
    errors.address = "Address field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
