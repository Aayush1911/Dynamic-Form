const FormSchema = require("../models/formSchema");
const FormResponse = require("../models/formResponse");
const formResponse = require("../models/formResponse");
const formSchema = require("../models/formSchema");
const { nanoid } = require("nanoid");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const user = require("../models/user");

//  Save Form Schema
const saveFormSchema = async (req, res) => {
  try {
    const { schemaName, fields } = req.body;
    
    if (!schemaName || !fields) {
      return res.status(400).json({ error: "Schema name and fields are required" });
    }

    // ✅ Create a new form schema
    const newSchema = new FormSchema({
      schemaName,
      fields
    });

    const savedForm = await newSchema.save();

    res.status(201).json({
      message: "Schema saved successfully",
      id: savedForm._id,
      shareLink: savedForm._id.toString(),
    });
  } catch (error) {
    console.error("Error saving form:", error);
    res.status(500).json({ error: "Server error while saving schema" });
  }
};




//  Get Form Schema
const getFormSchema = async (req, res) => {
  try {
    const { id  } = req.params;
    const schema = await FormSchema.findById(id);
    if (!schema) {
      return res.status(404).json({ error: "Schema not found" });
    }
    res.json(schema);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching schema" });
  }
};

//  Submit Form Response
const submitForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const schema = await FormSchema.findById(formId);

    if (!schema) {
      return res.status(404).json({ error: "Form schema not found" });
    }

    const requiredFields = schema.fields.filter(field => field.required).map(field => field.name);
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    
    const formResponse = new FormResponse({ formId: schema._id,schemaName: schema.schemaName,responses: req.body });
    await formResponse.save();

    res.status(201).json({ message: "Form response saved successfully" });

  } catch (error) {
    console.error("Error saving form response:", error);
    res.status(500).json({ error: "Server error while saving response" });
  }
};

// Route to get form by share link
const getFormLink = async (req, res) => {
  try {
    const { shareLink } = req.params;

    // Query using _id directly
    const form = await FormSchema.findOne({ shareLink });  

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).send("Server Error");
  }
};


//  Get All Responses for a Schema
const getFormResponses = async (req, res) => {
  try {
    const { formId } = req.params;
    const responses = await FormResponse.find({ formId });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching responses" });
  }
};

const editcontroller = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body.responses; 

    const existingResponse = await FormResponse.findById(id);
    if (!existingResponse) {
      return res.status(404).json({ error: "Response not found" });
    }

    
    existingResponse.responses = updatedData; 

    
    existingResponse.markModified("responses");

    await existingResponse.save();

    res.json({ message: "Response updated successfully", response: existingResponse });
  } catch (error) {
    res.status(500).json({ error: "Error updating response" });
  }
};

const deletecontroller=async(req,res)=>{
  try{
    const id=req.params.id;
    const deleteresponse=await FormResponse.findByIdAndDelete(id);
    res.json({message:"Response Deleted successfully",response:deleteresponse})
  }catch (error) {
    res.status(500).json({ error: "Error Deleteing response" });
  }
 
}
const deleteSchemaController=async(req,res)=>{
  try{
    const id=req.params.id;
    const deleteschema=await FormSchema.findByIdAndDelete(id);
    res.json({message:"Schema Deleted successfully",response:deleteschema})
  }catch(err){
    res.status(500).json({ error: "Error Deleteing response" });
  }
}

const getformname=async(req,res)=>{
  try{
    const {id}=req.params;
    const allformnames=await formSchema.find({},'schemaName shareLink')
    res.json(allformnames)
  }catch(error){
    res.status(500).json({ error: "Error Deleteing response" });
  }
}

const getadminforms=async(req,res)=>{
  try {
    const forms = await formSchema.find();
    res.json({ forms });
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


const giveAccessToForm = async (req, res) => {
  try {
    const { formId, userIds } = req.body;

    if (!formId || !Array.isArray(userIds)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const form = await FormSchema.findById(formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    const objectIds = userIds.map(id => new mongoose.Types.ObjectId(id));

    // Avoid duplicates
    form.allowedUsers = [...new Set([...form.allowedUsers.map(id => id.toString()), ...objectIds.map(id => id.toString())])].map(id => new mongoose.Types.ObjectId(id));

    await form.save();

    res.status(200).json({ message: "Access granted", allowedUsers: form.allowedUsers });
  } catch (error) {
    console.error("Error giving access:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const removeAccessFromForm = async (req, res) => {
  try {
    const { formId, userId } = req.body;

    if (!formId || !userId) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const form = await FormSchema.findById(formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    // Check if user is in allowedUsers list
    const userIndex = form.allowedUsers.findIndex(id => id.toString() === userId);
    if (userIndex === -1) {
      return res.status(400).json({ message: "User does not have access to this form" });
    }

    // Remove the user from the allowedUsers array
    form.allowedUsers.splice(userIndex, 1);

    await form.save();

    res.status(200).json({ message: "Access removed", allowedUsers: form.allowedUsers });
  } catch (error) {
    console.error("Error removing access:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAccesslist = async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await formSchema.findById(formId).populate("allowedUsers", "name email");

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json(form.allowedUsers);
  } catch (error) {
    console.error("Error fetching access list:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { saveFormSchema, getFormSchema, submitForm, getFormResponses,editcontroller,deletecontroller ,getformname,getFormLink,deleteSchemaController,getadminforms,giveAccessToForm,getAccesslist,removeAccessFromForm};
