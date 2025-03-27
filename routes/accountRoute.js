// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities"); //Required for error handling
const dataValidate = require("../utilities/account-validation");

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

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

// Process the login attempt
router.post(
  "/login",
  dataValidate.loginRules(),
  dataValidate.checkLogData,
  (req, res) => {
  res.status(200).send("login process");
});

module.exports = router;
