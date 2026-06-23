// prisma/seeds/prendaVeteranaXirua.seed.ts
import { PrismaClient, VivenciaSubGrupo } from "@prisma/client";

export async function seedPrendaVeteranaXirua(prisma: PrismaClient) {
  // Substitua pelo ID real da prova prática de Veterana/Xirua no seu banco
  const PRATICA_ID = 5; 

  // =====================================================
  // BLOCOS
  // =====================================================

  const blocoOral = await prisma.blocoProva.create({
    data: {
      nomeBloco: "Prova Oral",
      notaMaximaBloco: 63,
      provaPraticaId: PRATICA_ID,
    },
  });

  const blocoArtistica = await prisma.blocoProva.create({
    data: {
      nomeBloco: "Prova Artística",
      notaMaximaBloco: 25,
      provaPraticaId: PRATICA_ID,
    },
  });

  const blocoDotes = await prisma.blocoProva.create({
    data: {
      nomeBloco: "Prova de Dotes",
      notaMaximaBloco: 12,
      provaPraticaId: PRATICA_ID,
    },
  });

  // =====================================================
  // VIVÊNCIA
  // =====================================================

  const vivencia = await prisma.quesitos.create({
    data: {
      nomeQuesito: "Vivência Tradicionalista Gaúcha",
      notaMaximaQuesito: 33,
      opcional: false,
      blocoProvaIdBloco: blocoOral.idBloco,
    },
  });

  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Capricho", notaSubequesito: 1.5, quesitoId: vivencia.idQuesito, subGrupo: VivenciaSubGrupo.APRESENTACAO_PASTA },
      { nomeSubquesito: "Organização (identificação, sumário, ordem dos eventos etc.)", notaSubequesito: 2, quesitoId: vivencia.idQuesito, subGrupo: VivenciaSubGrupo.APRESENTACAO_PASTA },
      { nomeSubquesito: "Comprovantes de participação", notaSubequesito: 2.5, quesitoId: vivencia.idQuesito, subGrupo: VivenciaSubGrupo.APRESENTACAO_PASTA },
      { nomeSubquesito: "Aproveitamento do tempo/participação total", notaSubequesito: 3, quesitoId: vivencia.idQuesito, subGrupo: VivenciaSubGrupo.APROVEITAMENTO_TEMPO },
      { nomeSubquesito: "Aproveitamento do tempo/participação na ATUAL GESTÃO", notaSubequesito: 4.5, quesitoId: vivencia.idQuesito, subGrupo: VivenciaSubGrupo.APROVEITAMENTO_TEMPO },
      { nomeSubquesito: "CTG/Eventos a nível interno", notaSubequesito: 3.5, quesitoId: vivencia.idQuesito, subGrupo: VivenciaSubGrupo.COLABORACAO_PROMOCOES },
      { nomeSubquesito: "RT/ Eventos a nível regional", notaSubequesito: 1, quesitoId: vivencia.idQuesito, subGrupo: VivenciaSubGrupo.COLABORACAO_PROMOCOES },
      { nomeSubquesito: "MTG/Eventos a nível estadual", notaSubequesito: 0.5, quesitoId: vivencia.idQuesito, subGrupo: VivenciaSubGrupo.COLABORACAO_PROMOCOES },
      { nomeSubquesito: "CBTG/Eventos da CBTG", notaSubequesito: 0.5, quesitoId: vivencia.idQuesito, subGrupo: VivenciaSubGrupo.COLABORACAO_PROMOCOES },
      { nomeSubquesito: "Outros eventos/ outros eventos a nível nacional", notaSubequesito: 0.5, quesitoId: vivencia.idQuesito, subGrupo: VivenciaSubGrupo.COLABORACAO_PROMOCOES },
      { nomeSubquesito: "CTG/Eventos a nível interno", notaSubequesito: 5.5, quesitoId: vivencia.idQuesito, subGrupo: VivenciaSubGrupo.PARTICIPACAO_EVENTOS },
      { nomeSubquesito: "RT/ Eventos a nível regional", notaSubequesito: 3, quesitoId: vivencia.idQuesito, subGrupo: VivenciaSubGrupo.PARTICIPACAO_EVENTOS },
      { nomeSubquesito: "MTG/Eventos a nível estadual", notaSubequesito: 2.5, quesitoId: vivencia.idQuesito, subGrupo: VivenciaSubGrupo.PARTICIPACAO_EVENTOS },
      { nomeSubquesito: "CBTG/Eventos da CBTG", notaSubequesito: 1.0, quesitoId: vivencia.idQuesito, subGrupo: VivenciaSubGrupo.PARTICIPACAO_EVENTOS },
      { nomeSubquesito: "Outros eventos/ outros eventos a nível nacional", notaSubequesito: 1.5, quesitoId: vivencia.idQuesito, subGrupo: VivenciaSubGrupo.PARTICIPACAO_EVENTOS },
    ],
  });

  // =====================================================
  // PROJETO PRINCIPAL E OUTROS PROJETOS
  // =====================================================

  const projetoPrincipal = await prisma.quesitos.create({
    data: {
      nomeQuesito: "Projeto Principal - Executado na Atual Gestão",
      notaMaximaQuesito: 10,
      opcional: false,
      blocoProvaIdBloco: blocoOral.idBloco,
    },
  });

  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Conteúdo e planejamento", notaSubequesito: 2, quesitoId: projetoPrincipal.idQuesito },
      { nomeSubquesito: "Estrutura do documento", notaSubequesito: 1.5, quesitoId: projetoPrincipal.idQuesito },
      { nomeSubquesito: "Execução", notaSubequesito: 2.5, quesitoId: projetoPrincipal.idQuesito },
      { nomeSubquesito: "Relevância/pertinência do projeto para o tradicionalismo e/ou comunidade", notaSubequesito: 2.5, quesitoId: projetoPrincipal.idQuesito },
      { nomeSubquesito: "Apresentação", notaSubequesito: 1.5, quesitoId: projetoPrincipal.idQuesito },
    ],
  });

  const outrosProjetos = await prisma.quesitos.create({
    data: {
      nomeQuesito: "Outros Projetos e Ações Executados",
      notaMaximaQuesito: 5,
      opcional: false,
      blocoProvaIdBloco: blocoOral.idBloco,
    },
  });

  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Número de outros projetos e ações", notaSubequesito: 1.0, quesitoId: outrosProjetos.idQuesito },
      { nomeSubquesito: "Conteúdo e relevância dos projetos", notaSubequesito: 1.5, quesitoId: outrosProjetos.idQuesito },
      { nomeSubquesito: "Conteúdo e relevância das ações", notaSubequesito: 1.5, quesitoId: outrosProjetos.idQuesito },
      { nomeSubquesito: "Apresentação", notaSubequesito: 1.0, quesitoId: outrosProjetos.idQuesito },
    ],
  });

  // =====================================================
  // PESQUISA HISTÓRICA E DESENVOLTURA ORAL
  // =====================================================

  const pesquisa = await prisma.quesitos.create({
    data: {
      nomeQuesito: "Pesquisa Histórica",
      notaMaximaQuesito: 12,
      opcional: false,
      blocoProvaIdBloco: blocoOral.idBloco,
    },
  });

  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Conteúdo da pesquisa escrita", notaSubequesito: 2.5, quesitoId: pesquisa.idQuesito },
      { nomeSubquesito: "Relevância/pertinência do conteúdo escolhido", notaSubequesito: 2.0, quesitoId: pesquisa.idQuesito },
      { nomeSubquesito: "Tema compatível com a categoria", notaSubequesito: 0.5, quesitoId: pesquisa.idQuesito },
      { nomeSubquesito: "Estrutura da pesquisa escrita (formatação e referências)", notaSubequesito: 2.5, quesitoId: pesquisa.idQuesito },
      { nomeSubquesito: "Desenvoltura e Expressão durante a explicação da pesquisa", notaSubequesito: 2.5, quesitoId: pesquisa.idQuesito },
      { nomeSubquesito: "Criatividade / recurso utilizado na apresentação", notaSubequesito: 2.0, quesitoId: pesquisa.idQuesito },
    ],
  });

  const desenvoltura = await prisma.quesitos.create({
    data: {
      nomeQuesito: "Desenvoltura e Expressão",
      notaMaximaQuesito: 3,
      opcional: false,
      blocoProvaIdBloco: blocoOral.idBloco,
    },
  });

  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Carisma, educação e postura", notaSubequesito: 0.5, quesitoId: desenvoltura.idQuesito },
      { nomeSubquesito: "Fluência, naturalidade, domínio dos assuntos conversados ", notaSubequesito: 1.0, quesitoId: desenvoltura.idQuesito },
      { nomeSubquesito: "Boa oratória, habilidades de comunicação", notaSubequesito: 1.0, quesitoId: desenvoltura.idQuesito },
      { nomeSubquesito: "Iniciativa e proatividade", notaSubequesito: 0.5, quesitoId: desenvoltura.idQuesito },
    ],
  });

  // =====================================================
  // INDUMENTÁRIA
  // =====================================================

  const indumentaria = await prisma.quesitos.create({
    data: {
      nomeQuesito: "Indumentária",
      notaMaximaQuesito: -5,
      opcional: false,
      blocoProvaIdBloco: blocoOral.idBloco,
    },
  });

  await prisma.subQuesitos.create({
    data: {
      nomeSubquesito: "Indumentária em desacordo com a Diretriz de Indumentária do MTG-PR",
      notaSubequesito: 5,
      quesitoId: indumentaria.idQuesito,
    },
  });

  // =====================================================
  // DANÇA DE SALÃO E OPCIONAIS ARTÍSTICOS
  // =====================================================

  const dancaSalao = await prisma.quesitos.create({
    data: {
      nomeQuesito: "Dança Gaúcha de Salão",
      notaMaximaQuesito: 5,
      opcional: false,
      blocoProvaIdBloco: blocoArtistica.idBloco,
    },
  });

  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Harmonia do par", notaSubequesito: 1.0, quesitoId: dancaSalao.idQuesito },
      { nomeSubquesito: "Interpretação artística", notaSubequesito: 2.0, quesitoId: dancaSalao.idQuesito },
      { nomeSubquesito: "Execução dos passos característicos/domínio da sala", notaSubequesito: 1.0, quesitoId: dancaSalao.idQuesito },
      { nomeSubquesito: "Execução das variações permitidas conforme literatura", notaSubequesito: 1.0, quesitoId: dancaSalao.idQuesito },
    ],
  });

  const declamacao = await prisma.quesitos.create({
    data: { nomeQuesito: "Declamação", notaMaximaQuesito: 6.0, opcional: true, blocoProvaIdBloco: blocoArtistica.idBloco },
  });
  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Fidelidade ao texto", notaSubequesito: 1.0, quesitoId: declamacao.idQuesito },
      { nomeSubquesito: "Fundamentos de voz: dicção, impostação e inflexão", notaSubequesito: 2.0, quesitoId: declamacao.idQuesito },
      { nomeSubquesito: "Postura cênica e gestual", notaSubequesito: 1.5, quesitoId: declamacao.idQuesito },
      { nomeSubquesito: "Transmissão da mensagem poética", notaSubequesito: 1.5, quesitoId: declamacao.idQuesito },
    ],
  });

  const interpreteVocal = await prisma.quesitos.create({
    data: { nomeQuesito: "Intérprete Vocal/Cantar", notaMaximaQuesito: 6.0, opcional: true, blocoProvaIdBloco: blocoArtistica.idBloco },
  });
  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Fidelidade à letra", notaSubequesito: 1.0, quesitoId: interpreteVocal.idQuesito },
      { nomeSubquesito: "Afinação", notaSubequesito: 1.0, quesitoId: interpreteVocal.idQuesito },
      { nomeSubquesito: "Ritmo", notaSubequesito: 1.0, quesitoId: interpreteVocal.idQuesito },
      { nomeSubquesito: "Interpretação artística e postura cênica", notaSubequesito: 3.0, quesitoId: interpreteVocal.idQuesito },
    ],
  });

  const execucaoInstrumental = await prisma.quesitos.create({
    data: { nomeQuesito: "Execução Instrumental", notaMaximaQuesito: 6.0, opcional: true, blocoProvaIdBloco: blocoArtistica.idBloco },
  });
  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Interpretação artística", notaSubequesito: 1.0, quesitoId: execucaoInstrumental.idQuesito },
      { nomeSubquesito: "Postura cênica", notaSubequesito: 1.0, quesitoId: execucaoInstrumental.idQuesito },
      { nomeSubquesito: "Afinação do instrumento e ritmo", notaSubequesito: 2.0, quesitoId: execucaoInstrumental.idQuesito },
      { nomeSubquesito: "Técnica (habilidade de execução)", notaSubequesito: 2.0, quesitoId: execucaoInstrumental.idQuesito },
    ],
  });

  const dancaFolclorica = await prisma.quesitos.create({
    data: { nomeQuesito: "Dança Folclórica Tradicional", notaMaximaQuesito: 6.0, opcional: true, blocoProvaIdBloco: blocoArtistica.idBloco },
  });
  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Harmonia do par", notaSubequesito: 1.0, quesitoId: dancaFolclorica.idQuesito },
      { nomeSubquesito: "Correção coreográfica", notaSubequesito: 2.0, quesitoId: dancaFolclorica.idQuesito },
      { nomeSubquesito: "Interpretação artística", notaSubequesito: 2.0, quesitoId: dancaFolclorica.idQuesito },
      { nomeSubquesito: "Disposição do par na sala", notaSubequesito: 1.0, quesitoId: dancaFolclorica.idQuesito },
    ],
  });

  const contarLenda = await prisma.quesitos.create({
    data: { nomeQuesito: "Contar uma Lenda", notaMaximaQuesito: 6.0, opcional: true, blocoProvaIdBloco: blocoArtistica.idBloco },
  });
  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Domínio do conteúdo", notaSubequesito: 1.0, quesitoId: contarLenda.idQuesito },
      { nomeSubquesito: "Interpretação", notaSubequesito: 2.0, quesitoId: contarLenda.idQuesito },
      { nomeSubquesito: "Transmissão da mensagem", notaSubequesito: 2.0, quesitoId: contarLenda.idQuesito },
      { nomeSubquesito: "Utilização de meios lúdicos", notaSubequesito: 1.0, quesitoId: contarLenda.idQuesito }
    ]
  });

  const contarCauso = await prisma.quesitos.create({
    data: { nomeQuesito: "Contar Causo", notaMaximaQuesito: 6.0, opcional: true, blocoProvaIdBloco: blocoArtistica.idBloco },
  });
  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Criatividade", notaSubequesito: 1.0, quesitoId: contarCauso.idQuesito },
      { nomeSubquesito: "Verossimilhança", notaSubequesito: 1.0, quesitoId: contarCauso.idQuesito },
      { nomeSubquesito: "Interpretação", notaSubequesito: 2.0, quesitoId: contarCauso.idQuesito },
      { nomeSubquesito: "Transmissão da mensagem", notaSubequesito: 2.0, quesitoId: contarCauso.idQuesito }
    ]
  });

  const provaCampeira = await prisma.quesitos.create({
    data: { nomeQuesito: "Prova Campeira Regulamentada", notaMaximaQuesito: 6.0, opcional: true, blocoProvaIdBloco: blocoArtistica.idBloco },
  });
  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Conhecimento sobre a prova escolhida", notaSubequesito: 2.0, quesitoId: provaCampeira.idQuesito },
      { nomeSubquesito: "Explicação da prova a ser apresentada", notaSubequesito: 1.5, quesitoId: provaCampeira.idQuesito },
      { nomeSubquesito: "Domínio da prova", notaSubequesito: 2.5, quesitoId: provaCampeira.idQuesito }
    ]
  });

  const provaEsportiva = await prisma.quesitos.create({
    data: { nomeQuesito: "Prova Esportiva Regulamentada", notaMaximaQuesito: 6.0, opcional: true, blocoProvaIdBloco: blocoArtistica.idBloco },
  });
  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Conhecimento sobre a modalidade escolhida", notaSubequesito: 2.0, quesitoId: provaEsportiva.idQuesito },
      { nomeSubquesito: "Explicação técnica da modalidade", notaSubequesito: 2.5, quesitoId: provaEsportiva.idQuesito },
      { nomeSubquesito: "Demonstração prática", notaSubequesito: 1.5, quesitoId: provaEsportiva.idQuesito }
    ]
  });

  const encilhar = await prisma.quesitos.create({
    data: { nomeQuesito: "Encilhar", notaMaximaQuesito: 6.0, opcional: true, blocoProvaIdBloco: blocoArtistica.idBloco },
  });
  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Reconhecimento das peças de encilha", notaSubequesito: 2.0, quesitoId: encilhar.idQuesito },
      { nomeSubquesito: "Domínio teórico da origem e função das peças", notaSubequesito: 2.0, quesitoId: encilhar.idQuesito },
      { nomeSubquesito: "Domínio da prática (ordem das peças e domínio dos procedimentos)", notaSubequesito: 2.0, quesitoId: encilhar.idQuesito }
    ]
  });

  const desenvolturaeExpressaoArt = await prisma.quesitos.create({
    data: { nomeQuesito: "Desenvoltura e Expressão", notaMaximaQuesito: 2.0, opcional: false, blocoProvaIdBloco: blocoArtistica.idBloco },
  });
  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Carisma, educação e postura", notaSubequesito: 0.5, quesitoId: desenvolturaeExpressaoArt.idQuesito },
      { nomeSubquesito: "Fluência, naturalidade, domínio dos assuntos conversados", notaSubequesito: 0.5, quesitoId: desenvolturaeExpressaoArt.idQuesito },
      { nomeSubquesito: "Boa oratória, habilidades de comunicação", notaSubequesito: 0.5, quesitoId: desenvolturaeExpressaoArt.idQuesito },
      { nomeSubquesito: "Iniciativa e proatividade", notaSubequesito: 0.5, quesitoId: desenvolturaeExpressaoArt.idQuesito }
    ]
  });

  // =====================================================
  // BLOCO DOTES
  // =====================================================

  const culinaria = await prisma.quesitos.create({
    data: { nomeQuesito: "Culinária", notaMaximaQuesito: 6, opcional: false, blocoProvaIdBloco: blocoDotes.idBloco },
  });
  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Domínio da técnica da culinária", notaSubequesito: 2, quesitoId: culinaria.idQuesito },
      { nomeSubquesito: "Execução", notaSubequesito: 2, quesitoId: culinaria.idQuesito },
      { nomeSubquesito: "História do prato escolhido / Etnia", notaSubequesito: 2, quesitoId: culinaria.idQuesito },
    ],
  });

  const artesanato = await prisma.quesitos.create({
    data: { nomeQuesito: "Artesanato", notaMaximaQuesito: 6, opcional: false, blocoProvaIdBloco: blocoDotes.idBloco },
  });
  await prisma.subQuesitos.createMany({
    data: [
      { nomeSubquesito: "Domínio da técnica do artesanato", notaSubequesito: 1.5, quesitoId: artesanato.idQuesito },
      { nomeSubquesito: "Execução", notaSubequesito: 2.5, quesitoId: artesanato.idQuesito },
      { nomeSubquesito: "História do artesanato", notaSubequesito: 2, quesitoId: artesanato.idQuesito },
    ],
  });
}