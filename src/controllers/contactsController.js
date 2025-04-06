import mongoose from "mongoose";
import { createContact, fetchAllContacts, fetchContactById, removeContact, updateContact } from "../services/contacts.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";

export async function getContacts(req, res) {

    const {page , perPage} = parsePaginationParams(req.query);
    const {sortBy, sortOrder} = parseSortParams(req.query);

 
    const contacts = await fetchAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        userId: req.user.id,
    });
    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
}

export async function getContactsById(req, res){
    const { contactId } = req.params;    
        const contact = await fetchContactById(contactId);
        
        if(!contact || contact.userId.toString() !== req.user.id.toString()){
            throw createHttpError.NotFound("Contact is not allowed");
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
}

export async function createContactController(req,res){
    const userContact = {
        ...req.body,
        userId: req.user.id, 
    }
    const contact = await createContact(userContact);
    res.status(201).json({ status: 201, message: "Successfully created a contact!", data: contact});
}   


export async function removeContactController(req, res){
    const { contactId } = req.params;
    const contact = await removeContact(contactId, req.user.id);

    if(!contact){
        throw createHttpError.NotFound('Contact is not allowed');
    }


    res.status(204).send();
}

export async function updateContactController(req, res){
    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId,req.user.id, req.body);

    if (!updatedContact) {
        throw createHttpError.NotFound('Contact is not allowed');
      }

    res.json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: updatedContact,
      });
}