import express from "express";
import { registerController, loginController, logoutController, refreshController, requestPasswordResetController } from "../controllers/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { registerSchema, loginSchema, requestPasswordResetSchema } from "../validation/userValidation.js";
import { validateBody } from "../middlewares/validateBody.js";
const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, validateBody(registerSchema), ctrlWrapper(registerController));
router.post("/login", jsonParser, validateBody(loginSchema), ctrlWrapper(loginController));
router.post("/logout", ctrlWrapper(logoutController));
router.post("/refresh", ctrlWrapper(refreshController));
router.post("/request-password-reset", jsonParser, validateBody(requestPasswordResetSchema), ctrlWrapper(requestPasswordResetController));

export default router;
