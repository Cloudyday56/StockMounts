import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // when next() is called, the next function in router will be executed
  //ie. checkAuth in router.get("/check-auth", verifyToken, checkAuth);

  const token = req.cookies.token // should match the name of the cookie set in generateTokenAndSetCookie function
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  try {
    //verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    req.userId = decoded.id; // need to match the key ("id") used in generateTokenAndSetCookie function

    //proceed if token is valid
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

}

