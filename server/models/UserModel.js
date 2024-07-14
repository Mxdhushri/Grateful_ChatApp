import mongoose from "mongoose" //USER SCHEMA
import {genSalt,hash} from "bcrypt"
const userSchema = new mongoose.Schema ({
    email:{
        type:String,
        required:[true,"Email is required"], // ie compulsary field , validation
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"], // ie compulsary field , validation
    },
    firstName:{
        type:String,
        required:false,
    },
    lastName:{
        type:String,
        required:false,
    },
    image:{
        type:String,
        required:false, 
    },
    color:{
        type:Number,
        required:false, 
    },
    profileSetup:{ // for first time login
        type:Boolean,
        default:false 
    }
});

userSchema.pre("save", async function(next){
    const salt= await genSalt();
    this.password=await hash(this.password, salt);
    next(); // function that tells the server to move to next step. so that sever doesnt stop
});

const User= mongoose.model("Users", userSchema); // putting schema into model
export default User; //to use user in MVC
