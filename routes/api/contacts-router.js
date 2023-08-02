import express from "express";
import contactsServices from "../../models/contacts.js";
import {HttpError} from '../../helpers/index.js';

const contactsRouter = express.Router();

contactsRouter.get("/", async (req, res, next) => {
  try {
    const result = await contactsServices.listContacts();
    res.json(result);
  } catch (error) {
      next(error);
  }
});

contactsRouter.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsServices.getContactById(contactId);
    if (!result) {
      throw HttpError(404, `Contact with id=${contactId} not found`)
    }
    res.json(result);
  } catch (error) {
      next(error);
  }
});

contactsRouter.post("/", async (req, res, next) => {
  res.json({ message: "template message" });
});

contactsRouter.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

contactsRouter.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

export default contactsRouter;
