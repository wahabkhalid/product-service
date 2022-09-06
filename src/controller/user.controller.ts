import { NextFunction,Request,Response } from "express";
import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
import bcrypt from 'bcrypt';
import path from 'path';
import User,{IUser} from '../models/user.model';
import dotenv from 'dotenv';

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-Handler';


const register = (req: Request,res: Response)=>{
    console.log('calling!!');
    let {name ,email,password,isAdmin} = req.body;

    bcryptjs.hash(password,10,(hashError,hash)=>{
        if(hashError){
            return res.status(401).json({
                message: hashError.message,
                error:hashError
            });
        }

        const _user:IUser = new User({
            _id: new mongoose.Types.ObjectId(),
            name,
            email,
            password:hash,
            isAdmin,
        })

       const token = jwt.sign(_user.toJSON(),'secrettoken',{expiresIn:process.env.SERVER_TOKEN_EXPIRETIME}); 

       return _user
       .save()
       .then((user:IUser)=>{
        if(isAdmin===true){
            return res.status(201).json({
                user,
                success:true,
                token:token,
                message:"Admin registered successfully"
            })
        }else{
            return res.status(201).json({
                user,
                success:true,
                token:token,
                message:"User registered succesfully"
            })
        }
    
        
       }).catch((error:any)=>{
        return res.status(500).json({
            message: error.message,
            error
        });
       });
    });
};

const login = (req:Request,res:Response)=>{
    const email = req.body.email
    const password = req.body.password
     console.log('hii');
    User.findOne({email})
        .then(user =>{
            if(!user) return res.status(400).json({msg:"User does not exist"});

            bcrypt.compare(password, user.password,(err,data)=>{
                if(err) throw err

                if (data){
                    
                    const payload ={
                        id: user._id,
                        name: user.name,
                        email:user.email
                    };
                    jwt.sign(
                        payload,
                        'mySecret',
                        {expiresIn:3600},
                        (err,token)=>{
                            return res.status(201).json({
                                message: `User id: ${user._id} Email: ${user.email}`,
                                succcess:true,
                                token: token
                            });
                        }
                    );

                }else{
                    return res.status(401).json({msg:"invalid credential"})
                }

            });
        });

}
   
    const profile = (req:Request,res:Response)=>{
        const email = req.body.email
        const password = req.body.password
        const isAdmin = new Boolean (req.body.isAdmin);

        if(isAdmin===true){
            User.findOne({email})
               .then(user=>{
                if (!user)return res.status(400).json({msg:"Admin does not exis"});

                bcrypt.compare(password,user.password,(err,data)=>{
                    if(err) throw err

                    if(data){

                        const payload = {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            isAdmin:user.isAdmin
                
                        };
                        jwt.sign(
                            payload,
                            'adminSecret',
                            {expiresIn: 3600},
                            (err,token)=>{
                                res.json({
                                    message: `User id: ${user._id} Email: ${user.email} Admin:${user.isAdmin}`,
                                    success: true,
                                    token: token
                                });
                            }
                        );


                    }else{
                        return res.status(401).json({msg:"Invalid credential"})
                    }
                });



               });
        }
        else{
            User.findOne({email})
            .then(user=>{
                if(!user) return res.status(400).json({msg:"admin does not exis"});

                bcrypt.compare(password,user.password,(err,data)=>{
                    if (err) throw err

                    if(data){
                        const playload = {
                            id: user._id,
                            name: user.name,
                            email:user.email,
                            isAdmin:user.isAdmin
                        };
                        jwt.sign(
                            playload,
                            'userSecret',
                            {expiresIn: 3600},
                            (err,token)=>{
                                res.json({
                                    message:`User id :${user._id} Email:${user.email} Admin:${user.isAdmin}`,
                                    success: true,
                                    token: token
                                });
                            }
                        );
                    }else{
                        return res.status(401).json({msg:"invalid credential"})
                    }
                });
            });
    
        }
    }


    const getUserById = (

        async (req: Request, res: Response): Promise<void> => {
          try{
          const { id } = req.body as {id: string };
          console.log(id);
          const user:IUser|any = await User.findById({_id: id});
          if (!user) {
            res.status(404);
            throw new Error("user not found");
          }
          res.json(user);
        }
      catch(error:any){
         res.json({
          message:"Something is not valid!",
          success:false
        })
      }
      });

export default {register,login,profile,getUserById};