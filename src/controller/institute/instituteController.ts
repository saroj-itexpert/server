import { Request, Response } from "express"
import sequelize from "../../database/connection"
import generateRandomInstituteNumber from "../../services/generateRandomInstituteNumber"
class InstituteController{
    
    static async createInstitute(req: Request , res: Response){
        try{

        const {instituteName, instituteEmail, institutePhoneNumber, instituteAddress} = req.body
        const instituteVatNo = req.body.instituteVatNo || null 
        const institutePanNo = req.body.institutePanNo || null 

        if(!instituteName || !instituteAddress || !instituteEmail || !institutePhoneNumber){
            res.status(400).json({
                message: "Please provide instituteName, instituteEmail, institutePhoneNumber & instituteAddress"
            })
            return;
        }
        //async vane= institute create garnu paryo -> institute_1231231
       //institute (Name)
     const instituteNumber = generateRandomInstituteNumber();
       await sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${instituteNumber} (
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            instituteName VARCHAR(255) NOT NULL,
            instituteEmail VARCHAR(255) NOT NULL,
            institutePhoneNumber VARCHAR(255) NOT NULL,
            instituteAddress VARCHAR(255) NOT NULL,
            institutePanNo VARCHAR(255),
            instituteVatNo VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`)
         
            await sequelize.query(`INSERT INTO institute_${instituteNumber}(instituteName,instituteEmail,
                institutePhoneNumber,instituteAddress,institutePanNo,instituteVatNo) VALUES(?,?,?,?,?,?)`,{
                    replacements: [instituteName, instituteEmail, institutePhoneNumber, instituteAddress,institutePanNo,instituteVatNo]
                })
                  res.status(201).json({
            message: "Institute created successfully!"
        });
        return;
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({
                message: "Something went wrong",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
        }
    }
}
export default InstituteController