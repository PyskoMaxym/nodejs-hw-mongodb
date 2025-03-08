import mongoose from "mongoose";
import { fetchAllContacts, fetchContactById } from "../services/contacts.js";

export async function getContacts(req, res) {
    const contacts = await fetchAllContacts();
    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
}

export async function getContactsById(req, res){
    const { contactId } = req.params;
        const contact = await fetchContactById(contactId);
        if (!contact){
            return res.status(404).json({
                message: 'Contact not found',
            })
        }
        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
}
