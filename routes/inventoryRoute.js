// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities"); //Required for error handling
const dataValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build the detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build the management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build the add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClass));

// Route to post the add classification form
router.post(
  "/add-classification",
  dataValidate.addNewClassRules(),
  dataValidate.checkClassData,
  utilities.handleErrors(invController.addNewClass));

// Route to build the add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInv));

// Route to post the add inventory form
router.post(
  "/add-inventory",
  dataValidate.addNewInvRules(),
  dataValidate.checkInvData,
  utilities.handleErrors(invController.addNewInv));

// Route to build the get inventory view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route for the error task (intentional error)
router.get("/errortrigger", utilities.handleErrors(invController.errorTrigger));

module.exports = router;