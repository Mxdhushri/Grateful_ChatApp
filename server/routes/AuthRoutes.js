//making our api

import { Router } from "express";
import { getUserInfo, login, signup, updateProfile, addProfileImage, removeProfileImage, logout } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const authRoutes = Router();
const upload = multer({dest:"uploads/profiles/"}) // image stored in this route


authRoutes.post("/signup", signup); // uses signup logic from controller
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo); // verifytoken [middleware -written in middleware] is executed before getuserinfo [controller]
authRoutes.post("/update-profile",verifyToken, updateProfile);
authRoutes.post("/add-profile-image",verifyToken, upload.single("profile-image") ,addProfileImage ) //from constants.js then from profile-image from index.js
authRoutes.delete("/remove-profile-image" , verifyToken, removeProfileImage);
authRoutes.post('/logout',logout); //after controller 

export default authRoutes;