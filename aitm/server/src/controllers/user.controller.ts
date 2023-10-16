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
                .then(result => {
                    if(result?.newuser && result?.newuser==true) {
                        res.status(201).json(result)
                    } else {
                        res.status(200).json(result)
                    }
                })
                .catch(err => res.status(500).json(err))
        });
        this.router.put("/profile/:id", function (req: Request, res: Response) {

            userDb.updateUser(req.params.id,req.body)
                .then(result => {
                    if(result==null) res.status(404).json({})
                    else res.status(200).json(result)
                })
                .catch(err => res.status(500).json(err))
        });

        this.router.get("/profile/:id",function (req: Request, res: Response) {
            userDb.readUser(req.params.id)
                .then(user => {
                    if(user)
                        res.status(200).json(user)
                    else
                        res.status(404).json({})
                })
                .catch(err => res.status(500).json(err))
            }
        )

        this.router.get("/profile",function (req: Request, res: Response) {
                userDb.readUserlist()
                    .then(userlist => {
                        if(userlist)
                            res.status(200).json(userlist)
                        else
                            res.status(404).json({})
                    })
                    .catch(err => res.status(500).json(err))
            }
        )


    }


}
