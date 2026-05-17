import { PrismaClient, VivenciaSubGrupo } from "@prisma/client";
import bcrypt from "bcrypt";
import { seedPrendaMirim } from "./seeds/prendaMirim.seed";
import { seedPeaoMirim } from "./seeds/peaoMirim.seed";
import { seedPrendas } from "./seeds/prendaJAVX.seed";
import { seedPeoes } from "./seeds/peaoJAVX.seed";

const prisma = new PrismaClient();

async function main() {
    // =========================
    // PROVAS TEÓRICAS
    // =========================

    await prisma.provaTeorica.createMany({
        data: [
            { nomeProva: "Prova Teórica Prenda Mirim", notaMaxima: 100, numQuestao: 25 },
            { nomeProva: "Prova Teórica Peão Mirim", notaMaxima: 100, numQuestao: 25 },
            { nomeProva: "Prova Teórica Prenda Juvenil, Adulta, Veterana e Xirua", notaMaxima: 100, numQuestao: 25 },
            { nomeProva: "Prova Teórica Peão Juvenil, Adulto, Veterano e Xiru", notaMaxima: 100, numQuestao: 25 },
        ]
    });

    await prisma.quesitos.createMany({
        data:[
            { nomeQuesito: "Questões corretas",
                notaMaximaQuesito: 100,
                opcional: false,
                provaTeoricaIdprovaTeorica: 1,
            }
        ]
    });

    await prisma.quesitos.createMany({
        data:[
            { nomeQuesito: "Questões corretas",
                notaMaximaQuesito: 100,
                opcional: false,
                provaTeoricaIdprovaTeorica: 2,
            }
        ]
    });

    await prisma.quesitos.createMany({
        data:[
            { nomeQuesito: "Questões corretas",
                notaMaximaQuesito: 75.0,
                opcional: false,
                provaTeoricaIdprovaTeorica: 3,
            }
        ]
    });

    const redacaoPrenda = await prisma.quesitos.create({
        data: {
            nomeQuesito: "Redação",
            notaMaximaQuesito: 25.0,
            opcional: false,
            provaTeoricaIdprovaTeorica: 3,
        },
    });

    await prisma.subQuesitos.createMany({
        data: [
            { nomeSubquesito: "Estrutura do texto (argumentativo)", notaSubequesito: 5.0, quesitoId: redacaoPrenda.idQuesito},
            {nomeSubquesito: "Ortografia", notaSubequesito: 5.0,quesitoId: redacaoPrenda.idQuesito,}, 
            { nomeSubquesito: "Concordância verbal", notaSubequesito: 5.0, quesitoId: redacaoPrenda.idQuesito},
            { nomeSubquesito: "Conteúdo (pertinente ao tema)", notaSubequesito: 10.0, quesitoId: redacaoPrenda.idQuesito,}
        ]
    });      
    
    await prisma.quesitos.createMany({
        data:[
            { nomeQuesito: "Questões corretas",
                notaMaximaQuesito: 75.0,
                opcional: false,
                provaTeoricaIdprovaTeorica: 4,
            }
        ]
    });

    const redacaoPeao = await prisma.quesitos.create({
        data: {
            nomeQuesito: "Redação",
            notaMaximaQuesito: 25.0,
            opcional: false,
            provaTeoricaIdprovaTeorica: 4,
        },
    });

    await prisma.subQuesitos.createMany({
        data: [
            { nomeSubquesito: "Estrutura do texto (argumentativo)", notaSubequesito: 5.0, quesitoId: redacaoPeao.idQuesito},
            {nomeSubquesito: "Ortografia", notaSubequesito: 5.0,quesitoId: redacaoPeao.idQuesito,}, 
            { nomeSubquesito: "Concordância verbal", notaSubequesito: 5.0, quesitoId: redacaoPeao.idQuesito},
            { nomeSubquesito: "Conteúdo (pertinente ao tema)", notaSubequesito: 10.0, quesitoId: redacaoPeao.idQuesito,}
        ]
    });     

    console.log("✅ Provas Teóricas criados com sucesso!");

    // =========================
    // PROVAS PRÁTICAS
    // =========================
    await prisma.provaPratica.createMany({
        data: [
            { idProvaPratica: 1, nomeProva: "Prova Pratica Prenda Mirim", notaMaxima: 100 },
            { idProvaPratica: 2, nomeProva: "Prova Pratica Peão Mirim", notaMaxima: 100 },
            { idProvaPratica: 3, nomeProva: "Prova Pratica Prenda Juvenil, Adulta, Veterana e Xirua", notaMaxima: 100 },
            { idProvaPratica: 4, nomeProva: "Prova Pratica Peão Juvenil, Adulto, Veterano e Xiru", notaMaxima: 100 },
        ]
    });

    console.log("✅ Provas Práticas criados com sucesso!");

    // =========================
    // CATEGORIAS
    // =========================
    await prisma.categoria.createMany({
        data: [
            { idCategoria: 1, nomeCategoria: "Prenda Mirim", escolaridade: "Ter concluído ou cursando o 2 ano do Ensino Fundamental", sorteioDanca: 1, idadeInicial: 7, idadeLimite: 12, provaPraticaId: 1, provaTeoricaId: 1 },
            { idCategoria: 2, nomeCategoria: "Peão Mirim", escolaridade: "Ter concluído ou cursando o 2 ano do Ensino Fundamental", sorteioDanca: 3, idadeInicial: 7, idadeLimite: 12, provaPraticaId: 2, provaTeoricaId: 2 },
            { idCategoria: 3, nomeCategoria: "Prenda Juvenil", escolaridade: "Ter concluído ou cursando o 6 ano do Ensino Fundamental", sorteioDanca: 1, idadeInicial: 12, idadeLimite: 17, provaPraticaId: 3, provaTeoricaId: 3 },
            { idCategoria: 4, nomeCategoria: "Peão Juvenil", escolaridade: "Ter concluído ou cursando o 6 ano do Ensino Fundamental", sorteioDanca: 3, idadeInicial: 12, idadeLimite: 17, provaPraticaId: 4, provaTeoricaId: 4 },
            { idCategoria: 5, nomeCategoria: "Prenda Adulta", escolaridade: "Ter concluído ou cursando o Ensino Médio", sorteioDanca: 5, idadeInicial: 18, idadeLimite: 0, provaPraticaId: 3, provaTeoricaId: 3 },
            { idCategoria: 6, nomeCategoria: "Peão Adulto", escolaridade: "Ter concluído ou cursando o Ensino Médio", sorteioDanca: 5, idadeInicial: 18, idadeLimite: 0, provaPraticaId: 4, provaTeoricaId: 4 },
            { idCategoria: 7, nomeCategoria: "Prenda Veterana", escolaridade: "Ter concluído ou cursando o Ensino Fundamental", sorteioDanca: 1, idadeInicial: 30, idadeLimite: 0, provaPraticaId: 3, provaTeoricaId: 3 },
            { idCategoria: 8, nomeCategoria: "Peão Veterano", escolaridade: "Ter concluído ou cursando o Ensino Fundamental", sorteioDanca: 1, idadeInicial: 30, idadeLimite: 0, provaPraticaId: 4, provaTeoricaId: 4 },
            { idCategoria: 9, nomeCategoria: "Prenda Xirua", escolaridade: "Ter concluído ou cursando o Ensino Fundamental", sorteioDanca: 1, idadeInicial: 50, idadeLimite: 0, provaPraticaId: 3, provaTeoricaId: 3 },
            { idCategoria: 10, nomeCategoria: "Peão Xirú", escolaridade: "Ter concluído ou cursando o Ensino Fundamental", sorteioDanca: 1, idadeInicial: 50, idadeLimite: 0, provaPraticaId: 4, provaTeoricaId: 4 },
        ],
        skipDuplicates: true,
    });
    console.log("✅ Categorias criadas com sucesso!");

    // =========================
    // PROVAS POR CATEGORIA
    // =========================
    await seedPrendaMirim(prisma);
    await seedPeaoMirim(prisma);
    await seedPrendas(prisma);
    await seedPeoes(prisma);

    console.log("✅ Seed executado com sucesso!");

    // =========================
    // DANÇAS
    // =========================
    await prisma.danca.createMany({
        data: [
            // =========================
            // DANÇAS DE SALÃO
            // =========================
            { idDanca: 1, nomeDanca: "Valsa", dancaSalaoTradicional: "DANCA_DE_SALAO" },
            { idDanca: 2, nomeDanca: "Vaneira", dancaSalaoTradicional: "DANCA_DE_SALAO" },
            { idDanca: 3, nomeDanca: "Chamamé", dancaSalaoTradicional: "DANCA_DE_SALAO" },
            { idDanca: 4, nomeDanca: "Bugio", dancaSalaoTradicional: "DANCA_DE_SALAO" },
            { idDanca: 5, nomeDanca: "Milonga", dancaSalaoTradicional: "DANCA_DE_SALAO" },
            { idDanca: 6, nomeDanca: "Chote", dancaSalaoTradicional: "DANCA_DE_SALAO" },
            { idDanca: 7, nomeDanca: "Rancheira", dancaSalaoTradicional: "DANCA_DE_SALAO" },

            // =========================
            // DANÇAS TRADICIONAIS
            // =========================
            { idDanca: 8, nomeDanca: "Chico Sapateado", dancaSalaoTradicional: "DANCA_TRADICIONAL" },
            { idDanca: 9, nomeDanca: "Chimarrita Balão", dancaSalaoTradicional: "DANCA_TRADICIONAL" },
            { idDanca: 10, nomeDanca: "Chote Carreirinho", dancaSalaoTradicional: "DANCA_TRADICIONAL" },
            { idDanca: 11, nomeDanca: "Chote de Duas Damas", dancaSalaoTradicional: "DANCA_TRADICIONAL" },
            { idDanca: 12, nomeDanca: "Chote das Sete Voltas", dancaSalaoTradicional: "DANCA_TRADICIONAL" },
            { idDanca: 13, nomeDanca: "Havaneira Marcada", dancaSalaoTradicional: "DANCA_TRADICIONAL" },
            { idDanca: 14, nomeDanca: "Pezinho", dancaSalaoTradicional: "DANCA_TRADICIONAL" },
            { idDanca: 15, nomeDanca: "Rancheira de Carreirinha", dancaSalaoTradicional: "DANCA_TRADICIONAL" },
            { idDanca: 16, nomeDanca: "Tatu (Tatu de Castanholas)", dancaSalaoTradicional: "DANCA_TRADICIONAL" },
            { idDanca: 17, nomeDanca: "Tatu com Volta no Meio", dancaSalaoTradicional: "DANCA_TRADICIONAL" },
            { idDanca: 18, nomeDanca: "Tirana do Lenço", dancaSalaoTradicional: "DANCA_TRADICIONAL" },
        ]
    });
    console.log("✅ Quesitos de dança criados com sucesso!");


    // =========================
    // REGIÕES TRADICIONALISTAS
    // =========================
    await prisma.rT.createMany({
        data: Array.from({ length: 18 }).map((_, index) => ({
            nomeRT: (index + 1) + " Região Tradicionalista",
            numeroRT: index + 1,
        })),
        skipDuplicates: true,
    });
    console.log("✅ RTs criadas com sucesso!");

    // =========================
    // CTG
    // =========================
    const ctg = await prisma.cTG.create({
        data: {
            nomeCTG: "CTG Fronteira da Amizade",
            RTid: 17,
        },
    });
    console.log("✅ CTG criado com sucesso!");

    // =========================
    // USUÁRIO SECRETÁRIO
    // =========================
    const senhaHash = await bcrypt.hash("12345", 10);
    await prisma.usuario.create({
        data: {
            nomeCompleto: "Kayane Alebrante",
            cidade: "União da Vitória",
            estado: "PR",
            CTGId: ctg.idCTG,
            numCarteirinha: "123456",
            login: "kayane",
            senha: senhaHash,
            funcao: "SECRETARIO",
            credenciamento: "CREDENCIADO",
            numCredenciamento: 10,
        },
    });
    console.log("🌱 Seed executado com sucesso!");
}
main()
    .catch((e) => {
        console.error("Erro no seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });