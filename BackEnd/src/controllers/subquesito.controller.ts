import { Request, Response } from "express";
import subQuesitosService from "../services/subquesito.service";

class SubquesitoController {
  async criarsubQuesitos(req: Request, res: Response) {
    const { nomeSubquesito, notaSubequesito, quesitoId, subGrupo } = req.body;
    if (!nomeSubquesito || String(nomeSubquesito).trim() === "") {
      return res
        .status(400)
        .json({ mensagem: "Nome do Subquesito é obrigatório." });
    }

    if (notaSubequesito === undefined || notaSubequesito === null) {
      return res
        .status(400)
        .json({ mensagem: "Nota do Subquesito é obrigatória." });
    }

    if (quesitoId === undefined || quesitoId === null) {
      return res
        .status(400)
        .json({ mensagem: "ID do Quesito é obrigatório." });
    }

    try {
      const subquesito = await subQuesitosService.criarsubQuesitos({
        nomeSubquesito: String(nomeSubquesito),
        notaSubequesito: Number(notaSubequesito),
        quesitoId: Number(quesitoId),
        subGrupo: subGrupo ?? null,
      });

      return res.status(201).json(subquesito);
    } catch (error) {
      console.error("Erro ao criar Subquesito", error);
      return res.status(400).json({
        mensagem: "Erro ao criar o Subquesito. Verifique os dados fornecidos.",
      });
    }
  }

  async atualizarsubQuesitos(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ mensagem: "Dados para atualização são obrigatórios." });
    }

    try {
      const payload: any = { ...data };
      if (payload.notaSubequesito !== undefined) {
        payload.notaSubequesito = Number(payload.notaSubequesito);
      }
      if (payload.quesitoId !== undefined) {
        payload.quesitoId = Number(payload.quesitoId);
      }
      if (payload.subGrupo === undefined) {
        delete payload.subGrupo;
      }

      const subquesito = await subQuesitosService.atualizarsubQuesitos(
        Number(id),
        payload
      );

      return res.status(200).json(subquesito);
    } catch (error) {
      console.error("Erro ao atualizar Subquesito", error);
      return res.status(400).json({
        mensagem: "Erro ao atualizar o Subquesito. Verifique os dados fornecidos.",
      });
    }
  }

  async buscarSubQuesitoPorId(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const subquesito = await subQuesitosService.buscarSubQuesitoPorId(
        Number(id)
      );

      if (!subquesito) {
        return res.status(404).json({ mensagem: "Subquesito não encontrado." });
      }

      return res.status(200).json(subquesito);
    } catch (error) {
      console.error("Erro ao buscar Subquesito", error);
      return res.status(400).json({
        mensagem: "Erro ao buscar o Subquesito. Verifique os dados fornecidos.",
      });
    }
  }

  async buscarSubQuesitos(req: Request, res: Response) {
    try {
      const subquesitos = await subQuesitosService.buscarSubQuesitos();
      return res.status(200).json(subquesitos);
    } catch (error) {
      console.error("Erro ao buscar Subquesitos", error);
      return res.status(400).json({
        mensagem: "Erro ao buscar os Subquesitos. Verifique os dados fornecidos.",
      });
    }
  }

  async deletarSubQuesito(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await subQuesitosService.deletarSubQuesito(Number(id));
      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro ao deletar Subquesito", error);
      return res.status(400).json({
        mensagem: "Erro ao deletar o Subquesito. Verifique os dados fornecidos.",
      });
    }
  }
}

export default new SubquesitoController();