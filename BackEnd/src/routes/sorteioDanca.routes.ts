import express, {Request, Response} from "express";
import sorteioDancaController from "../controllers/sorteioDanca.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { permitirFuncoes } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/", authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AUXILIAR"]), async (req: Request, res: Response) => {
    await sorteioDancaController.realizarSorteio(req, res);
});

export default router;