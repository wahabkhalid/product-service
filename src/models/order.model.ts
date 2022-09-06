import mongoose from "mongoose";
//import { string } from "zod";
import  Product from "./product.model";
import { IUser } from "./user.model";

interface IOrderItems extends Document {
    name: string;
    qty: number;
    price: number;
    product: string;
  }


 interface IOrder extends mongoose.Document{

    user: string;
    orderItems: IOrderItems[];
    shippingAddress:string;
    paymentMethod: string;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt: any;
    isDelivered: boolean;
    deliveredAt: any;
 
    


}

const orderSchema = new mongoose.Schema(
    {
     //   orderId:{
       //     type: String,
         //   required:true,
        //    unique:true
        //},

        user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
        orderItems:[
            {
                name: {type:String,required:true},
                qty: { type: Number, required: true },
                price: { type: Number, required: true },
                product_id:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"Product"},
            },
        ],

        shippingAddress:{type:String,required:true},
        paymentMethod:{type:String,required:true},
        taxPrice:{type:Number,required:true,default:0.0},
        shippingPrice:{type:Number,required:true,default:0.0},
        totalPrice:{type:Number,required:true,default:0.0},
        isPaid:{type:Boolean,required:true,default:false},
        paidAt:{type:String},
        isDelivered:{type:Boolean,required:true,default:false},
        deliveredAt:{type:String},   
        
    },
    {
        timestamps:true,
    }
);


 orderSchema.set("toJSON",{
    transform:function(doc,ret){
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
 });
const Order = mongoose.model<IOrder>("Order",orderSchema);

export default Order;
export{IOrder,IOrderItems};
