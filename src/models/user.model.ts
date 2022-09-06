import mongoose from "mongoose";
import bcrypt from 'bcrypt';
//import config from 'config';
import dotenv from "dotenv";
//import { any } from "zod";
dotenv.config({path: './src/.env'});
const Salt=process.env.saltWorkFactor;

export interface IUser extends mongoose.Document{
      name: string;
      email: string;
      password:string;
      isAdmin:Boolean;
      createdAt: Date;
      updatedAt:Date;
      matchPassword(candidatePassword:string):Promise<Boolean>;


}

const userSchema = new mongoose.Schema(
    {
        
        name: {type: String, required:true},
        email: {type : String , required : true,unique:true},
        password: {type:String , required:true},
        isAdmin:{type:Boolean,required:true}
    },
    {
        timestamps: true,
    }
);

userSchema.set("toJSON",{
    transform: function (doc, ret){
        ret.id=ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

userSchema.methods.matchPassword = async function(enteredPassword:string): Promise<Boolean>{
    return await bcrypt.compare(enteredPassword,this.password);
};
/*userSchema.pre("save",async function(next){
   let user = this as UserDocument
   if (!user.isModified('password')){
    return next();
   }
   const salt = await bcrypt.genSalt();
});
*/
//const UserModel = mongoose.model("User", userSchema)

export default mongoose.model<IUser>('User',userSchema);
