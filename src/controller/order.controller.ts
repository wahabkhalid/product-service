
import Order from "../models/order.model";
import asyncHandler from "express-async-handler";

import { Request,response,Response } from "express";
import {IOrder,IOrderItems} from "../models/order.model"

import { ObjectId } from "mongoose";


const addOrderItems = (async(req:any,res:Response):Promise<void>=>{
    try{
        console.log("function addOrderItems calling..");

        const {
            orderItems,
            user,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid,
            paidAt,
            isDelievered,
            delieveredAt
        }:{
      orderItems: IOrderItems[];
      user:string;
      shippingAddress: string;
      paymentMethod: string;
      taxPrice: number;
      shippingPrice: number;
      totalPrice: number;
      isPaid:boolean;
      paidAt:string;
      isDelievered:boolean;
      delieveredAt:string;
        } = req.body;


        if(orderItems && orderItems.length === 0){
            res.status(400);
            throw new Error("NO ORDER ITEMS ");
        }else{
            const order = new Order({

                orderItems,
                user,
                shippingAddress,
                paymentMethod,
                taxPrice,
                shippingPrice,
                totalPrice,
                isPaid,
                paidAt,
                isDelievered,
                delieveredAt

            });
            const createOrder = await order.save();
            res.status(201).json(createOrder);

        }
        

    }

    catch(error:any){
        res.json({
            message:"Invalid Entry",
            success:false
        });

    }
});


 const getOrderById =(async (req:Request,res:Response):Promise<void>=>{
    try{
        let{id} = req.body as {id:String}
        const order:IOrder|any = await Order.findOne({id})
        if(!order){
            res.status(404).json({
                message:'Order not found against Id = '+id,
            })
        }
        res.status(200).json(order);


    }
    catch(error:any){

        res.json({
            message:"Something is not valid "+error,
            success:false
        })

    }
 });

 const getMyOrders = ( async(req:Request,res:Response):Promise<void>=>{
    try{ 
        const orders:(IOrder &{_id:ObjectId;}) [] = await Order.find({user:req.body.id});

        if(orders){
            res.json(orders);

        }
        else{
            res.json({
                message:"Order not found",
                success:false
            })
        }


    }
    catch(error:any){
        res.json({
            message:"something is not valid ==> "+error,
            success:false
        })

    }
 });


  const getAllOrders = asyncHandler(async({},res:Response):Promise<void>=>{
    const orders:any[] = await Order.find().populate("user","id name");
    res.json(orders);
  });

  export {addOrderItems,getAllOrders,getMyOrders,getOrderById};
