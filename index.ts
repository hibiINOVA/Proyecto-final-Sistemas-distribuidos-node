import ServerConfig from "./config/server/ServerConfig";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes/AuthRoutes";

const server = ServerConfig.instance;

// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// CORS
server.app.use(cors());

server.app.use('/auth', router);

// Start server
server.start(() => {
    console.log(`Server running on port ${server.port}`);
});