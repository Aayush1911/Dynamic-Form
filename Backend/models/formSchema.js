const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const FormSchema = new mongoose.Schema({
  schemaName: { type: String, required: true }, // Unique name for each schema
  fields: { type: Array, required: true }, // Array of field definitions
  createdAt: { type: Date, default: Date.now },
  shareLink: { type: String, unique: true, default: () => nanoid(10) }, // Generate random ID,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true } // Link to User
}, { timestamps: true 
});
FormSchema.index({ schemaName: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model("FormSchema", FormSchema);
