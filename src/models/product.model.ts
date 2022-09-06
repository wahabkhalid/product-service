import mongoose from "mongoose";
//import { string } from "zod";
import { IUser } from "./user.model";

export interface IProduct extends mongoose.Document{
    product_id:string;
    product_name: string;
    brand: string;
    category: string;
    price:number;
    stock:number;
   // inventory_id:any;


}

const productSchema = new mongoose.Schema(
    {
        /*productId:{
            type: String,
            required:true,
            unique:true
        },*/

    product_id:{type: String,unique:true },
    product_name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock:{ type: Number, required: true },
    //inventory_id:{type:mongoose.Schema.Types.ObjectId,ref:'Inventory'},
        
        
        
    },
    {
        timestamps:true,
    },
);
productSchema.set("toJSON", {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  });
      

const Product = mongoose.model<IProduct>("Product",productSchema);
export default Product;