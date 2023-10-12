import {Request, Response, Router} from "express";
import MongoHelper from "../db/mongo.helper"

import intr from './intr.tags.json';
import domain from './domain.tags.json';

const mongoHelper: MongoHelper = new MongoHelper('mongodb://0.0.0.0:27017/models')

export default class ParameterController {

    public router = Router();

    constructor() {

        mongoHelper.updateTags("intr",intr)
        mongoHelper.updateTags("domain",domain)

        this.router.get("/", function(req: Request, res: Response): Response {
            return res.json({
                message: "Welcome to parameter api",
                entries: [
                    {url: "/tags/[tagtype]"},
                    {url: "/tags"}
                ]
            });
        });
        this.router.get("/tags", this.getTags);
        this.router.get("/tags/:tagtype", this.getTags);

    }

    getTags(req: Request, res: Response) {
        if(req.params.tagtype) {
            mongoHelper.findTag(req.params.tagtype)
                .then(result => res.status(201).json(result))
                .catch(err => res.status(500).json(err))
        } else {
            mongoHelper.findAllTags()
                .then(result => res.status(201).json(result))
                .catch(err => res.status(500).json(err))
        }
    }

}
