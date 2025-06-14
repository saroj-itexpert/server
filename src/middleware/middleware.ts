import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

class Middleware{
    static isLoggedIn(req: Request, res: Response, next: NextFunction){//we call NextFunction to jump sequentially
        //check if login or not 
        //accept token
       const token = req.headers.authorization
       console.log(token, "TOKEN:")
       if(!token){
        res.status(401).json({
            message: "Please provide token"
        })
        return
       }
       //token verify garne step
       jwt.verify(token, "FullStackDeveloper", (error, result)=>{
         if(error){
            res.status(404).json({
                message: "Token Invalide bhayo"
            })
         }else{
            //verififed vayo
            console.log(result,"Result aayo");
         }
       })
       next() //next halepachhi balla middleware ko function pachi arko execute garcha natra gardaina
       
    }


    
    static restrictTo(req: Request, res: Response){

    }
}

export default Middleware;