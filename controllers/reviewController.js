const reviewModel = require("../models/review-model");

/* ***************************
 *  Process The Review Submitting
 * ************************** */
async function postReview(req, res) {
  const { inv_id, review_content } = req.body;
  const account_id = res.locals.accountData.account_id;

  try {
    const postReviewResult = await reviewModel.addReview(
      inv_id,
      account_id,
      review_content
    );

    if (postReviewResult) {
      req.flash("notice", "Review submitted successfully.");
    } else {
      req.flash("notice", "Something went wrong. Please try again.");
    }

    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    console.error("Error submitting review:", error);
    req.flash("notice", "An unexpected error occurred.");
    res.redirect(`/inv/detail/${inv_id}`);
  }
}

module.exports = { postReview };
