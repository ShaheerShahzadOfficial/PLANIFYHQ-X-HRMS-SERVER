const role = (req, res, next) => {
  const { role } = req.user;
  console.log(req.user);
  if (role !== "superadmin") {
    return res.status(403).json({ message: "You are not authorized" });
  }
  next();
};

export { role };
