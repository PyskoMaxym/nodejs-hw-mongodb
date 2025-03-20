import express from "express";
import { createContactController, getContacts, getContactsById, removeContactController, updateContactController } from "../controllers/contactsController.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contactValidation.js";
const router = express.Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactsById));
router.post('/',validateBody(createContactSchema), ctrlWrapper(createContactController));
router.delete('/:contactId', isValidId, ctrlWrapper(removeContactController));
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactController));

export default router;