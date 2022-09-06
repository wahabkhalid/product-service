import mongoose from "mongoose";
//import { string } from "zod";
import  Product  from "./product.model";

export interface IInventory extends mongoose.Document{
    product_id: string,
    price: Number,
    stock:number,
    
   // createdAt: Date;
    //updatedAt:Date;


}

const inventorySchema = new mongoose.Schema(
    {
        /*productId:{
            type: String,
            required:true,
            unique:true
        },*/

        product_id:{type:String,required:true},
        price:{type:Number,required:true},
        
        stock: { type: Number, required: true },
        
        
        
        
    },
    {
        timestamps:true,
    },
);

  inventorySchema.set("toJSON",{
    transform: function (doc,ret){
        ret.id = ret._id;
        delete ret._id;
        delete ret._v;
    }
  });

const Inventory = mongoose.model<IInventory>("Inventory",inventorySchema);


export default Inventory;
