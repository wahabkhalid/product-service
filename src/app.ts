import express from "express";
import connect from "./db/connect";
import dotenv from 'dotenv';
//import logger from "./utils/logger";
//import routes from "./routes";
import routes from './routes';
import cors from 'cors';
import bodyParser from 'body-parser';
import {errors} from'celebrate';
import sessionMiddleware from "./middleware/sessionMiddleware";
import passport from "passport";
import session from 'express-session';
import MyPassport from './middleware/passportMiddleware';

dotenv.config({path: './src/.env'});
const port=process.env.PORT;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true})); 
app.use(express.urlencoded({extended:true}));
app.use(sessionMiddleware);
app.use(MyPassport.initialize());
app.use(MyPassport.session());
app.use(cors());
//app.use(bodyParser.json());

app.use(errors());
routes(app);


app.listen(port, async() =>{
    //console.log("App is running at port = "+port);
     console.log(`App is running at http://localhost:${port}`);
    await connect();
})