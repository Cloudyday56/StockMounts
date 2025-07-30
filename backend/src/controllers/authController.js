import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import cloudinary from "../config/cloudinary.js"; //import cloudinary for image upload
import axios from "axios";

//signup controller
export const signup = async (req, res) => {
  //get user data
  const { fullName, email, password } = req.body;
  // hash the password and save the user to the database
  try {
    //validate user data
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Password strength validation (must match frontend PasswordStrengthMeter)
    const passwordRequirements = [
      password.length >= 6,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    if (passwordRequirements.includes(false)) {
      return res.status(400).json({ message: "Password too weak" });
    }

    //check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    //hash the password given by the user
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    //create a new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      await newUser.save(); //save the user to the database
      //generate JWT token
      generateTokenAndSetCookie(res, newUser._id);

      res.status(201).json({
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
          createdAt: newUser.createdAt,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error during signup:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//login controller
export const login = async (req, res) => {
  //receive input
  const { email, password } = req.body;
  try {
    //input validation (also checked in frontend)
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credential" });
    }

    //compare the password with the hashed password in the database
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credential" });
    }

    //if everything is fine, send the user data and generate JWT token
    generateTokenAndSetCookie(res, user._id); //generate JWT token
    res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error during login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//logout controller
export const logout = async (req, res) => {
  //clear out the cookie
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log("Error during logout:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//update user profile controller
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id; //user added from the protectRoute middleware

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic); //cloudinary is just a bucket for image upload
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url }, //update the profilePic field with the uploaded image URL
      { new: true } //return the user after update
    );

    res.status(200).json({ user: updatedUser }); //send the updated user data as response
  } catch (error) {
    console.log("Error during profile update:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//checkAuth controller
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({ user: req.user }); //send the user data from the request object
  } catch (error) {
    console.log("Error during authentication check:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete account controller
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id; //user added from the protectRoute middleware
    if (!userId) {
      return res.status(400).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId); //del user
    // Clear auth cookie
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log("Error during account deletion:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const CALLBACK_URL =
  process.env.NODE_ENV === "production"
    ? "https://backend-6z9h.onrender.com/api/auth/github/callback" // Production URL
    : "http://localhost:5001/api/auth/github/callback";

// GitHub OAuth login controller
export const gitLogin = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    CALLBACK_URL
  )}&scope=user:email`;
  res.redirect(githubAuthUrl); // send the user to GitHub for authentication
};

// Redirect to GitHub for authentication
export const gitCallback = async (req, res) => {
  const code = req.query.code; //get the code from url (send by Github)
  if (!code) {
    return res.status(400).json({ message: "No code provided" });
  }
  try {
    // 1. Exchange code for access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: CALLBACK_URL,
      },
      {
        headers: { Accept: "application/json" },
      }
    );
    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res
        .status(400)
        .json({ message: "No access token received from GitHub" });
    }

    // 2. Fetch user info from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const emailResponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const githubUser = userResponse.data;
    const emails = emailResponse.data;

    //identify primary & verified email
    const primaryEmailObj =
      emails.find((e) => e.primary && e.verified) || emails[0];
    const email = primaryEmailObj ? primaryEmailObj.email : null;
    if (!email) {
      return res
        .status(400)
        .json({ message: "No email found in GitHub profile" });
    }

    // 3. Find or create user
    let user = await User.findOne({ email }); //find
    if (!user) {
      //create
      user = new User({
        email,
        fullName: githubUser.name || githubUser.login || "GitHub User",
        profilePic: githubUser.avatar_url || "",
      });
      await user.save();
    }

    // 4. JWT and cookie
    generateTokenAndSetCookie(res, user._id);

    // 5. Redirect to frontend HomePage
    const FRONTEND_URL =
      process.env.NODE_ENV === "production"
        ? "https://stockmounts.onrender.com"
        : "http://localhost:5173"; // remove the port if deployed in local production

    res.redirect(FRONTEND_URL);
  } catch (error) {
    console.error("GitHub OAuth error:", error.message);
    res.status(500).json({ message: "GitHub authentication failed" });
  }
};
