import fs from "fs/promises";
import path from 'path';
import { nanoid } from "nanoid";

const contactsPath = path.resolve("models", "contacts.json");

const updateContacts = data => fs.writeFile(contactsPath, JSON.stringify(data, null, 2));

export const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

export const getContactById = async (id) => {
  const data = await listContacts();
  const result = data.find(contact => contact.id === id);
  return result || null;
}

export const removeContact = async (id) => {
  // ...твой код. Возвращает объект удаленного контакта. Возвращает null, если объект с таким id не найден.
  const data = await listContacts();
  const index = data.findIndex(contact => contact.id === id);
  if (index === -1) {
    return null;
  } else {
    const [deletedContact] = data.splice(index, 1);
    await updateContacts(data);
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
  await updateContacts(data);
  return newContact;
}

export const updateContactById = async(id, {name, email, phone}) => {
  const data = await listContacts();
  const index = data.findIndex(contact => contact.id === id);
  if (index === -1) {
    return null;
  } else {
    data[index] = {id, name, email, phone};
    await updateContacts(data);
    return data[index];
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
};