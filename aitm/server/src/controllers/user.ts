import {Request, Response, Router} from "express";
import MongoHelper from "../db/mongo.helper"

const mongo: MongoHelper = new MongoHelper()

function updateAuthUser(user: any) {
    return mongo.findOneAndUpdate("users",
        {userid: user.userid},
        {
            userid: user.userid,
            nickname: user.nickname,
            profile: {
                fullname: user.nickname,
                intro: "",
                authProfile: user.authProfile,
                interests: [
                    "training",
                    "development",
                    "sales",
                    "consultancy"
                ]
            }
        },
        (retObject: any) => {
        return {
            new: !retObject.lastErrorObject?.updatedExisting,
            user: retObject.value
        }
    })
}

export default class UserController {

    public router = Router();

    constructor(checkAuth?: any) {

        this.router.get("/", function(req: Request, res: Response): Response {
            return res.json({ message: "Welcome to user api" });
        });

        if(checkAuth) {

            this.router.get("/findOne", checkAuth, this.findOne);
            this.router.post("/authUser", checkAuth, this.authUser);
            this.router.put("/update", checkAuth, this.update);
            this.router.delete("/delete", checkAuth, this.delete);

        } else {

            this.router.get("/findOne", this.findOne);
            this.router.post("/authUser", this.authUser);
            this.router.put("/update", this.update);
            this.router.delete("/delete", this.delete);

        }
    }

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

    authUser(req: Request, res: Response) {
        updateAuthUser(req.body)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(500).json(err))
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


}
