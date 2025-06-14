import 'dotenv/config';
import {Sequelize} from 'sequelize-typescript';

//class Sequelize lai instantiate garnu paryo
//constructor lai euta object pass garam
const sequelize = new Sequelize({
    database: process.env.DB_NAME,   //database ko name
    username: process.env.DB_USERNAME,       //bydefault mysql's username = root and password =""
    password: process.env.DB_PASSWORD,           //by default password = ""
    host: process.env.DB_HOST,      //tapaiko databaseko location, kaha chha bhanne kura
    dialect: "mysql",    //database k use garna aateko  
    port: Number(process.env.DB_PORT),      //mysql kun port ma use garne ,yo string ma aucha so Number ma parse gardine
    models: [__dirname + '/models']      //current location + '/models'
});

//we need to authenticate the database connection
sequelize.authenticate().then(
    ()=>{
        console.log("Authenticated, connected");
    })
    .catch((error)=>{
        console.log(error);
    })
//database migrate garnu parchha 
sequelize.sync({alter:false}).then(()=>{
    console.log("New Changes are Migrated successfully!");
    
})
export default sequelize
