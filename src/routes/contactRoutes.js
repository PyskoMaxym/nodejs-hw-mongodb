import express from "express";
import { createContactController, getContacts, getContactsById, removeContactController, updateContactController } from "../controllers/contactsController.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', ctrlWrapper(getContactsById));
router.post('/', ctrlWrapper(createContactController));
router.delete('/:contactId', ctrlWrapper(removeContactController));
router.patch('/:contactId', ctrlWrapper(updateContactController));

export default router;