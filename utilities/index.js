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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
