//making our api

import { Router } from "express";
import { signup } from "../controllers/AuthController.js";

const authRoutes = Router();

authRoutes.post("/signup", signup); // uses signup logic from controller
export default authRoutes;