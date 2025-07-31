import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  // when next() is called, the next function in router will be executed
  //ie. checkAuth in router.get("/check-auth", verifyToken, checkAuth);

  // get the token from the request cookies or headers (2 ways because of regular Login and OAuth)
  let token = req.cookies.token; // should match the name of the cookie set in generateTokenAndSetCookie function
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  try {
    //verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    // Fetch user from DB and attach to req.user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    req.user = user;
    req.userId = user._id;
    //proceed if token is valid
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

}

