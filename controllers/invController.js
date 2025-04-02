const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  });
};

/* ***************************
 *  Build the detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId;
  const data = await invModel.getDetailsByInventoryId(inv_id);
  const box = await utilities.buildDetailBox(data);
  let nav = await utilities.getNav();
  const year = data[0].inv_year;
  const make = data[0].inv_make;
  const model = data[0].inv_model;
  res.render("./inventory/detail", {
    title: year + " " + make + " " + model,
    nav,
    box,
    errors: null,
  });
};

/* ***************************
 *  Build the inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Management",
    nav,
    classificationSelect,
  });
};

/* ***************************
 *  Build the add classification view
 * ************************** */
invCont.buildAddClass = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Process Add New Classification
 * *************************************** */
invCont.addNewClass = async function (req, res) {
  const { classification_name } = req.body;
  const addClassResult = await invModel.addNewClass(classification_name);
  let nav = await utilities.getNav();

  if (addClassResult) {
    req.flash("notice", `Congratulations, ${classification_name} was added.`);
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, could not add new classification. Please, try again."
    );
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Build the add inventory view
 * ************************** */
invCont.buildAddInv = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
  });
};

/* ****************************************
 *  Process Add New Inventory
 * *************************************** */
invCont.addNewInv = async function (req, res) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;
  const addInvResult = await invModel.addNewInv(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );

  if (addInvResult) {
    req.flash(
      "notice",
      `Congratulations, ${inv_year} ${inv_make} ${inv_model} was added.`
    );
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, could not add new vehicle. Please, try again.");
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build the edit inventory view
 * ************************** */
invCont.buildEditInv = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id);
  let nav = await utilities.getNav();
  const vehicleData = await invModel.getDetailsByInventoryId(inv_id);
  let classificationList = await utilities.buildClassificationList(vehicleData[0].classification_id);
  const vehicleName = `${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + vehicleName,
    nav,
    classificationList,
    errors: null,
    inv_id: vehicleData[0].inv_id,
    inv_make: vehicleData[0].inv_make,
    inv_model: vehicleData[0].inv_model,
    inv_year: vehicleData[0].inv_year,
    inv_description: vehicleData[0].inv_description,
    inv_image: vehicleData[0].inv_image,
    inv_thumbnail: vehicleData[0].inv_thumbnail,
    inv_price: vehicleData[0].inv_price,
    inv_miles: vehicleData[0].inv_miles,
    inv_color: vehicleData[0].inv_color,
    classification_id: vehicleData[0].classification_id,
  });
};

/* ***************************
 *  Trigger an error for the Week 3 Task
 * ************************** */
invCont.errorTrigger = async function (req, res, next) {
  nonExistentFunction(); //This will trigger the error
};

module.exports = invCont;
