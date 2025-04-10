const utilities = require("."); //Required for error handling
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model");
const reviewModel = require("../models/review-model");

/*  **********************************
 *  Add New Classification Validation Rules
 * ********************************* */
validate.addNewClassRules = () => {
  return [
    // valid name is required
    body("classification_name")
      .trim()
      .escape()
      .isAlphanumeric()
      .withMessage("A valid name is required."),
  ];
};

/* ******************************
 * Check Classification data and return errors or continue
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Add New Inventory Validation Rules
 * ********************************* */
validate.addNewInvRules = () => {
  return [
    // valid classification is required
    body("classification_id")
      .trim()
      .isInt()
      .withMessage("You must choose a valid classification."),

    // valid make is required
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid make is required."),

    // valid model is required
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid model is required."),

    // valid year is required
    body("inv_year")
      .trim()
      .isInt({ min: 1886, max: new Date().getFullYear() })
      .withMessage("A valid year is required."),

    // valid description is required
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid description is required."),

    // valid image is required
    body("inv_image")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("A valid image location is required."),

    // valid model is required
    body("inv_thumbnail")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("A valid thumbnail location is required."),

    // valid price is required
    body("inv_price")
      .trim()
      .isNumeric({ min: 0, max: 999999999 })
      .withMessage("A valid price is required."),

    // valid miles are required
    body("inv_miles")
      .trim()
      .isInt()
      .withMessage("A valid miles value is required."),

    // valid color is required
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid color is required."),
  ];
};

/* ******************************
 * Check Inventory data and return errors
 * to the add inventory view or continue
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    });
    return;
  }
  next();
};

/* ******************************
 * Check Inventory data and return errors
 * to the edit view or continue
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(classification_id);
    res.render("inventory/edit-inventory", {
      errors,
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_id
    });
    return;
  }
  next();
};

/*  **********************************
 *  Submit Review Validation Rules
 * ********************************* */
validate.submitReviewRules = () => {
  return [
    // valid name is required
    body("review_content")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A review cannot be empty."),
  ];
};

/* ******************************
 * Check Review data and return errors or continue
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { review_content, inv_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const data = await invModel.getDetailsByInventoryId(inv_id);
    const box = await utilities.buildDetailBox(data);
    let nav = await utilities.getNav();
    const reviews = await reviewModel.getReviewsByInvId(inv_id); // Added to get the reviews
    const year = data[0].inv_year;
    const make = data[0].inv_make;
    const model = data[0].inv_model;
    return res.render("./inventory/detail", {
      title: year + " " + make + " " + model,
      nav,
      box,
      inv_id,
      errors,
      reviews: reviews.rows,
      review_content
    });
  }
  next();
};

module.exports = validate;
