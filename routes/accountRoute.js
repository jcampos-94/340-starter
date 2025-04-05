// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities"); //Required for error handling
const dataValidate = require("../utilities/account-validation");

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the login attempt
router.post(
  "/login",
  dataValidate.loginRules(),
  dataValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to build the register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Route to post the register form
router.post(
  "/register",
  dataValidate.registrationRules(),
  dataValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Route to build the account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount));

// Route to build the account update view
router.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountUpdate));

// Route to post the account update form
router.post(
  "/account-update",
  dataValidate.updateAccountRules(),
  dataValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount));

// Route to post the password update form
router.post(
  "/password-update",
  dataValidate.updatePasswordRules(),
  dataValidate.checkPasswordUpdateData,
  utilities.handleErrors(accountController.updatePassword));

module.exports = router;
