
import Contact from "../models/contact.js";
import { HttpError } from "../helpers/index.js";
import {ctrlWrapper} from "../decorators/index.js";



const getAll = async (req, res, next) => {
    const result = await Contact.find();
    res.json(result);
};

const getById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.json(result);
};

const add = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
};

const removeById = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
      throw HttpError(404);
    }
    res.status(200).json({"message": "contact deleted"});
};

const updateById = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      {new: true}
    );
    if (!result) {
      throw HttpError(404, `Contact with id=${contactId} not found`);
    }
    res.json(result);
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(
    contactId,
    req.body,
    {new: true}
  );
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    removeById: ctrlWrapper(removeById),
    updateById: ctrlWrapper(updateById),
    updateStatusContact: ctrlWrapper(updateStatusContact)
}