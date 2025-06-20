const User = require("../models/user");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const formSchema = require("../models/formSchema");

dotenv.config({ path: './.env' });

const signupcontroller = async (req, res) => {
    try {
        const { name, email, password ,role} = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (role === 'admin') {
            let namestartswith=process.env.ADMIN_NAME;
            if (!name.toLowerCase().startsWith(namestartswith)) {
                return res.status(400).json({ error: 'You are not eligible for registering as admin' });
            }
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ name, email, password: hashedPassword ,role: req.body.role || "user" });
        await newUser.save();

        res.status(201).json({ message: 'Signup successful' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

const logincontroller = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'User does not exist, please sign up first' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        const token = jwt.sign(
            { userId: user.id ,role:user.role,name:user.name},
            process.env.AUTH_TOKEN,
            { expiresIn: '5h' } // Token expires in 1 hour
        );

        res.json({ token,user:{
            role:user.role
        } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};
const getloggedinuserforms=async(req,res)=>{
     try {
            const forms = await formSchema.find({ userId: req.user.id }); // Find forms of logged-in user
            // console.log(forms);
            res.json(forms);
        } catch (err) {
            res.status(500).json({ error: "Server Error" });
        }
}
const getallusers=async(req,res)=>{
    try{
        const users = await User.find({ role: { $ne: 'admin' } }, '_id name email');
        res.json(users)
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
}
module.exports = { signupcontroller, logincontroller,getloggedinuserforms ,getallusers};
