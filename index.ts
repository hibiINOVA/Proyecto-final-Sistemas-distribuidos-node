import ServerConfig from "./config/server/ServerConfig";
import cors from "cors";

const server = ServerConfig.instance;

// CORS
server.app.use(cors());

// Start
server.start();
