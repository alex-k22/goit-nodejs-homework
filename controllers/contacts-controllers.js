
import contactsServices from "../models/contacts.js";
import { HttpError } from "../helpers/index.js";
import {ctrlWrapper} from "../decorators/index.js";



const getAll = async (req, res, next) => {
    const result = await contactsServices.listContacts();
    res.json(result);
};

const getById = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await contactsServices.getContactById(contactId);
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.json(result);
};

const add = async (req, res, next) => {
    const result = await contactsServices.addContact(req.body);
    res.status(201).json(result);
};

const removeById = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await contactsServices.removeContact(contactId);
    if (!result) {
      throw HttpError(404);
    }
    res.status(200).json({"message": "contact deleted"});
};

const updateById = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await contactsServices.updateContactById(
      contactId,
      req.body
    );
    if (!result) {
      throw HttpError(404, `Contact with id=${contactId} not found`);
    }
    res.json(result);
};

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    removeById: ctrlWrapper(removeById),
    updateById: ctrlWrapper(updateById)
}