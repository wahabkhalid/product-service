import express ,{Request,Response} from 'express';

import Product from '../models/product.model';
import {IInventory } from '../models/inventory.model';
import Inventory from '../models/inventory.model';


const addInventory = async(req:Request,res:Response)=>{
    try{
        console.log("add inventory function calling..");
        console.log(req.body)
        const inventory:IInventory|any=new Inventory(req.body);
        const product = await Product.findOne({id:req.body.product_id});

        console.log(product);

        if(product){
            console.log('asdasd')
            const result = await inventory.save();
            console.log('nope')
            if(result===null){
               return res.sendStatus(500);
            }else{
                return res.status(201).json({status:201,data:result});
            }
        } else{
            return res.status(500).json({sucess: false, message: "Something went wrong."});
        }
    }catch(error:any){
        console.log(error);
        return res.json({
            message:"Inventory nod addded",
            success:false
        })
    }
};

const updateInventory = (async (req:Request,res:Response)=>{
     try{
        const {id} = req.body as {id:string};
        const {price,stock}=req.body as {
            price:number;
            stock:number;
        };

        const product = await Product.findOneAndUpdate({id});

        if(product){
            const inventory = new Inventory();
            inventory.price=price;
            product.price=price;
            inventory.stock=stock;
            product.stock=stock;

            const updatedProduct = await product.save();
            const updatedInventory = await inventory.save();

            res.status(201).json({
                message:'Inventory updated!',
                success:true
              });
        }else {
            res.status(404);
            throw new Error("Product not found.");
          }
     }catch(error:any){
        return res.json({
          message:"Something is not valid!",
          success:false
        })
      }
});


const deleteInventory = (async (req:Request,res:Response)=>{
    try{ 
        const {id} = req.body as {id:string};
        const inventory = await Inventory.findOne({id});

        if(inventory){
            await inventory.remove();
            res.json({messsage:"Inventory removed",success:true});
        }else{
            res.status(404);
            throw new Error("Inventory not found");
        }


    }catch(error:any){
        return res.json({
            message:"something is not valid",
            success:false
        })

    }
});

export {addInventory,updateInventory,deleteInventory};
