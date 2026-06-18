import express, {Request, Response } from "express";
import blocoProvaController from "../controllers/blocoProva.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { permitirFuncoes } from "../middlewares/roleMiddleware";

const route = express.Router();

route.post("/", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await blocoProvaController.criarBlocoProva(req, res);
});

route.put("/",authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await blocoProvaController.editarBlocoProva(req, res);
});

route.get("/:idBloco", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await blocoProvaController.consultarBlocoProva(req, res);
});

route.get("/", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await blocoProvaController.consultarBlocosProva(req, res);
});


export default route;