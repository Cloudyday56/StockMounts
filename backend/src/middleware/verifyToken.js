import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
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
    // Fetch user from DB and attach to req.user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    req.user = user;
    //proceed if token is valid
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

}

