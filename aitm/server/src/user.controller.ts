import {Request, Response, Router} from "express";
import MongoService from "./mongo.service"

const mongoUrl = 'mongodb://0.0.0.0:27017/models'
const mongo: MongoService = new MongoService(mongoUrl)

function updateAuthUser(authProfile: any) {
    return mongo.updateAndGet("users",
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
    return mongo.updateAndGet("users",
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

    constructor(checkAuth?: any) {

        this.router.get("/", function(req: Request, res: Response): Response {
            return res.json({ message: "Welcome to user api" });
        });

        if(checkAuth) {

            this.router.post("/authUser", checkAuth, this.authUser);
            this.router.post("/profile", checkAuth, this.profile);

            // this.router.get("/findOne", checkAuth, this.findOne);
            // this.router.put("/update", checkAuth, this.update);
            // this.router.delete("/delete", checkAuth, this.delete);

        } else {

            this.router.post("/authUser", this.authUser);
            this.router.post("/profile", this.profile);

            // this.router.get("/findOne", this.findOne);
            // this.router.put("/update", this.update);
            // this.router.delete("/delete", this.delete);

        }
    }



    authUser(req: Request, res: Response) {
        updateAuthUser(req.body)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(500).json(err))
    }

    profile(req: Request, res: Response) {
        updateProfile(req.body)
            .then(result => res.status(201).json(result))
            .catch(err => res.status(500).json(err))
    }

    // async findOne(req: Request, res: Response) {
    //     try {
    //         res.status(200).json({
    //             message: "findOne OK",
    //             reqParamId: req.params.id
    //         });
    //     } catch (err) {
    //         res.status(500).json({
    //             message: "Internal Server Error!"
    //         });
    //     }
    // }
    //
    // async update(req: Request, res: Response) {
    //     try {
    //         res.status(200).json({
    //             message: "update OK",
    //             reqParamId: req.params.id,
    //             reqBody: req.body
    //         });
    //     } catch (err) {
    //         res.status(500).json({
    //             message: "Internal Server Error!"
    //         });
    //     }
    // }
    //
    // async delete(req: Request, res: Response) {
    //     try {
    //         res.status(200).json({
    //             message: "delete OK",
    //             reqParamId: req.params.id
    //         });
    //     } catch (err) {
    //         res.status(500).json({
    //             message: "Internal Server Error!"
    //         });
    //     }
    // }


}
