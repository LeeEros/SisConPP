"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const rt_routes_1 = __importDefault(require("./routes/rt.routes"));
const ctg_routes_1 = __importDefault(require("./routes/ctg.routes"));
const usuario_routes_1 = __importDefault(require("./routes/usuario.routes"));
const candidato_routes_1 = __importDefault(require("./routes/candidato.routes"));
const concurso_routes_1 = __importDefault(require("./routes/concurso.routes"));
const categoria_routes_1 = __importDefault(require("./routes/categoria.routes"));
const comissao_routes_1 = __importDefault(require("./routes/comissao.routes"));
const subquesito_routes_1 = __importDefault(require("./routes/subquesito.routes"));
const quesitos_routes_1 = __importDefault(require("./routes/quesitos.routes"));
const recurso_routes_1 = __importDefault(require("./routes/recurso.routes"));
const provaPratica_routes_1 = __importDefault(require("./routes/provaPratica.routes"));
const blocoProva_routes_1 = __importDefault(require("./routes/blocoProva.routes"));
const provaTeorica_routes_1 = __importDefault(require("./routes/provaTeorica.routes"));
const avaliacao_routes_1 = __importDefault(require("./routes/avaliacao.routes"));
const preferenciaSorteioDanca_routes_1 = __importDefault(require("./routes/preferenciaSorteioDanca.routes"));
const sorteioDanca_routes_1 = __importDefault(require("./routes/sorteioDanca.routes"));
const danca_routes_1 = __importDefault(require("./routes/danca.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const relatorios_routes_1 = __importDefault(require("./routes/relatorios.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express_1.default.json()); // Para analisar o corpo das requisições como JSON
// Definindo os prefixos das rotas 
app.use("/rt", rt_routes_1.default);
app.use("/ctg", ctg_routes_1.default);
app.use("/usuario", usuario_routes_1.default);
app.use("/candidato", candidato_routes_1.default);
app.use("/concurso", concurso_routes_1.default);
app.use("/categoria", categoria_routes_1.default);
app.use("/comissao", comissao_routes_1.default);
app.use("/quesito", quesitos_routes_1.default);
app.use("/subquesito", subquesito_routes_1.default);
app.use("/recurso", recurso_routes_1.default);
app.use("/provaPratica", provaPratica_routes_1.default);
app.use("/provaTeorica", provaTeorica_routes_1.default);
app.use("/blocoProva", blocoProva_routes_1.default);
app.use("/avaliacao", avaliacao_routes_1.default);
app.use("/preferenciaSorteioDanca", preferenciaSorteioDanca_routes_1.default);
app.use("/sorteioDanca", sorteioDanca_routes_1.default);
app.use("/danca", danca_routes_1.default);
app.use("/auth", auth_routes_1.default);
app.use("/relatorios", relatorios_routes_1.default);
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log("Hello World");
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
