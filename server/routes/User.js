import express from "express";
const router = express.Router();

import { authenticateToken } from "../middleware/Authenticate.js";
import { updateUser, deleteUser } from "../controllers/UserController.js";

router.use(authenticateToken);

router.delete("/", deleteUser);
router.patch("/:username", updateUser);

export default router;
