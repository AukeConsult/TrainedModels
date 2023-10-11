import {Request, Response, Router} from "express";

class HomeController {
  router = Router();
  constructor() {
    this.router.get("/", function (req: Request, res: Response): Response {
      return res.json({ message: "Welcome to leif application." });
    });
  }
}

export default new HomeController().router;