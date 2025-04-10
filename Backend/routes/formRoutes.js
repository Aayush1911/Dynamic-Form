const express = require("express");
const { saveFormSchema, getFormSchema, submitForm, getFormResponses, deletecontroller, getformname,getFormLink, deleteSchemaController } = require("../controller/formController");
const { editcontroller } = require("../controller/formController");
const fetchUser = require("../middleware/fetchuser");
const router = express.Router();

router.post("/save-schema",fetchUser, saveFormSchema);  // Save form schema
router.get("/get-schema/:formId", getFormSchema);  // Fetch schema by name
router.post("/submit-form/:formId", submitForm);  // Save user response
router.get("/get-responses/:formId",fetchUser, getFormResponses);  // Fetch responses
router.put("/edit/:id",editcontroller)
router.delete("/delete/:id",deletecontroller)
router.get("/name",getformname)
router.get('/fill/:shareLink',fetchUser,getFormLink)
router.delete('/deleteSchema/:id',deleteSchemaController)

module.exports = router;
