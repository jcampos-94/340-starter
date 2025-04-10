const pool = require("../database/");

/* ***************************
 *  Get all reviews by inv_id
 * ************************** */
async function getReviewsByInvId(inv_id) {
  const sql = `SELECT r.review_id, r.review_content, r.review_date, a.account_firstname, a.account_lastname
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

module.exports = { getReviewsByInvId, addReview };
