// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities"); //Required for error handling
const dataValidate = require("../utilities/inventory-validation");
const accountValidate = require("../utilities/account-validation");
const reviewValidate = require("../utilities/review-validation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build the detail view
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId)
);

// Route to build the inventory management view
router.get(
  "/",
  utilities.checkLogin,
  accountValidate.checkEmployeeOrAdmin(["Employee", "Admin"]),
  utilities.handleErrors(invController.buildManagement)
);

// Route to build the add classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClass)
);

// Route to post the add classification form
router.post(
  "/add-classification",
  dataValidate.addNewClassRules(),
  dataValidate.checkClassData,
  utilities.handleErrors(invController.addNewClass)
);

// Route to build the add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInv));

// Route to post the add inventory form
router.post(
  "/add-inventory",
  dataValidate.addNewInvRules(),
  dataValidate.checkInvData,
  utilities.handleErrors(invController.addNewInv)
);

// Route to get inventory
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build the edit inventory view
router.get(
  "/edit/:inventory_id",
  utilities.handleErrors(invController.buildEditInv)
);

// Route to post the edit inventory form
router.post(
  "/update",
  dataValidate.addNewInvRules(),
  dataValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to build the delete view
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.buildDeleteInv)
);

// Route to post the delete form
router.post(
  "/deleteVehicle",
  utilities.handleErrors(invController.deleteInventory)
);

// Route to post the submit review form
router.post(
  "/add-review",
  reviewValidate.submitReviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.postReview)
);

// Route to post the edit review form
router.post(
  "/edit-review/:review_id",
  reviewValidate.submitReviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.updateReview)
);

// Route to delete a review
router.post(
  "/delete-review/:review_id",
  utilities.handleErrors(reviewController.deleteReview)
);

// Route for the error task (intentional error)
router.get("/errortrigger", utilities.handleErrors(invController.errorTrigger));

module.exports = router;
