import {application , Express, Request, Response} from 'express';
import controller from "./controller/user.controller";
//import register from "./controller/user.controller";
//import login from "./controller/user.controller";
import passport from "./middleware/passportMiddleware";
import userModel from './models/user.model';

import{
    addProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
  } from "./controller/product.controller";
  

import {
    addOrderItems,
    getAllOrders,
    getOrderById,
    getMyOrders,
  } from "./controller/order.controller";
 
  import {
    addHistory,
    updateHistory,
    deleteHistory,
    getHistoryById,
  } from "./controller/history.controller";
  import {
    addInventory,
    updateInventory,
    deleteInventory,
  } from "./controller/inventory.controller";
import { required } from 'joi';
import { join } from 'path';
  

const { celebrate, Joi, Segments } = require('celebrate');

 //app.post('/signup',register);

export default function (app: Express){
    app.get('/', (req, res) => {
        res.status(200).send('ok');
    })

    app.post('/signup',celebrate({
        [Segments.BODY]:Joi.object().keys({
            name:Joi.string().required(),
            email:Joi.string().email().required(),
            password:Joi.string().min(8).max(16).required(),
            isAdmin: Joi.boolean().required()
        })
    }),controller.register);

   // app.post('/login',passport.authenticate("login",{session:false}),controller.login);
   
   app.post('/login',celebrate({
    [Segments.BODY]:Joi.object().keys({
        //name:Joi.string().required(),
        email:Joi.string().required().email(),
        password:Joi.string().min(8).max(16).required()
        //isAdmin: Joi.boolean().required()
    })
}),passport.authenticate('jwt',{session:false},controller.login));

app.get('/profile',passport.authenticate("jwt",{session:false}),(req:Request,res:Response)=>{
    return res.send(req?.user);
});

app.get('/getUserById', passport.authenticate("jwt",{session:false}), controller.getUserById);


app.post('/createProduct',celebrate({
    [Segments.BODY]: Joi.object().keys({
        product_name: Joi.string().required(),
        brand:Joi.string().required(),
        category:Joi.string().required(),
        price:Joi.number().required(),
        stock:Joi.number().required()
    })
    
}),passport.authenticate("jwt",{session:false}),addProduct);

app.get('/getAllProduct',passport.authenticate("jwt",{session:false}),getProducts);

app.patch('/updateProduct',celebrate({
    [Segments.BODY]: Joi.object().keys({
       id:Joi.string().length(24).required(),
       product_name:Joi.string(),
       brand:Joi.string(),
       category:Joi.string(),
       price:Joi.number(),
       stock:Joi.number() 

    })
}),passport.authenticate("jwt",{session:false}),updateProduct);

app.delete('/deleteProduct',celebrate({
    [Segments.BODY]:Joi.object({
        id:Joi.string().hex().length(24)
    })
}),passport.authenticate("jwt",{session:false}),deleteProduct);

app.get('/getById',celebrate({
    [Segments.BODY]:Joi.object().keys({
        id:Joi.string().hex().length(24)
    })
}),passport.authenticate("jwt",{session:false}),getProductById);


app.post('/addOrder',celebrate({
    [Segments.BODY]: Joi.object().keys({
       
        orderItems:Joi.array().items(
            Joi.object().keys({
                name:Joi.string().required().messages({'namne':"name error"}),
                qty:Joi.number().required().messages({'qty':'qty error'}),
                price: Joi.number().required().messages({'price':"price error"}),
                product_id:Joi.string().length(24).messages({'id':'id error'})
    
            
            })
        ).required().messages({'any.required':`"a" is a required field`}),
        user:Joi.string().length(24).required().messages({'user':'user error'}),
        shippingAddress:Joi.string().required(),
        paymentMethod:Joi.string().required(),
        taxPrice:Joi.number().required(),
        shippingPrice:Joi.number().required(),
        totalPrice:Joi.number().required(),
        isPaid:Joi.boolean().required(),
        paidAt:Joi.string().required(),
        isDelivered:Joi.boolean().required(),
        deliveredAt:Joi.string().required()
    })
    }),passport.authenticate("jwt",{session:false}),addOrderItems);



app.get('/getAllOrders',passport.authenticate("jwt",{session:false}),getAllOrders);


app.get('/getOrderById',celebrate({
    [Segments.BODY]:Joi.object().keys({
        id:Joi.string().length(24).required()
    })
}),passport.authenticate("jwt",{session:false}),getOrderById);

app.get('/getMyOrders',celebrate({
    [Segments.BODY]:Joi.object().keys({
        user:Joi.string().length(24).required()
    })
}),passport.authenticate("jwt",{session:false}),getMyOrders);

app.post('/addHistory',celebrate({
    [Segments.BODY]:Joi.object().keys({
        product_name: Joi.string().required(),
        price:Joi.number().required(),
        oldPrice:Joi.number().required(),
        stock:Joi.number().required(),
        outOfStock:Joi.boolean().required(),
        product_id:Joi.string().length(24).required()
    })
}),passport.authenticate("jwt",{session:false}),addHistory);

app.patch('/updateHistory',celebrate({
    [Segments.BODY]:Joi.object().keys({
        product_name:Joi.string().required(),
        price:Joi.number().required(),
        oldPrice:Joi.number().required(),
        stock:Joi.number().required(),
        outOfStock:Joi.boolean().required(),
        product_id:Joi.string().length(24).required()
    })
}),passport.authenticate("jwt",{session:false}),updateHistory);

app.delete('/deleteHistory',celebrate({
    [Segments.BODY]:Joi.object().keys({
        id:Joi.string().length(24).required()
    })
}),passport.authenticate("jwt",{session:false}),deleteHistory);


app.get('/getHistory',celebrate({
    [Segments.BODY]:Joi.object().keys({
        id:Joi.string().length(24).required()
    })
}),passport.authenticate("jwt",{session:false}),getHistoryById);



app.post('/addInventory',celebrate({
    [Segments.BODY]:Joi.object().keys({
        product_id:Joi.string().length(24).required(),
        price:Joi.number().required(),
        stock:Joi.number().required()
    
    })
}),passport.authenticate("jwt",{session:false}),addInventory);

app.patch('/updateInventory',celebrate({
    [Segments.BODY]:Joi.object().keys({
        product_id:Joi.string().length(24).required(),
        price:Joi.number().required(), 
        stock:Joi.number().required()

})
}),passport.authenticate("jwt",{session:false}),updateInventory);

app.delete('/deleteInventory',celebrate({
    [Segments.BODY]:Joi.object().keys({
        id:Joi.string().length(24).required()
    })
}),passport.authenticate("jwt",{session:false}),deleteInventory);



}