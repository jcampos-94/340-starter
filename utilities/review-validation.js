const utilities = require("."); //Required for error handling
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model");
const reviewModel = require("../models/review-model");

/*  **********************************
 *  Submit Review Validation Rules
 * ********************************* */
validate.submitReviewRules = () => {
  return [
    // valid name is required
    body("review_content")
      .trim()
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
      review_content,
    });
  }
  next();
};

module.exports = validate;
