const { getUser } = require("../service/auth");

async function restrictToLoggedInUserOnly(req, res, next) {
  const userUid = req.cookies?.uid;

  // if user is not logged in
  if (!userUid) return res.redirect("/login");

  // if user not found
  const user = getUser(userUid);
  if (!user) return res.redirect("/login");

  req.user = user;
  next();
}

// same as above but not restricted
async function checkAuth(req, res, next) {
  const userUid = req.cookies?.uid;
  const user = getUser(userUid);
  req.user = user;
  next();
}

module.exports = { restrictToLoggedInUserOnly, checkAuth };
