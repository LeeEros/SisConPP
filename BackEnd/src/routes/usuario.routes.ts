import express, { Request, Response } from 'express';
import UsuarioController from '../controllers/usuario.controller';
import { authMiddleware } from "../middlewares/authMiddleware";
import { permitirFuncoes } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post('/', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await UsuarioController.criarUsuario(req, res);
});

router.put('/:id', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await UsuarioController.atualizarUsuario(req, res);
});

router.get('/:id', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await UsuarioController.buscarUsuarioPorId(req, res);
});

router.get('/usuarios/avaliadores', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO", "AVALIADOR"]),  async (req: Request, res: Response) => {
    await UsuarioController.buscarUsuariosAvaliadores(req, res);
});
router.get('/usuarios/secretarios', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]),  async (req: Request, res: Response) => {
    await UsuarioController.buscarUsuariosSecretarios(req, res);
});

router.get('/usuarios/auxiliares', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]),  async (req: Request, res: Response) => {
    await UsuarioController.buscarUsuariosAuxiliares(req, res);
});

router.get('/', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await UsuarioController.buscarUsuarios(req, res);
});

router.delete('/:id', authMiddleware, permitirFuncoes(["ADMINISTRADOR", "SECRETARIO"]), async (req: Request, res: Response) => {
    await UsuarioController.deletarUsuario(req, res);
});

export default router;