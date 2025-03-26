const utilities = require("../utilities/");

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    const loginForm = await utilities.buildLoginForm();
    res.render("./account/login", {
        title: "Login",
        nav,
        loginForm,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
    const registerForm = await utilities.buildRegisterForm();
    res.render("./account/register", {
      title: "Register",
      nav,
      registerForm,
      errors: null
    })
  }

module.exports = { buildLogin, buildRegister }