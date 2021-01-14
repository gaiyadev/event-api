const jwt = require("jsonwebtoken");

module.exports = (req,res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1]; // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDAwMjg2ZWUyY2VkMDM1OWI2YzQ3Y2EiLCJlbWFpbCI6ImdhaXlhb2JlZDlmNEBnbWFpbC5jb20iLCJpYXQiOjE2MTA2MjcyNDgsImV4cCI6MTYxMDYzMDg0OH0.ZBUafSSuhYfWexfi8qymKU5dgsTbUmJu3-fNhRpIIaI
  if (!token || token === " ") {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    req.isAuth = false;
    return next();
  } 

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  console.log(req.userId)
   next();
};
