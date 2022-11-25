const mongoose=require("mongoose");
const {Schema}=mongoose;
const connectdb=require("../db.js");


//SCHEMA STRUCTURE

const userSchema=new Schema({

name:{
    type:String,
    required:true
},

email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
}

})
const User=mongoose.model('users',userSchema);
User.createIndexes();
module.exports=User;



