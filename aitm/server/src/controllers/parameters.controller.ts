import {Request, Response, Router} from "express";

import intr from '../static/intrest.tags.json';
import domain from '../static/domain.tags.json';
import TagsDb from "../db/tags.db";

const tagsDb: TagsDb = new TagsDb('mongodb://0.0.0.0:27017/models')

export default class ParametersController {

    public router = Router();

    constructor() {

        tagsDb.updateTags("intr",intr)
        tagsDb.updateTags("domain",domain)

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
            tagsDb.findTag(req.params.tagtype)
                .then(result => res.status(201).json(result))
                .catch(err => res.status(500).json(err))
        } else {
            tagsDb.findAllTags()
                .then(result => res.status(201).json(result))
                .catch(err => res.status(500).json(err))
        }
    }

}
