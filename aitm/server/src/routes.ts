import express, {Application, Router} from "express";
import cors, {CorsOptions} from "cors";
import home from "./controllers/home";
import tutorialRoute from "./controllers/tutorial";
import UserController from "./controllers/user.controller";
import ParameterController from "./parameters/parameter.controller";

import {auth} from 'express-oauth2-jwt-bearer';

import helmet from "helmet";
import morgan from "morgan"

import authConfig from '../../auth_config.json';

export default class Routes {

    constructor(app: Application) {

        const checkAuth = auth({
            audience: authConfig.authorizationParams.audience,
            issuerBaseURL: `https://${authConfig.domain}`,
        })

        app.use(
            cors({
                origin: authConfig.appUri,
            })
        );
        app.use(helmet());
        app.use(morgan('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.use("/api", home);
        app.use("/api/tutorials", tutorialRoute);

        //app.use("/api/users", new UserController(checkAuth).router);
        app.use("/api/users", new UserController().router);
        app.use("/api/parameters", new ParameterController().router);

    }

}