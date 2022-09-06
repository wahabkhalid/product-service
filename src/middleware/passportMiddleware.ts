import passport from 'passport';
import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import User, { IUser } from '../models/user.model';
import controller from '../controller/user.controller';
import dotenv from 'dotenv';
dotenv.config()
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;


passport.use('login',new LocalStrategy({
    usernameField:"email",
    passwordField:"password",
},
   async (email,password,done)=>{
    const user = await User.findOne({email});

    if(user && await (user.matchPassword(password)))done(user,null);
    else done(null,false);
   }
));

passport.use('signup',new LocalStrategy({
    usernameField:"email",
    passwordField:"password",
},
  async (email,password,done)=>{
    const user = await User.findOne({email});

    if(!user){
        return done(user,null);
    }
    else{
        return done(null,false);
    }
  }
));

passport.use("jwt",new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SERVER_TOKEN_SECRET
    }, 
    function (jwt_payload,done){
        User.findById({_id:jwt_payload.id}, function(err:any,user:IUser){
            if(err){
                return done(err,false);
            }
            if(!user){
                return done(null,false)
            }
            console.log(user);
            return done(null,user)
        });
    }
));


passport.deserializeUser(async(id:string,done:any)=>{
    try{
        const user = await User.findById(id);
        done(null, user);
    }catch(error){
        done(error);

    }
});

passport.serializeUser((user:any,done)=>{
    done(null,{_id:user._id});
});


export default passport;



