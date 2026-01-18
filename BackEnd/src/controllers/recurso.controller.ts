import { Request, Response } from "express";
import { StatusRecurso } from "@prisma/client";
import RecursoService from "../services/recurso.service";

class RecursoController {

    async solicitarRecurso(req: Request, res: Response) {
        const {
            nomeRecurso,
            justificativa,
            arquivo,
            candidato,
            avaliador,
            quesitoRecurso,
            avaliacaoId,
            provaTeoricaIdprovaTeorica,
            provaPraticaIdProvaPratica
        } = req.body;

        if (
            !nomeRecurso ||
            !justificativa ||
            !arquivo ||
            !candidato ||
            !avaliador ||
            !quesitoRecurso ||
            !avaliacaoId
        ) {
            return res.status(400).json({
                mensagem: "Campos obrigatórios não informados."
            });
        }

        try {
            const recurso = await RecursoService.solicitarRecurso(
                nomeRecurso,
                justificativa,
                arquivo,
                Number(candidato),
                Number(avaliador),
                Number(quesitoRecurso),
                Number(avaliacaoId),
                provaTeoricaIdprovaTeorica
                    ? Number(provaTeoricaIdprovaTeorica)
                    : undefined,
                provaPraticaIdProvaPratica
                    ? Number(provaPraticaIdProvaPratica)
                    : undefined
            );

            return res.status(201).json(recurso);

        } catch (error) {
            return res.status(400).json({
                mensagem: error instanceof Error
                    ? error.message
                    : "Erro desconhecido."
            });
        }
    }

    async listarRecursos(req: Request, res: Response) {
        try {
            const recursos = await RecursoService.listarRecursos();
            return res.status(200).json(recursos);
        } catch (error) {
            return res.status(400).json({
                mensagem: error instanceof Error ? error.message : "Erro desconhecido."
            });
        }
    }

    async visualizarRecursoPorId(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ mensagem: "ID inválido." });
        }

        try {
            const recurso = await RecursoService.visualizarRecursoPorId(id);

            if (!recurso) {
                return res.status(404).json({ mensagem: "Recurso não encontrado." });
            }

            return res.status(200).json(recurso);
        } catch (error) {
            return res.status(400).json({
                mensagem: error instanceof Error ? error.message : "Erro desconhecido."
            });
        }
    }

    async alterarStatusRecurso(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (!status || isNaN(id)) {
            return res.status(400).json({ mensagem: "ID e status são obrigatórios." });
        }

        try {
            const recurso = await RecursoService.alterarStatusRecurso(
                id,
                mapStatus(status)
            );

            return res.status(200).json(recurso);
        } catch (error) {
            return res.status(400).json({
                mensagem: error instanceof Error ? error.message : "Erro desconhecido."
            });
        }
    }

    async listarQuesitosAvaliados(req: Request, res: Response) {
        const candidatoId = Number(req.params.candidatoId);
        const avaliadorId = Number(req.params.avaliadorId);

        try{
            const quesitos = await RecursoService.listarQuesitosAvaliadosPorCandidatoEAvaliador(
                candidatoId,
                avaliadorId
            );
            return res.status(200).json(quesitos);
        }catch(error){
            return res.status(400).json({
                mensagem: error instanceof Error ? error.message : "Erro desconhecido."
            });
        }
    }
}

function mapStatus(status: string | boolean): StatusRecurso {
    if (status === true || status === "DEFERIDO") return StatusRecurso.DEFERIDO;
    if (status === false || status === "INDEFERIDO") return StatusRecurso.INDEFERIDO;
    return StatusRecurso.PENDENTE;
}

export default new RecursoController();
