document.addEventListener("DOMContentLoaded", () => {
  const editButton = document.querySelector(".editReviewBtn");

  if (editButton) {
      editButton.addEventListener("click", () => {
        const reviewId = editButton.getAttribute("data-review-id");
        const form = document.getElementById(`editForm${reviewId}`);
        if (form.style.display === "none" || form.style.display === "") {
          form.style.display = "flex";
        } else {
          form.style.display = "none";
        }
      });
  };
});
