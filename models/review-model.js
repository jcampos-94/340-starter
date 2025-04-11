const pool = require("../database/");

/* ***************************
 *  Get all reviews by inv_id
 * ************************** */
async function getReviewsByInvId(inv_id) {
  const sql = `SELECT r.review_id, r.review_content, r.review_date, a.account_id, a.account_firstname, a.account_lastname
      FROM review r
      JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC`;
  return pool.query(sql, [inv_id]);
}

/* ***************************
 *  Add Review
 * ************************** */
async function addReview(inv_id, account_id, review_content) {
  try {
    const sql = `INSERT INTO review (inv_id, account_id, review_content)
      VALUES ($1, $2, $3)
      RETURNING *;`;
    const data = await pool.query(sql, [inv_id, account_id, review_content]);
    return data.rows[0];
  } catch (error) {
    throw new Error("Failed to add review. Please try again.");
  }
}

/* ***************************
 *  Check if User Review already exists
 * ************************** */
async function hasUserReviewed(inv_id, account_id) {
  const result = await pool.query(
    "SELECT review_id FROM review WHERE inv_id = $1 AND account_id = $2",
    [inv_id, account_id]
  );
  return result.rows.length > 0;
}

/* ***************************
 *  Edit Review
 * ************************** */
async function updateReview(review_id, account_id, review_content) {
  try {
    const sql = `UPDATE review
      SET review_content = $3, review_date = CURRENT_TIMESTAMP
      WHERE review_id = $1 AND account_id = $2
      RETURNING *;`;
    const data = await pool.query(sql, [review_id, account_id, review_content]);
    return data.rows[0];
  } catch (error) {
    throw new Error("Failed to edit review. Please try again.");
  }
}

/* ***************************
 *  Delete Review
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM review WHERE review_id = $1 RETURNING *;";
    const result = await pool.query(sql, [review_id]);
    return result.rowCount > 0; // Return true if a row was deleted
  } catch (error) {
    throw new Error("Failed to delete review.");
  }
}

/* ***************************
 *  Check The Review Owner
 * ************************** */
async function getReviewOwner(review_id) {
  try {
    const sql = "SELECT account_id FROM review WHERE review_id = $1";
    const result = await pool.query(sql, [review_id]);
    if (result.rows.length > 0) {
      return result.rows[0]; // Return the owner of the review
    }
    return null;
  } catch (error) {
    throw new Error("Failed to get review owner.");
  }
}

module.exports = { getReviewsByInvId, addReview, hasUserReviewed, updateReview, deleteReview, getReviewOwner };
