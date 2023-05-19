import express from "express";
const router = express.Router();

import { login } from "../controllers/LoginController.js";

router.post("/", login);

export default router;
