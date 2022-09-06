import Product from "../models/product.model";
import { Request,Response } from "express";
import { ObjectId } from "mongoose";
import { IProduct } from "../models/product.model";
import Inventory,{IInventory} from "../models/inventory.model";
import { any } from "joi";
import { match } from "assert";


const addProduct = async (req:Request,res:Response)=>{
    try{
        let{product_name,brand,category,price,stock}=req.body;
        const newProduct:IProduct = new Product({product_name,brand,category,price,stock});
        //const newInventory:IInventory|any = new Inventory({price,stock});
        
        const product = await newProduct.save();

        //const inven = await newInventory.save();
        if(product !=null){
            res.status(201).json({status:201,data:product});
        }

        else{
            res.sendStatus(422);
        }
    }catch(error:any){
        return res.json({
            message:"something is not valid => "+error,
            success: false
        })
    }
}


const updateProduct = (async (req:Request,res:Response)=>{
    try{
        const {product_id} = req.body as {product_id:string};

        const {product_name,brand,category,price,stock} = req.body as{
            product_name :string;
            price:number;
            brand:string
            category:string;
            stock:number
        };
        const inventory = await Inventory.findOne({product_id});

        const product = await Product.findOne({product_id});
        if( product && inventory){
            product.product_name =product_name;
            product.price=price;
            product.brand = brand; 
            product.category = category;
            product.stock=stock;
            inventory.price=product.price;
            inventory.stock=product.stock;

            const updatedProduct= await product.save();
            const updatedInventory = await inventory.save();
            res.status(201).json(`Updated Product and Inventory:${updatedProduct},${updatedInventory}`);

        } else {
            res.status(404);
            throw new Error("Product not found.");
          }
    } catch (error:any){
        return res.json({
            message:"Something is not valid dut to "+error,
            success:false
          })

    }
});


const getProducts =(async(req:Request,res:Response): Promise<void>=>{
    try{

        const pageSize = 10;
        const page: number = Number(req.query.pageNumber) || 1;
        const keyword:any = req.query.keyword?
        {
            name:{
                $regex:req.query.keyword,
                $options:"i",
            },
        }
        :{};
        const count: number = await Product.countDocuments({...keyword});
        const  products:(IProduct & {
            _id: ObjectId;
        })[] = await Product.find({...keyword})
        .limit(pageSize)
        .skip(pageSize * (page-1));

        res.json({products,page,pages: Math.ceil(count/pageSize)});
    } 
    catch(error:any){
        res.json({
            message:"something is not valid",
            success:false
        })

    }
});

const getProductById=( async (req:Request,res:Response):Promise<void>=>{
    try{
        const {id} = req.body as {id:string};
        const product = await Product.find({id});
        if(!product){
            res.json(404);
            throw new Error("Product not found");
        }
        res.json(product);

    }

    catch(error :any){
        res.json({
            message:"Something is not valid",
            success: false
        })

    }
});

const deleteProduct = (async (req:Request,res:Response)=>{
    try{

        const {product_id} = req.body as {product_id:string};
        const product = await Product.findOne({product_id});
        const inventory = await Inventory.findOne({product_id});

        if(product && inventory){
            await product.remove();
            await inventory.remove();
            res.json({
                message:"Product Removed",
                success: true
            });
        }
        else{
            res.status(404);
            throw new Error("Product not found");
        }

    }
    catch(error:any){
        return res.json({
            message:"somethng is not valid",
            success:false
        })

    }
});

export {getProductById,getProducts,updateProduct,addProduct,deleteProduct}

