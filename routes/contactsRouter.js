import express from "express";
import contactsController from "../controllers/contactsControllers.js";
import validateBody from "../middlewares/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactsSchemas.js";

import isValidId from "../middlewares/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:id", isValidId, contactsController.getById);

contactsRouter.delete("/:id", isValidId, contactsController.remove);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  contactsController.create
);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(updateContactSchema),
  contactsController.update
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateStatusSchema),
  contactsController.update
);

export default contactsRouter;
