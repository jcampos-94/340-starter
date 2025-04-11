const reviewModel = require("../models/review-model");

/* ***************************
 *  Process The Review Submit
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

/* ***************************
 *  Process The Review Edit
 * ************************** */
async function updateReview(req, res) {
  const { review_content, inv_id } = req.body;
  const { review_id } = req.params;
  const account_id = res.locals.accountData.account_id;

  try {
    const editReviewResult = await reviewModel.updateReview(
      review_id,
      account_id,
      review_content
    );

    if (editReviewResult) {
      req.flash("notice", "Review edited successfully.");
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

module.exports = { postReview, updateReview };
