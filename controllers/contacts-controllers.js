
import Contact from "../models/contact.js";
import { HttpError } from "../helpers/index.js";
import {ctrlWrapper} from "../decorators/index.js";



const getAll = async (req, res, next) => {
    const {_id: owner} = req.user;
    const {page = 1, limit = 10, ...query} = req.query;
    const skip = ( page - 1 )*limit;
    const result = await Contact.find({owner, ...query}, null, {skip, limit}).populate("owner");
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
  const {id: owner} = req.user;
  // console.log(req.body);
  // console.log(req.file);
    const result = await Contact.create({...req.body, owner});
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