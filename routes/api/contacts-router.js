import express from "express";
import contactsControllers from "../../controllers/contacts-controllers.js";
import {validateBody} from "../../decorators/index.js";
import contactsSchemas from "../../schemas/contacts-schemas.js";
import {isValidId} from "../../middlewares/index.js"

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAll);

contactsRouter.get("/:contactId", isValidId, contactsControllers.getById);

contactsRouter.post("/", validateBody(contactsSchemas.contactAddSchema), contactsControllers.add);

contactsRouter.delete("/:contactId", isValidId, contactsControllers.removeById);

contactsRouter.put("/:contactId", isValidId, validateBody(contactsSchemas.emptyBodySchema), validateBody(contactsSchemas.contactAddSchema), contactsControllers.updateById);

contactsRouter.patch("/:contactId/favorite", isValidId, validateBody(contactsSchemas.contactUpddateFavoriteSchema), contactsControllers.updateStatusContact);

export default contactsRouter;
