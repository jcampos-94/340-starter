const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors"></a>';
      grid += '<div class="namePrice">';
      grid += "<hr>";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the detail view HTML
 * ************************************ */
Util.buildDetailBox = async function (data) {
  let box;
  if (data.length > 0) {
    let vehicle = data[0];

    //Ensure price and miles are numbers and give them the appropriate format
    let formattedPrice = '$' + new Intl.NumberFormat("en-US", { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    }).format(vehicle.inv_price);
    let formattedMiles = new Intl.NumberFormat("en-US").format(vehicle.inv_miles);

    box = '<div id="detail-box">';
    box +=
      '<div id="detail-image"><img src="' +
      vehicle.inv_image +
      '" alt="Image of ' +
      vehicle.inv_make +
      " " +
      vehicle.inv_model +
      ' on CSE Motors"></div>';
    box +=
      '<div id="general-details"><p><strong>' +
      vehicle.inv_make +
      " " +
      vehicle.inv_model +
      ' Details</strong></p>';
    box += '<div class="gray-background"><p><strong>Price: ' +
      formattedPrice +
      '</strong></p></div>';
    box += '<p><strong>Description:</strong> ' +
      vehicle.inv_description +
      '</p>';
    box += '<div class="gray-background"><p><strong>Color:</strong> ' +
      vehicle.inv_color +
      '</p></div>';
    box += '<p><strong>Miles:</strong> ' +
      formattedMiles +
      '</p>';
    box += "</div></div>";
  } else {
    box += '<p class="notice">Sorry, the vehicle could be found.</p>';
  }
  return box;
};

/* **************************************
 * Build the login view HTML
 * ************************************ */
Util.buildLoginForm = async function () {
  let loginForm = '<form>';
  loginForm += '<label for="account_email">Email:</label>';
  loginForm += '<input type="email" id="account_email" name="account_email" required><br>';
  loginForm += '<label for="account_password">Password:</label>';
  loginForm += '<input type="password" id="account_password" name="account_password"' +
    ' pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{12,}$" ' +
    ' required>' +
    '<div>Password must be at least 12 characters and include at least 1 capital and lowercase letter, 1 number, and 1 special character.</div><br>';
  loginForm += '<input type="submit" id="submitButton" value="LOGIN">'
  loginForm += '</form>';
  loginForm += '<p id="registerLink">No account? <a href="/account/register">Sign-up</a></p>';
  return loginForm;
}

/* **************************************
 * Build the register view HTML
 * ************************************ */
Util.buildRegisterForm = async function () {
  let registerForm = '<form action="/account/register" method="post">';
  registerForm += '<label for="account_firstname">First Name:</label>';
  registerForm += '<input type="text" id="account_firstname" name="account_firstname" required><br>';
  registerForm += '<label for="account_lastname">Last Name:</label>';
  registerForm += '<input type="text" id="account_lastname" name="account_lastname" required><br>';
  registerForm += '<label for="account_email">Email:</label>';
  registerForm += '<input type="email" id="account_email" name="account_email" required><br>';
  registerForm += '<label for="account_password">Password:</label>';
  registerForm += '<input type="password" id="account_password" name="account_password"' +
    ' pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{12,}$" ' +
    ' required>' +
    '<div>Password must be at least 12 characters and include at least 1 capital and lowercase letter, 1 number, and 1 special character.</div><br>';
  registerForm += '<input type="submit" id="submitButton" value="REGISTER">'
  registerForm += '</form>'; 
  return registerForm;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
