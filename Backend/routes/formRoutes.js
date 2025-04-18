const express = require("express");
const { saveFormSchema, getFormSchema, submitForm, getFormResponses, deletecontroller, getformname,getFormLink, deleteSchemaController, getadminforms ,giveAccessToForm,getAccesslist, removeAccessFromForm} = require("../controller/formController");
const { editcontroller } = require("../controller/formController");
const fetchUser = require("../middleware/fetchuser");
const requireAdmin = require("../middleware/requireAdmin");
const formSchema = require("../models/formSchema");
const accessControlMiddleware = require("../middleware/accessControlMiddleware ");
const router = express.Router();

router.post("/save-schema", saveFormSchema);  // Save form schema
router.get("/get-schema/:id", getFormSchema);  // Fetch schema by name
router.post("/submit-form/:formId", submitForm);  // Save user response
router.get("/get-responses/:formId", getFormResponses);  // Fetch responses
router.put("/edit/:id",editcontroller)
router.delete("/delete/:id",deletecontroller)
router.get("/name",getformname)
router.get('/fill/:shareLink',fetchUser,getFormLink)
router.delete('/deleteSchema/:id',deleteSchemaController)
router.get("/admin", fetchUser, requireAdmin,getadminforms)
router.post('/give-access', giveAccessToForm);
router.get('/access-list/:formId',getAccesslist)
router.post('/remove-access',removeAccessFromForm)

router.get('/', async (req, res) => {
    const forms = await formSchema.find({}, '_id schemaName');
    res.json(forms);
  });
module.exports = router;


router.get("/accesible-forms", accessControlMiddleware, (req, res) => {
    res.json({ forms: req.accessibleForms });
});

module.exports = router;
