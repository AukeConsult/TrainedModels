import {Request, Response, Router} from "express";
import MongoService from "./mongo.service"

const mongoUrl = 'mongodb://0.0.0.0:27017/models'
const mongoService: MongoService = new MongoService(mongoUrl)

function updateAuthUser(authProfile: any) {
    return mongoService.updateAndGet("users",
        {userid: authProfile.email},
        {
            userid: authProfile.email,
            profile: {
                fullname: authProfile.name,
                nickname: authProfile.nickname,
                picture: authProfile.picture,
                intro: "",
            },
            interests: [
                "training",
                "development",
                "sales",
                "consultancy"
            ],
            tags: [
                {parentid: "x", id: "healt", desc: "", search: ""},
                {parentid: "x", id: "domain", desc: "", search: ""}
            ],
            docs: [
                {docid: 1123123123123, type: "model", ingres: ""},
                {docid: 1123123123123, type: "trainer", ingres: ""}
            ],
            authProfile: authProfile,
        },
        (retObject: any) => {
        return {
            newuser: !retObject.lastErrorObject?.updatedExisting,
            userProfile: retObject.value
        }
    })
}

function updateProfile(user: any) {
    return mongoService.updateAndGet("users",
        {_id: user._id},
        {profile: user.profile},
        (retObject: any) => {
            return {
                newuser: false,
                userProfile: retObject.value
            }
        })
}

export default class UserController {

    public router = Router();

    authUser(req: Request, res: Response) {
        updateAuthUser(req.body)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(500).json(err))
    }

    updProfile(req: Request, res: Response) {
        updateProfile(req.body)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(500).json(err))
    }

    all(req: Request, res: Response) {
        if(req.params.id) {
            mongoService.findUser(req.params.id)
                .then(result => res.status(201).json(result))
                .catch(err => res.status(500).json(err))
        }
    }

    constructor(checkAuth?: any) {

        this.router.get("/", function(req: Request, res: Response): Response {
            return res.json({ message: "Welcome to user api" });
        });

        if(checkAuth) {
            this.router.post("/authUser", checkAuth, this.authUser);
            this.router.post("/updprofile", checkAuth, this.updProfile);
            this.router.post("/all", checkAuth, this.all);
            this.router.post("/profile", checkAuth, this.all);
        } else {
            this.router.post("/authUser", this.authUser);
            this.router.post("/updprofile", this.updProfile);
        }


    }


}
