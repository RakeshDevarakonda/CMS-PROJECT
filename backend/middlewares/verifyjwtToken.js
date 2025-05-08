import Jwt from "jsonwebtoken";

export const verifyjwtToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const payload = Jwt.verify(token, process.env.JWT_SECRET);

    req.id = payload.id;
    req.email = payload.email;
    req.role = payload.role;
    req.username = payload.username;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send("Unauthorized");
  }
};
