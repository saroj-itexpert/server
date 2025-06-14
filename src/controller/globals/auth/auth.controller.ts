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
import jwt from "jsonwebtoken"

import { v4 as uuidv4 } from 'uuid';
import rateLimit from "express-rate-limit";

//basic login : username, password 
/*
    k bata login garaune bhanne bare clarify garnu paryo 
    if email, password ho ki oauth ho ki ? 
    email, password --> data accept --> validation --> 
    First check email exists or not (verify) --> yes --> check password now--> milyo-->
    token generation (jsonwebtoken)
*/
//oauth  google login, fb, github, apple 3rd party through login garaune
// email login (SSO)

      //we can also use findAll 
            // const data = await User.findAll({ where: email });
            // if (data.length == 0) {
            //     res.status(404).json({
            //         message: "Not Registered!"
            //     })
            // }
class AuthController {
    private static readonly JWT_SECRET = process.env.JWT_SECRET || "topsecret";
    private static readonly RESET_TOKEN_EXPIRY = 3600000; // 1 hour in milliseconds

// New method to validate password strength
    private static validatePasswordStrength(password: string): { isValid: boolean; message: string } {
        // Password must be at least 8 characters, include uppercase, lowercase, number, and special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (!passwordRegex.test(password)) {
            return {
                isValid: false,
                message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
            };
        }
        return { isValid: true, message: "Password is strong" };
        
    }





    static async registerUser(req: Request, res: Response) {
        
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            res.status(400).json({
                message: "Please provide username, password email"
            })
            return;
        }
        // Validate password strength
        const passwordCheck = this.validatePasswordStrength(password);
        if (!passwordCheck.isValid) {
            res.status(400).json({
                message: passwordCheck.message,
            });
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
    static async loginUser(req: Request, res: Response) {
        const { email, password } = req.body;      //req.body bata data aaucha
        //validate input
        if (!email || !password) {
            res.status(400).json({
                message: "Please provide email and password",
            });
            return;     //if pachhi else lekhnu chhaina bhane return gare pugcha
            //check if email exist or not in our users table
        }
        try {
            //find user by email, check if user exists or not in our users table
            const user = await User.findOne({ where: { email } }); //equivalent to SELECT * FROM User WHERE email="saroj@example.com" AND age = 32;   
            if (!user) {
                res.status(401).json({
                    message: "Invalid email or password",
                });
                return;
            }
            //verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({
                    message: "Invalid email or password",
                });
                return;
            }
            //Generate JWT Token
            const token = jwt.sign(
                {
                    id: user.id, email: user.email,
                },
                AuthController.JWT_SECRET,
                { expiresIn: "1h" }
            );
            //Successful login
            res.status(200).json({
                message: "Login successful",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
                token,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error loggin in",
                error: (error as Error).message,
            });
        }
    }
    static async logoutUser(req: Request, res: Response) {
        //Since JWT is stateless, logout is typically handled client-side by removing the token 
        //Optionally, you can maintain a token blacklist in the database for invalidation
        res.status(200).json({
            message: "Logout successful. Please remove the token from client storage",
        });
    }


    static forgotPasswordLimiter = rateLimit({
        windowMs: 15 * 60 * 100,    //15 minutes
        max: 5,     //limit to 5 requests per window
        message: 'Too many password reset requests, please try again later/'
    });

    static async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({
                message: "Please provide an email",
            });
            return;
        }

        try {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                res.status(404).json({
                    message: "User with this email does not exist",
                });
                return;
            }

            // Generate a reset token
            const resetToken = uuidv4();
            const resetTokenExpiry = Date.now() + AuthController.RESET_TOKEN_EXPIRY;

            // Store reset token and expiry in the database
            await User.update(
                { resetToken, resetTokenExpiry },
                { where: { email } }
            );

            // Simulate sending email with reset token (actual implementation requires an email service)
            console.log(`Reset token for ${email}: ${resetToken}`);
            // Example: Use a service like Nodemailer or a third-party service (SendGrid, AWS SES) to send email

            // Note: Add rate limiting here to prevent abuse (e.g., using redis or a rate-limiter middleware)

            res.status(200).json({
                message: "Password reset token sent to email",
            });
        } catch (error) {
            res.status(500).json({
                message: "Error processing forgot password request",
                error: (error as Error).message,
            });
        }

    }

static async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        res.status(400).json({
            message: "Please provide reset token and new password",
        });
        return;
    }

    // Validate new password strength
    const passwordCheck = this.validatePasswordStrength(newPassword);
    if (!passwordCheck.isValid) {
        res.status(400).json({
            message: passwordCheck.message,
        });
        return;
    }

    try {
        // Find user by reset token
        const user = await User.findOne({ where: { resetToken: token } });

        if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
            res.status(400).json({
                message: "Invalid or expired token",
            });
            return;
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and remove reset token and expiry
        await User.update(
            {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
            { where: { id: user.id } }
        );

        res.status(200).json({
            message: "Password has been reset successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error resetting password",
            error: (error as Error).message,
        });
    }
}


}
export default AuthController
// export {registerUser}
