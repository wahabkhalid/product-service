
import mongoose from 'mongoose';
import {IHistory} from '../models/history.model';
import {Request,Response} from 'express';

import History from '../models/history.model';
import Product from '../models/product.model';
//import { Aggregate } from 'mongoose';


const addHistory = async (req:Request,res:Response)=>{
    try{

        console.log("addHistory function calling...")
        let{product_name,oldPrice,price,outOfStock,stock,product_id}=req.body;
        let _id = product_id;
        const history:IHistory|any = new History({product_name,oldPrice,price,outOfStock,stock,product_id});
        const product=await Product.findById({_id});
        if(product && oldPrice===product.price){
            history.oldPrice = product.price;
            product.price=price;
            product.stock = history.stock;
            
            const result = await history.save();
            const resPro = await product.save();

            if(result ===null){
                return res.sendStatus(500);

            }
            else{
                return res.status(201).json({status:201,data:result});
            }
        }else{
            return res.status(422).json({
                message:"invalid entries"
            });
        }

    }

    catch(error :any){
        return res.json({
            message: "History not added ==> "+error,
            success:false
        })

    }
};

const updateHistory = (async(req:Request,res:Response) =>{
    try{

    const {product_name,price,oldPrice,stock,outOfStock,product_id} =req.body as {
        product_name: string;
        price:number;
        oldPrice:number;
        stock:number;
        outOfStock:boolean;
        product_id:string;
    };

    const product = await Product.findOne({product_id});

    if(product) {
        console.log('ok')
        const history = new History();
        history.product_name = product_name;
        product.price = price;
        product.stock = stock;
        history.price = price;
        history.oldPrice = oldPrice;
        history.outOfStock = outOfStock;

        const updatedProduct = await product.save();
        const updatedHistory = await history.save();
        res.status(201).json({
            message:"History Updated",
            success: true
        });
    } else{
        res.status(404);
        throw new Error("Product not found.");

    }

    }
    catch(error:any){
        return res.json({
            message:"something is not valid ==> "+error,
            success: false
        })

    }
});


  const deleteHistory = (async (req:Request,res:Response)=>{
    try{
        const {id} = req.body as {id:string};
        const history = await History.findOne({id});

        if(history){
            await history.remove();
            res.json({
                message:"History removed",
                success: true
            });
        } else{
            throw new Error("History not found");
        }

    }
    catch(error:any){
        res.json({
            message:"something is not valid ==> "+error,
            success: false
        })

    }
  });

   
   const getHistoryById = (async(req:Request,res:Response):Promise<void> =>{
    try{

        const {id} = req.body as {id:string};
        const product = await Product.find({id});
        if(!product){
            res.status(404);
            throw new Error("prodcut not found");
        }
        res.json(product);

    }
    catch(error:any){
        res.json({
            message:"something is not valid ==> "+error,
            success: false
        })

    }
   });

   export{addHistory,updateHistory,deleteHistory,getHistoryById};