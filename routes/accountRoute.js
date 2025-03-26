// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities"); //Required for error handling

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
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
