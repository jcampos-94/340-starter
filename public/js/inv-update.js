// Prevent updating if no data has been changed
const form = document.querySelector("#editInvForm");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("#submitButton");
  updateBtn.removeAttribute("hidden"); //The activity says "disabled", but that doesn't work with my code
});
