import express from "express";
import contactsControllers from "../../controllers/contacts-controllers.js";
import {validateBody} from "../../decorators/index.js";
import contactsSchemas from "../../schemas/contacts-schemas.js";
import {isEmptyBody} from "../../middlewares/index.js"

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAll);

contactsRouter.get("/:contactId", contactsControllers.getById);

contactsRouter.post("/", validateBody(contactsSchemas.movieAddSchema), contactsControllers.add);

contactsRouter.delete("/:contactId", contactsControllers.removeById);

contactsRouter.put("/:contactId", isEmptyBody, validateBody(contactsSchemas.movieAddSchema), contactsControllers.updateById);

export default contactsRouter;
