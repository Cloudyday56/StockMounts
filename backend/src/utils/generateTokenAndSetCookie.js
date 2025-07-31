import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  // Generate a JWT token
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token valid for 7 days
  });

  // Set the token in a cookie
  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
  });

  return token;
};
