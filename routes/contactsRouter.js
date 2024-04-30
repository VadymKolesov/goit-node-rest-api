import express from "express";
import contactsController from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:id", contactsController.getById);

contactsRouter.delete("/:id", contactsController.remove);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  contactsController.create
);

contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  contactsController.update
);

export default contactsRouter;
