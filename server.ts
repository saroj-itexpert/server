import app from "./src/app";
import { envConfig } from "./src/config/config";
import { config } from "dotenv";

config()
function startServer(){
    const port = envConfig.portNumber
    app.listen(port, function(){
        console.log(`Server has started at port ${port}`);
    })
}

startServer()