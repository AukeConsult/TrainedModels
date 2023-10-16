import {Request, Response, Router} from "express";
import UserDb from "../db/user.db"

const mongoUrl = 'mongodb://0.0.0.0:27017/models'
const userDb: UserDb = new UserDb(mongoUrl)

export default class UserController {

    public router = Router();

    constructor(checkAuth?: any) {

        this.router.get("/", function(req: Request, res: Response): Response {
            return res.json({ message: "Welcome to user api" });
        });

        this.router.post("/authuser", function (req: Request, res: Response) {
            userDb.updateAuthProfile(req.body)
                .then(result => res.status(201).json(result))
                .catch(err => res.status(500).json(err))
        });
        this.router.put("/profile/:id", function (req: Request, res: Response) {
            const user = {
                nickname: req.body.nickname,
                profile: req.body.profile
            }
            userDb.updateUser(req.params.id,user)
                .then(result => res.status(201).json(result))
                .catch(err => res.status(500).json(err))
        });

        //this.router.get("/profile/:id", checkAuth, this.getProfile);
        //this.router.get("/profiles", checkAuth, this.getall);


    }


}
