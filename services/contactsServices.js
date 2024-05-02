import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((el) => el.id === contactId);

  if (index < 0) {
    return null;
  }

  return contacts[index];
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((el) => el.id === contactId);

  if (index < 0) {
    return null;
  }

  const [removedContact] = contacts.splice(index, 1);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return removedContact;
}

async function addContact(data) {
  const newContact = { id: nanoid(), ...data };

  const contacts = await listContacts();

  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
}

async function updateContact(contactId, data) {
  const allContacts = await listContacts();
  const index = allContacts.findIndex((el) => el.id === contactId);

  if (index < 0) {
    return null;
  }

  const updatedContact = { ...allContacts[index], ...data };
  allContacts[index] = updatedContact;

  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));

  return updatedContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
