require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const session=require('express-session');
const connectToMongo = require('./db');
const path=require('path')
var cors = require('cors')
const app=express();

app.use(cors({
    orgin:["http://localhost:5173"],
    methods:["POST","GET","DELETE","PUT"],
    credentials:true
  }))
  
const port=process.env.PORT || 8000
app.use(express.json())

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))
connectToMongo();

app.get('/',(req,res)=>{
    res.send('App is running');
})

app.use("/api/forms", require("./routes/formRoutes"));
app.use('/auth',require('./routes/authroute'))

app.listen(port,()=>{
    console.log(`server runnung at http://localhost:${port}`);
})




