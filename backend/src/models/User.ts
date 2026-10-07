import { Schema,model,Document } from "mongoose";
import { userInfo } from "node:os";

export interface IUser extends Document{
    name:string;
    email:string;
    password?:string;  // Optional rakha hai kyunki selective queries me password omit hota hai
    role:"admin"|"user";
    createdAt:Date;
    updatedAt:Date;

}

// datebase me save hone ke rune userSchema

const userSchema = new Schema <IUser>(
    {
        name:{
            type : String,
            required : [true,'name jaruri h '],
            trim:true,
        },

        email:{
            type : String,
            required:[true,'email jaruri h '],
            unique:true,
            lowercase: true,
            trim: true,},
password: {
      type: String,
      required: [true, 'Password zaroori hai'],
      select: false, // Security: Queries me by-default password return nahi hoga
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

  },
        
    
   {
    timestamps: true, // Auto-creates createdAt and updatedAt fields
  }
  
  
    
);

export const User = model<IUser>('User', userSchema);