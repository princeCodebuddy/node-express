import express, { Request, Response, Router } from "express"
import cors from "cors"
import path, { dirname } from "path"
import { readdirSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { config } from "../src/config/config";
import authMiddleware from '../src/middleware/auth';
// const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
globalThis.auth=authMiddleware();
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
app.use(auth.initialize());
app.use(async (req: Request, res: Response, next) => {
    const authMiddlewarePath = path.join(process.cwd(), 'src/middleware',config.server.nodeEnvironment == "production" ?'auth.js': 'auth.ts');
    const authMiddleware = (await import(pathToFileURL(authMiddlewarePath).href)).default;
    authMiddleware(req, res, next);
    next();
});
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
            for (const file of readdirSync(routesPath)) {
                const filePath = path.join(
                    process.cwd(),
                    'src/routes',
                    config.server.nodeEnvironment === 'production' ? file.replace('.ts', '.js') : file
                );
                const fileUrl = pathToFileURL(filePath);
                const routeModule = await import(fileUrl.href);
                if (routeModule.default && typeof routeModule.default === 'function') {
                    app.use('', routeModule.default);
                } else {
                    console.error(`Invalid route module: ${file}`);
                }
            }

            /************Route Registration End *********************/
            app.listen(config.server.port)
            app.on("error", onError)
            console.log(`Server is running over port ${config.server.port}`);

        } catch (err) {
            console.log(err, 'rrrrrrrrrrrrrrr');

            console.error(err)
        }
    }
)();
export default app;