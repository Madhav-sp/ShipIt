function requireAuth(
  req,
  res,
  next
) {

  if (!req.user) {

    return res
      .status(401)
      .json({
        message:
          "Login Required"
      });

  }

  next();

}

module.exports =
  requireAuth;