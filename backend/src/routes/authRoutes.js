import express from 'express';
import { signup, login, logout, updateProfile, checkAuth, deleteAccount, gitLogin, gitCallback } from '../controllers/authController.js'; // Import the auth controller functions
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth); // Protected route to check authentication status

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", verifyToken, updateProfile);
router.delete("/delete-account", verifyToken, deleteAccount);

// Github OAuth routes
router.get("/github", gitLogin);
router.get("/github/callback", gitCallback);

export default router;
