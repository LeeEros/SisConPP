import express, { Application } from "express";
import cors from "cors";

import rtRoutes from "./routes/rt.routes"; 
import ctgRoutes from "./routes/ctg.routes";
import usuarioRoutes from "./routes/usuario.routes";
import candidatoRoutes from "./routes/candidato.routes";
import concursoRoutes from "./routes/concurso.routes";
import categoriaRoutes from "./routes/categoria.routes";
import provaPraticaRoutes from "./routes/provaPratica.routes";
import comissao from "./routes/comissao.routes";
import subquesito from "./routes/subquesito.routes";
import quesito from "./routes/quesitos.routes";
import recurso from "./routes/recurso.routes";
import provaPratica from "./routes/provaPratica.routes";
import blocoProva from "./routes/blocoProva.routes";
import provaTeorica from "./routes/provaTeorica.routes";
import avaliacao from "./routes/avaliacao.routes"; 
import preferenciaSorteioDanca from "./routes/preferenciaSorteioDanca.routes";
import sorteioDanca from "./routes/sorteioDanca.routes";
import danca from "./routes/danca.routes";
import auth from "./routes/auth.routes";
import relatorios from "./routes/relatorios.routes";
import { METHODS } from "http"


const app: Application = express(); 

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json()); // Para analisar o corpo das requisições como JSON

// Definindo os prefixos das rotas 
app.use("/rt", rtRoutes);
app.use("/ctg", ctgRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/candidato", candidatoRoutes);
app.use("/concurso", concursoRoutes);
app.use("/categoria", categoriaRoutes);
app.use("/comissao", comissao);
app.use("/quesito", quesito);
app.use("/subquesito", subquesito);
app.use("/recurso", recurso);
app.use("/provaPratica", provaPratica);
app.use("/provaTeorica", provaTeorica);
app.use("/blocoProva", blocoProva);
app.use("/avaliacao", avaliacao); 
app.use("/preferenciaSorteioDanca", preferenciaSorteioDanca); 
app.use("/sorteioDanca", sorteioDanca);
app.use("/danca", danca);
app.use("/auth", auth);
app.use("/relatorios", relatorios);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log("Hello World");
  console.log(`Servidor rodando em http://localhost:${PORT}`);  
});