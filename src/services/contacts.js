import Contact from "../models/contact.js";

export async function fetchAllContacts({ page, perPage, sortBy, sortOrder }) {
    const skip = page > 0 ? ((page - 1) * perPage) : 0;

    const [totalItems, data] = await Promise.all([
        Contact.countDocuments(),
        Contact.find().sort({[sortBy]: sortOrder}).skip(skip).limit(perPage),
    ])

    const totalPages = Math.ceil(totalItems / perPage);

    return{
        data,
        totalItems,
        page,
        perPage,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: totalPages - page > 0,
    }  ;
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
