import Contact from "../models/contact.js";

export async function fetchAllContacts() {
    return await Contact.find();
}

export async function fetchContactById(contactId){
    return await Contact.findById(contactId);
}