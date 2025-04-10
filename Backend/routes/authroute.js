const router=require('express').Router();
const authcontroller=require('../controller/authcontroller');
const fetchUser = require("../middleware/fetchuser"); 

router.post('/signup',authcontroller.signupcontroller)
router.post('/login',authcontroller.logincontroller)
router.post('/myforms',fetchUser,authcontroller.getloggedinuserforms)
const express = require("express");
const Form = require("../models/formSchema"); 


// Route to get logged-in user's forms
router.get("/myforms", fetchUser, async (req, res) => {
    try {
        const forms = await Form.find({ userId: req.user.id }); // Find forms of logged-in user
        // console.log(forms);
        res.json(forms);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;

