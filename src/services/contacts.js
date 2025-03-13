import Contact from "../models/contact.js";

export async function fetchAllContacts() {
    return await Contact.find();
}

export async function fetchContactById(contactId){
    return await Contact.findById(contactId);
}

export async function createContact(payload){
    const contact = await Contact.create(payload);
    return contact;
}

export async function removeContact(contactId){
    const deleteContact = await Contact.findByIdAndDelete(contactId);
    return deleteContact;
}

export async function updateContact(contactId, payload) {
    const contact = await Contact.findByIdAndUpdate(contactId, payload,{
        new: true,
    });
    return contact;
}
