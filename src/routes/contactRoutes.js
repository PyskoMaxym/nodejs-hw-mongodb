import express from "express";
import { getContacts, getContactsById } from "../controllers/contactsController.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', ctrlWrapper(getContactsById));

export default router;