//individual feature haru globals/auth yo folder ma rakhchhau

/*
    REGISTER/SIGNUP
    to implement: 
    1. incoming data --> username, email, password aauna sakla user bata analysis garne bujhne
    yo data store garna lai table ma yo columns haru chha ki chhaina check garne

    2. processing/checking--> email valid, compulsory data aaunu paryo 

    3. db query --> table ma insert/read/delete/update garne kaam garne 


    1. functional based 2. class based approach
    
    1. FUNCTIONAL BASED;

    
    LOGIN/SIGNIN
    LOGOUT
    FORGOT PASSWORD
    RESET PASSWORD/OTP

*/
import { Request, Response } from "express"
import User from "../../../database/models/user.model";
import bcrypt from "bcrypt"
//json data --> req.body // username, email, password haru aaucha
//files -->req.file // files
/*
const registerUser = (req:Request, res: Response)=>{
//duita kura aauchha
//1. request    2. response aucha 3.next pani aaucha but aile request, response chaincha

const {username, password, email} = req.body;
if(!username || !password || !email){
    res.status(400).json({
        message: "Please provide username, password email"
    })
}else{
    //insert into users table
    User.create({
        username: username,
        password: password,
        email: email
    })
    res.status(200).json({
        message: "User Registered Successfully!"
    })
}
//BOLA - BROKEN OBJECT LEVEL AUTHORIZATION

} */


class AuthController {

    static async registerUser(req: Request, res: Response) {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            res.status(400).json({
                message: "Please provide username, password email"
            })
            return
        } else {
            //insert into users table
            User.create({
                username: username,
                password: bcrypt.hashSync(password, 8),     //password is stored in plain text so we have to convert it into Hash using Bcrypt Package
                //2 wota tarika huncha hashing garne : 1. syncronously  2. asynchronously
                // salt value le chai kati complex, kati strong hash garne bhanne huncha
                //bcrypt le same text input diye pani hash chai different different dincha 
                email: email
            })
            res.status(200).json({
                message: "User Registered Successfully!"
            })
        }

    }
}

export default AuthController
// export {registerUser}
