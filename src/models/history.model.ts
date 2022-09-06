import mongoose from "mongoose";
//import { string } from "zod";
import Product  from "./product.model";

export interface IHistory extends mongoose.Document{
    product_name:string;
    price:number;
    oldPrice:number;
    product_id:string;
    outOfStock:boolean;
    stock:number;


}

const historySchema = new mongoose.Schema(
    {
        /*productId:{
            type: String,
            required:true,
            unique:true
        },*/

        product_id:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
        product_name:{type:String,required:true},
        stock: { type: Number, required: true },
        outOfStock:{type:Boolean,required:true},
        price: { type: Number, required: true ,default:0},
        oldPrice: { type: Number, required: true ,default:0},
        
        
        
    },
    {
        timestamps:true,
    }
);

historySchema.set("toJSON",{
    transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
})

const History = mongoose.model<IHistory>("History",historySchema);


export default History;
