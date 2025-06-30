import express, { Router } from "express"
import cors from "cors"
import path, { dirname } from "path"
import { config } from "./src/config/config";
import { readdirSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors({
    origin: '*',
    allowedHeaders: "token",
    methods: 'get,post,patch'
}));
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({
    extended: true,
    parameterLimit: 50,
    limit: '50mb'
}));
app.use(express.static("./public"));
app.set("views", path.join(process.cwd(), "views"))
const onError = (err: any) => {
    if (err.code == "EADDRINUSE") {
        console.error("Port already in use");
        process.exit(0)
    } else {
        console.error(err);
        process.exit(1)
    }
}
(
    async () => {
        try {
            /************Route Registration start ********************/
            const routesPath = path.join(process.cwd(), 'src/routes')
            readdirSync(routesPath).forEach(async(file) => {
                const routePath = path.join(routesPath, file)
                const filePath = path.join(__dirname,'src/routes', config.server.nodeEnvironment == "production" ? file.replace('.ts', '.js') : file); // Adjust the join path based on your project structure
                const fileUrl = pathToFileURL(filePath);
                const routeModule = await import(fileUrl.href);
                
                if (routeModule.default && typeof routeModule.default === 'function') {
                    app.use('', routeModule.default);
                } else {
                    console.error(`Invalid route module: ${file}. It should export a default function (router).`);
                }
            })
            /************Route Registration End *********************/
            app.listen(config.server.port)
            app.on("error", onError)
            console.log(`Server is running over port ${config.server.port}`);

        } catch (err) {
            console.log(err,'rrrrrrrrrrrrrrr');
            
            console.error(err)
        }
    }
)();