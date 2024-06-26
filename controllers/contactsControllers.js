import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import Contact from "../models/contact.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { favorite, page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const query = {
    owner,
  };

  if (favorite) {
    query.favorite = favorite;
  }

  const result = await Contact.find(query, "", { skip, limit });
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await Contact.find({ _id: id, owner });

  if (!result) {
    throw HttpError(404);
  }

  res.json(...result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await Contact.findOneAndDelete({ _id: id, owner });

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Contact.create({ ...req.body, owner });

  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

export default {
  getAll: ctrlWrapper(getAllContacts),
  getById: ctrlWrapper(getOneContact),
  remove: ctrlWrapper(deleteContact),
  create: ctrlWrapper(createContact),
  update: ctrlWrapper(updateContact),
};
