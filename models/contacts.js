import fs from "fs/promises";
import path from 'path';
import { nanoid } from "nanoid";

const contactsPath = path.resolve("models", "contacts.json");

export const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

export const getContactById = async (contactId) => {
  const data = await listContacts();
  const result = data.find(contact => contact.id === contactId);
  return result || null;
}

export const removeContact = async (contactId) => {
  // ...твой код. Возвращает объект удаленного контакта. Возвращает null, если объект с таким id не найден.
  const data = await listContacts();
  const index = data.findIndex(contact => contact.id === contactId);
  if (index === -1) {
    return null;
  } else {
    const [deletedContact] = data.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return deletedContact;
  }
}

export const addContact = async ({name, email, phone}) => {
  // ...твой код. Возвращает объект добавленного контакта.
  const data = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  }
  data.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  return newContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};