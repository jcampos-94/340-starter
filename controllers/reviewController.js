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

/* ***************************
 *  Process The Review Delete
 * ************************** */
async function deleteReview(req, res) {
  const { inv_id } = req.body;
  const { review_id } = req.params;
  const account_id = res.locals.accountData.account_id;
  const account_type = res.locals.accountData.account_type;
  try {
    // Check if the user is either an admin or the owner of the review
    let canDelete = false;

    if (account_type === "Admin") {
      // Admin can delete any review
      canDelete = true;
    } else if (account_type === "Client") {
      // Client can only delete their own review
      const reviewOwner = await reviewModel.getReviewOwner(review_id);
      if (reviewOwner && reviewOwner.account_id === account_id) {
        canDelete = true;
      }
    }

    if (canDelete) {
      // Call a single delete function, as the ownership check has already been done
      const deleteResult = await reviewModel.deleteReview(review_id);
      if (deleteResult) {
        req.flash("notice", "Review deleted successfully.");
      } else {
        req.flash("notice", "Review could not be deleted. Please try again.");
      }
    } else {
      req.flash("notice", "You are not authorized to delete this review.");
    }

    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    console.error("Error deleting review:", error);
    req.flash("notice", "Review could not be deleted. Please try again.");
    res.redirect(`/inv/detail/${inv_id}`);
  }
}

module.exports = { postReview, updateReview, deleteReview };
