import {Request, Response, Router} from "express";

class UserController {

    router = Router();
    async findOne(req: Request, res: Response) {
        try {
            res.status(200).json({
                message: "findOne OK",
                reqParamId: req.params.id
            });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            });
        }
    }

    async create(req: Request, res: Response) {
        try {
            res.status(201).json({
                message: "create OK",
                reqBody: req.body
            });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            });
        }
    }

    async update(req: Request, res: Response) {
        try {
            res.status(200).json({
                message: "update OK",
                reqParamId: req.params.id,
                reqBody: req.body
            });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            res.status(200).json({
                message: "delete OK",
                reqParamId: req.params.id
            });
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error!"
            });
        }
    }

    constructor() {
        this.router.get("/", function(req: Request, res: Response): Response {
            return res.json({ message: "Welcome to user api" });
        });
        this.router.get("/findOne", this.findOne);
        this.router.post("/create", this.create);
        this.router.put("/update", this.update);
        this.router.delete("/delete", this.delete);

    }
}

export default new UserController().router;