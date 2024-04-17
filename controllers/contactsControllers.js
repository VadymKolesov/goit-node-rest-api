import HttpError from "../helpers/HttpError.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts();
  res.json(result);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);

  if (!result) {
    return res.status(404).json({ message: HttpError(404).message });
  }

  res.json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);

  if (!result) {
    return res.status(404).json({ message: HttpError(404).message });
  }

  res.json(result);
};

export const createContact = async (req, res) => {
  const result = await contactsService.addContact(req.body);
  res.status(201).json(result);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.updateContact(id, req.body);

  if (!result) {
    return res.status(404).json({ message: HttpError(404).message });
  }

  res.json(result);
};
