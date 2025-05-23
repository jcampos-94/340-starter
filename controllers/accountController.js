const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/account", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver account update view
 * *************************************** */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/update", {
    title: "Account Update",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Account Update
 * *************************************** */
async function updateAccount(req, res) {
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id
  } = req.body;
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );
  
  if (updateResult) {
    // Fetch the updated account data from the database
    const updatedAccountData = await accountModel.getAccountById(account_id);
    if (!updatedAccountData) {
      req.flash("notice", "Could not retrieve updated data. Please log in again to see your new account information.");
      res.redirect("/account");
      return;
    }
    
    // Remove the password from the account data before generating the JWT
    delete updatedAccountData.account_password;

    // Create new JWT with the updated account data
    const newAccessToken = jwt.sign(
      updatedAccountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 * 1000}
    );
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", newAccessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", newAccessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      });
    }

    req.flash(
      "notice",
      "Your account data was successfully updated."
    );
    return res.redirect("/account");
  } else {
    let nav = await utilities.getNav();
    req.flash("notice", "Sorry, the update failed. Please, try again.");
    res.status(501).render("account/update", {
      title: "Account Update",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    });
  }
};

/* ****************************************
 *  Process Password Update
 * *************************************** */
async function updatePassword(req, res) {
  const {
    account_password,
    account_id
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the update."
    );
    res.status(500).render("/account/update", {
      title: "Account Update",
      nav,
      errors: null,
    });
  }

  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    account_id
  );
  
  if (updateResult) {
    req.flash(
      "notice",
      "Your password was successfully updated."
    );
    return res.redirect("/account");
  } else {
    let nav = await utilities.getNav();
    req.flash("notice", "Sorry, the update failed. Please, try again.");
    res.status(501).render("account/update", {
      title: "Account Update",
      nav,
      errors: null,
      account_id
    });
  }
};

/* ****************************************
 *  Process the Logout
 * *************************************** */
async function logout(req, res) {
  console.log("🔓 Logout controller reached");
  res.clearCookie("jwt");
  console.log("🔓 JWT deleted");
  req.flash("notice", "You have been logged out.");
  return res.redirect("/");
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, buildAccountUpdate, updateAccount, updatePassword, logout };
