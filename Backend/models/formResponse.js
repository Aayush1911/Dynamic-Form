const mongoose = require("mongoose");

const FormResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "formSchema",
    required: true,
  },
  schemaName: { type: String, required: true }, // Schema the response belongs to
  responses: { type: Object, required: true }, // User-submitted data
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FormResponse", FormResponseSchema);
