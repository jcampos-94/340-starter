// Needed Resources 
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities"); //Required for error handling

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

module.exports = router;