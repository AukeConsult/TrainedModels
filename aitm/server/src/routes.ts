import express, {Application, Router} from "express";
import cors, {CorsOptions} from "cors";
import home from "./controllers/home";
import tutorialRoute from "./controllers/tutorial";
import userController from "./controllers/user";
export default class Routes {

    constructor(app: Application) {

        const corsOptions: CorsOptions = {
            origin: "http://localhost:8081"
        };

        app.use(cors(corsOptions));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.use("/api", home);
        app.use("/api/tutorials", tutorialRoute);
        app.use("/api/users", userController);

    }

}