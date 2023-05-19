import express from "express";
const router = express.Router();

import { register } from "../controllers/RegisterController.js";

router.post("/", register);

export default router;
