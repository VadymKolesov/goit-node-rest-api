import express from "express";
import validateBody from "../middlewares/validateBody.js";
import usersSchemas from "../schemas/usersSchemas.js";
import usersControllers from "../controllers/usersControllers.js";
import authenticate from "../middlewares/authenticate.js";
import isValidId from "../middlewares/isValidId.js";
import upload from "../middlewares/upload.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validateBody(usersSchemas.registerUserSchema),
  usersControllers.register
);

usersRouter.post(
  "/login",
  validateBody(usersSchemas.loginUserSchema),
  usersControllers.login
);

usersRouter.post("/logout", authenticate, usersControllers.logout);

usersRouter.get("/current", authenticate, usersControllers.current);

usersRouter.patch(
  "/:id/subscription",
  authenticate,
  isValidId,
  validateBody(usersSchemas.updateSubscriptionSchema),
  usersControllers.updateSubscription
);

usersRouter.patch(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  usersControllers.updateAvatar
);

export default usersRouter;
