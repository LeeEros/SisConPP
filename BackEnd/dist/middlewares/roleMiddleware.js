"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permitirFuncoes = permitirFuncoes;
require("express");
function permitirFuncoes(funcoesPermitidas) {
    return (req, res, next) => {
        const usuario = req.user;
        if (!usuario) {
            res.status(401).json({ mensagem: "Token inválido" });
            return;
        }
        if (!funcoesPermitidas.includes(usuario.funcao)) {
            res.status(403).json({ mensagem: "Acesso negado" });
            return;
        }
        next();
    };
}
