import express from "express";
import contactsController from "../controllers/contactsControllers.js";
import validateBody from "../middlewares/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactsSchemas.js";

import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, contactsController.getAll);

contactsRouter.get("/:id", authenticate, isValidId, contactsController.getById);

contactsRouter.delete(
  "/:id",
  authenticate,
  isValidId,
  contactsController.remove
);

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  contactsController.create
);

contactsRouter.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(updateContactSchema),
  contactsController.update
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateBody(updateStatusSchema),
  contactsController.update
);

export default contactsRouter;
