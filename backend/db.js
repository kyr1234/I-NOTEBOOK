const mongoose=require('mongoose');
const mongoUri="mongodb://localhost:27017/Inotebook?readPreference=primary&ssl=false";
const connecttoDb=()=>{
mongoose.connect(mongoUri,()=>{
    console.log("CONNCTED SUCCESSFULLY");
})
}
module.exports=connecttoDb;