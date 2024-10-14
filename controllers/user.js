const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
  // these name, email and password should be same in the ejs form
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password,
  });

  return res.redirect("/");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) {
    return res.render("login", {
      error: "Invalid username or password",
    });
  }

  const token = setUser(user);
  res.cookie("token", token);
  return res.redirect("/");
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
