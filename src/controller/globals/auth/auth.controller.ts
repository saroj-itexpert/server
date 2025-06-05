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
import { Request, Response } from "express"
import User from "../../../database/models/user.model";
import bcrypt from "bcrypt"

class AuthController {

    static async registerUser(req: Request, res: Response) {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            res.status(400).json({
                message: "Please provide username, password email"
            })
            return;
        }
        try {
            //check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                res.status(400).json({
                    message: "User with this email already exists",
                });
                return;
            }
            //create new user
            //insert into users table
            await User.create({
                username,
                password: bcrypt.hashSync(password, 8),     //password is stored in plain text so we have to convert it into Hash using Bcrypt Package
                //2 wota tarika huncha hashing garne : 1. syncronously  2. asynchronously
                // salt value le chai kati complex, kati strong hash garne bhanne huncha
                //bcrypt le same text input diye pani hash chai different different dincha 
                email,
            });
            res.status(201).json({
                message: "User registered successfully!",
            })
        } catch (error) {
            res.status(500).json({
                message: "Error registering user",
                error: (error as Error).message,
            });
        }
    }
    static async loginUser(req: Request, res: Response ){
        const {email, password}= req.body;

        //validate input
        if(!email || !password){
            res.status(400).json({
                message: "Please provide email and password",
            });
            return;
        }
        try{
            //find user by email
            const user = await User.findOne({where : {email}});
            if(!user){
                res.status(401).json({
                    message: "Invalid email or password",
                });
                return;
            }
            //verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid){
                res.status(401).json({
                    message: "Invalid email or password",
                });
                return;
            }

            //Successful login
            res.status(200).json({
                message: "Login successful",
                user:{
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            });
        
        }catch(error){
            res.status(500).json({
                message: "Error loggin in",
                error: (error as Error).message,
            });
        }
    }

}


export default AuthController
// export {registerUser}
