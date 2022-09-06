import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: './src/.env'});

async function connect(){

    const DB_URI =<string> process.env.DB_URI;
    try{
    await mongoose.connect(DB_URI);
    console.log('connected to DB');
    }
     catch(error){
        console.error("no Connection "+error);
        process.exit(1);
    }
}


export default connect
