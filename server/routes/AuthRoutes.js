//making our api

import { Router } from "express";
import { login, signup } from "../controllers/AuthController.js";

const authRoutes = Router();

authRoutes.post("/signup", signup); // uses signup logic from controller
authRoutes.post("/login", login);
export default authRoutes;