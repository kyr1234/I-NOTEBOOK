const jwt=require("jsonwebtoken");
const sec_keys="letsdoit";

const fetcheruser=(req,res,next)=>{

const token=req.header("auth-token");
if(!token){
res.status(401).send("PLEASE AUTHENTICATE WITH CORRECT TOKEN");
}
try {
    const idfromtoken=jwt.verify(token,sec_keys);
req.user=idfromtoken.user;
next();


}catch(error){
    res.status(500).send("SERVER ERROR");
    }




}

module.exports=fetcheruser;