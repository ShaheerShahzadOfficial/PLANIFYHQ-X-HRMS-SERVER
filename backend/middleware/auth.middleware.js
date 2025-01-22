import jwt from "jsonwebtoken";

function auth(req, res, next) {
  //get authcookie from request
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(401).json({
      Error: "Please Login to access this resource",
    });
  }
  console.log(token);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      res.status(403).json({
        Message: "You Are Not Authenticated",
      });
      console.log(err);
    } else if (decoded) {
      req.user = decoded;
      next();
    }
  });
}

export { auth };
