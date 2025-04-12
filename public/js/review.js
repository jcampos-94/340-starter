/*  **********************************
 *  Edit Review Event Listener
 * ********************************* */
document.addEventListener("DOMContentLoaded", () => {
  const editButton = document.querySelector(".editReviewBtn");

  if (editButton) {
      editButton.addEventListener("click", () => {
        const reviewId = editButton.getAttribute("data-review-id");
        const editForm = document.getElementById(`editForm${reviewId}`);
        const deleteForm = document.getElementById(`deleteForm${reviewId}`);

        // Hide delete form if it's open
        if (deleteForm && deleteForm.style.display === "flex") {
          deleteForm.style.display = "none";
        }

        // Toggle edit form
        if (editForm.style.display === "none" || editForm.style.display === "") {
          editForm.style.display = "flex";
        } else {
          editForm.style.display = "none";
        }
      });
  };
});

/*  **********************************
 *  Delete Review Event Listener
 * ********************************* */
document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".deleteReviewBtn");

  if (deleteButtons) {
    deleteButtons.forEach((deleteButton)=> {
      deleteButton.addEventListener("click", () => {
        const reviewId = deleteButton.getAttribute("data-review-id");
        const editForm = document.getElementById(`editForm${reviewId}`);
        const deleteForm = document.getElementById(`deleteForm${reviewId}`);

        // Hide edit form if it's open
        if (editForm && editForm.style.display === "flex") {
          editForm.style.display = "none";
        }

        // Toggle delete form
        if (deleteForm.style.display === "none" || deleteForm.style.display === "") {
          deleteForm.style.display = "flex";
        } else {
          deleteForm.style.display = "none";
        }
      });
    })
  };
});