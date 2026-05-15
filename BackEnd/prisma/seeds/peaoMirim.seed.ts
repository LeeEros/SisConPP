import { PrismaClient, VivenciaSubGrupo } from "@prisma/client";

export async function seedPeaoMirim(prisma: PrismaClient) {

  // =====================================================
  // BLOCOS
  // =====================================================

  const blocoOral = await prisma.blocoProva.create({
    data: {
      nomeBloco: "Prova Oral",
      notaMaximaBloco: 65,
      provaPraticaId: 2,
    },
  });

  const blocoArtistica = await prisma.blocoProva.create({
    data: {
      nomeBloco: "Prova Artística",
      notaMaximaBloco: 18,
      provaPraticaId: 2,
    },
  });

  const blocoCampeira = await prisma.blocoProva.create({
    data: {
      nomeBloco: "Prova Campeira",
      notaMaximaBloco: 17,
      provaPraticaId: 2,
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
      {
        nomeSubquesito: "Capricho",
        notaSubequesito: 1.5,
        quesitoId: vivencia.idQuesito,
        subGrupo: VivenciaSubGrupo.APRESENTACAO_PASTA,
      },
      {
        nomeSubquesito: "Organização",
        notaSubequesito: 2,
        quesitoId: vivencia.idQuesito,
        subGrupo: VivenciaSubGrupo.APRESENTACAO_PASTA,
      },
      {
        nomeSubquesito: "Comprovantes de participação",
        notaSubequesito: 2.5,
        quesitoId: vivencia.idQuesito,
        subGrupo: VivenciaSubGrupo.APRESENTACAO_PASTA,
      },

      {
        nomeSubquesito: "Aproveitamento total",
        notaSubequesito: 3,
        quesitoId: vivencia.idQuesito,
        subGrupo: VivenciaSubGrupo.APROVEITAMENTO_TEMPO,
      },
      {
        nomeSubquesito: "Aproveitamento do tempo/participação na ATUAL GESTÃO",
        notaSubequesito: 4.5,
        quesitoId: vivencia.idQuesito,
        subGrupo: VivenciaSubGrupo.APROVEITAMENTO_TEMPO,
      },

      {
        nomeSubquesito: "CTG/Eventos a nível interno",
        notaSubequesito: 3.5,
        quesitoId: vivencia.idQuesito,
        subGrupo: VivenciaSubGrupo.COLABORACAO_PROMOCOES,
      },
      {
        nomeSubquesito: "RT/Eventos a nível regional",
        notaSubequesito: 1,
        quesitoId: vivencia.idQuesito,
        subGrupo: VivenciaSubGrupo.COLABORACAO_PROMOCOES,
      },
      {
        nomeSubquesito: "MTG/Eventos a nível estadual",
        notaSubequesito: 0.5,
        quesitoId: vivencia.idQuesito,
        subGrupo: VivenciaSubGrupo.COLABORACAO_PROMOCOES,
      },
      {
        nomeSubquesito: "CBTG/Eventos da CBTG",
        notaSubequesito: 0.5,
        quesitoId: vivencia.idQuesito,
        subGrupo: VivenciaSubGrupo.COLABORACAO_PROMOCOES,
      },
      {
        nomeSubquesito: "Outros eventos/ outros eventos a nível nacional",
        notaSubequesito: 0.5,
        quesitoId: vivencia.idQuesito,
        subGrupo: VivenciaSubGrupo.COLABORACAO_PROMOCOES,
      },
      {
        nomeSubquesito: "CTG/Eventos a nível interno",
        notaSubequesito: 5.5,
        quesitoId: vivencia.idQuesito,
        subGrupo: VivenciaSubGrupo.PARTICIPACAO_EVENTOS,
      },
      {
        nomeSubquesito: "RT/Eventos a nível regional",
        notaSubequesito: 3,
        quesitoId: vivencia.idQuesito,
        subGrupo: VivenciaSubGrupo.PARTICIPACAO_EVENTOS,
      },
      {
        nomeSubquesito: "MTG/Eventos a nível estadual",
        notaSubequesito: 2.5,
        quesitoId: vivencia.idQuesito,
        subGrupo: VivenciaSubGrupo.PARTICIPACAO_EVENTOS,
      },
      {
        nomeSubquesito: "CBTG/Eventos a nível nacional",
        notaSubequesito: 1.0,
        quesitoId: vivencia.idQuesito,
        subGrupo: VivenciaSubGrupo.PARTICIPACAO_EVENTOS,
      },
      {
        nomeSubquesito: "Outros eventos/ outros eventos a nível nacional",
        notaSubequesito: 1.5,
        quesitoId: vivencia.idQuesito,
        subGrupo: VivenciaSubGrupo.PARTICIPACAO_EVENTOS,
      },
    ],
  });

  // =====================================================
  // PROJETO PRINCIPAL
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
      {
        nomeSubquesito: "Conteúdo e planejamento",
        notaSubequesito: 2,
        quesitoId: projetoPrincipal.idQuesito,
      },
      {
        nomeSubquesito: "Estrutura do documento",
        notaSubequesito: 1.5,
        quesitoId: projetoPrincipal.idQuesito,
      },
      {
        nomeSubquesito: "Execução",
        notaSubequesito: 2.5,
        quesitoId: projetoPrincipal.idQuesito,
      },
      {
        nomeSubquesito: "Relevância/pertinência do projeto para o tradicionalismo e/ou comunidade",
        notaSubequesito: 2.5,
        quesitoId: projetoPrincipal.idQuesito,
      },
      {
        nomeSubquesito: "Apresentação",
        notaSubequesito: 1.5,
        quesitoId: projetoPrincipal.idQuesito,
      },
    ],
  });

  // =====================================================
  // OUTROS PROJETOS
  // =====================================================

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
      {
        nomeSubquesito: "Número de projetos e ações",
        notaSubequesito: 1,
        quesitoId: outrosProjetos.idQuesito,
      },
      {
        nomeSubquesito: "Relevância dos projetos",
        notaSubequesito: 1.5,
        quesitoId: outrosProjetos.idQuesito,
      },
      {
        nomeSubquesito: "Relevância das ações",
        notaSubequesito: 1.5,
        quesitoId: outrosProjetos.idQuesito,
      },
      {
        nomeSubquesito: "Apresentação",
        notaSubequesito: 1,
        quesitoId: outrosProjetos.idQuesito,
      },
    ],
  });

  // =====================================================
  // COMUNICAÇÃO ORAL
  // =====================================================

  const comunicacao = await prisma.quesitos.create({
    data: {
      nomeQuesito: "Comunicação Oral",
      notaMaximaQuesito: 12,
      opcional: false,
      blocoProvaIdBloco: blocoOral.idBloco,
    },
  });

  await prisma.subQuesitos.createMany({
    data: [
      {
        nomeSubquesito: "Qualidade do conteúdo apresentado",
        notaSubequesito: 2,
        quesitoId: comunicacao.idQuesito,
      },
      {
        nomeSubquesito: "Relevância/pertinência do conteúdo escolhido ",
        notaSubequesito: 1.5,
        quesitoId: comunicacao.idQuesito,
      },
      {
        nomeSubquesito: "Conteúdo compatível com categoria",
        notaSubequesito: 1,
        quesitoId: comunicacao.idQuesito,
      },
      {
        nomeSubquesito: "Desenvoltura e expressão durante a explicação da temática escolhida",
        notaSubequesito: 2.5,
        quesitoId: comunicacao.idQuesito,
      },
      {
        nomeSubquesito: "tilização de artifícios lúdicos durante a  explanação",
        notaSubequesito: 2.5,
        quesitoId: comunicacao.idQuesito,
      },
      {
        nomeSubquesito: "Criatividade ultilizada na apresentação",
        notaSubequesito: 2.5,
        quesitoId: comunicacao.idQuesito,
      },
    ],
  });

  // =====================================================
  // DESENVOLTURA
  // =====================================================

  const desenvoltura = await prisma.quesitos.create({
    data: {
      nomeQuesito: "Desenvoltura e Expressão",
      notaMaximaQuesito: 5,
      opcional: false,
      blocoProvaIdBloco: blocoOral.idBloco,
    },
  });

  await prisma.subQuesitos.createMany({
    data: [
      {
        nomeSubquesito: "Carisma, educação e postura",
        notaSubequesito: 0.5,
        quesitoId: desenvoltura.idQuesito,
      },
      {
        nomeSubquesito: "Fluência, naturalidade, domínio dos assuntos conversados ",
        notaSubequesito: 1.5,
        quesitoId: desenvoltura.idQuesito,
      },
      {
        nomeSubquesito: "Boa oratória, habilidades de comunicação",
        notaSubequesito: 1.5,
        quesitoId: desenvoltura.idQuesito,
      },
      {
        nomeSubquesito: "Iniciativa e proatividade",
        notaSubequesito: 1.5,
        quesitoId: desenvoltura.idQuesito,
      },
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
  // DANÇA DE SALÃO
  // =====================================================

  const dancaSalao = await prisma.quesitos.create({
    data: {
      nomeQuesito: "Dança Gaúcha de Salão",
      notaMaximaQuesito: 4,
      opcional: false,
      blocoProvaIdBloco: blocoArtistica.idBloco,
    },
  });

  await prisma.subQuesitos.createMany({
    data: [
      {
        nomeSubquesito: "Harmonia do par",
        notaSubequesito: 0.5,
        quesitoId: dancaSalao.idQuesito,
      },
      {
        nomeSubquesito: "Interpretação artística",
        notaSubequesito: 1.5,
        quesitoId: dancaSalao.idQuesito,
      },
      {
        nomeSubquesito: "Execução dos passos característicos/domínio da sala",
        notaSubequesito: 1,
        quesitoId: dancaSalao.idQuesito,
      },
      {
        nomeSubquesito: "Execução das variações permetidas conforme literatura",
        notaSubequesito: 1,
        quesitoId: dancaSalao.idQuesito,
      },
    ],
  });

  // =====================================================
  // PROVAS OPCIONAIS ARTÍSTICA
  const declamacao = await prisma.quesitos.create({
        data: {
            nomeQuesito: "Declamação",
            notaMaximaQuesito: 6.0,
            opcional: true,
            blocoProvaIdBloco: blocoArtistica.idBloco,
        },
    });

    await prisma.subQuesitos.createMany({
        data: [
            {   
                nomeSubquesito: "Fidelidade ao texto",
                notaSubequesito: 1.0,
                quesitoId: declamacao.idQuesito,
            },
            {
                nomeSubquesito: "Fundamentos de voz: dicção, impostação e inflexão",
                notaSubequesito: 2.0,
                quesitoId: declamacao.idQuesito,
            },
            {
                nomeSubquesito: "Postura cênica e gestual",
                notaSubequesito: 1.5,
                quesitoId: declamacao.idQuesito,
            },
            {
                nomeSubquesito: "Transmissão da mensagem poética",
                notaSubequesito: 1.5,
                quesitoId: declamacao.idQuesito,
            },
        ],
    }); 

    const interpreteVocal = await prisma.quesitos.create({
        data: {
            nomeQuesito: "Intérprete Vocal/Cantar",
            notaMaximaQuesito: 6.0,
            opcional: true,
            blocoProvaIdBloco: blocoArtistica.idBloco,
        },
    });

    await prisma.subQuesitos.createMany({
        data: [
            {
                nomeSubquesito: "Fidelidade à letra",
                notaSubequesito: 1.0,
                quesitoId: interpreteVocal.idQuesito,
            },
            {
                nomeSubquesito: "Afinação",
                notaSubequesito: 1.0,
                quesitoId: interpreteVocal.idQuesito,
            },
            {
                nomeSubquesito: "Ritmo",
                notaSubequesito: 1.0,
                quesitoId: interpreteVocal.idQuesito,
            },
            {
                nomeSubquesito: "Interpretação artística e postura cênica",
                notaSubequesito: 3.0,
                quesitoId: interpreteVocal.idQuesito,
            },
        ],
    });

    const execucaoInstrumental = await prisma.quesitos.create({
        data: {
            nomeQuesito: "Execução Instrumental",
            notaMaximaQuesito: 6.0,
            opcional: true,
            blocoProvaIdBloco: blocoArtistica.idBloco,
        },
    });

    await prisma.subQuesitos.createMany({
        data: [
            {
                nomeSubquesito: "Fidelidade à música",
                notaSubequesito: 1.0,
                quesitoId: execucaoInstrumental.idQuesito,
            },
            {
                nomeSubquesito: "Postura cênica",
                notaSubequesito: 1.0,
                quesitoId: execucaoInstrumental.idQuesito,
            },
            {
                nomeSubquesito: "Afinação do instrumento e ritmo",
                notaSubequesito: 2.0,
                quesitoId: execucaoInstrumental.idQuesito,
            },
            {
                nomeSubquesito: "Técnica (habilidade de execução)",
                notaSubequesito: 2.0,
                quesitoId: execucaoInstrumental.idQuesito,
            },
        ],
    });

    const dancaFolclorica = await prisma.quesitos.create({
        data: {
            nomeQuesito: "Dança Folclórica Tradicional",                notaMaximaQuesito: 5.0,
            opcional: true,
            blocoProvaIdBloco: blocoArtistica.idBloco,
        },
    });

    await prisma.subQuesitos.createMany({
        data: [
            {
                nomeSubquesito: "Harmonia do par",
                notaSubequesito: 1.0,
                quesitoId: dancaFolclorica.idQuesito,
            },
            {
                nomeSubquesito: "Correção coreográfica",
                notaSubequesito: 2.0,
                quesitoId: dancaFolclorica.idQuesito,
            },
            {
                nomeSubquesito: "Interpretação artística",
                notaSubequesito: 2.0,
                quesitoId: dancaFolclorica.idQuesito,
            },
            {
                nomeSubquesito: "Disposição do par na sala",
                notaSubequesito: 1.0,
                quesitoId: dancaFolclorica.idQuesito,
            },
        ],
    });

    const contarLenda = await prisma.quesitos.create({
        data: {
                nomeQuesito: "Contar uma Lenda",
                notaMaximaQuesito: 6.0,
                opcional: true,
                blocoProvaIdBloco: blocoArtistica.idBloco,
        },
    }); 

    await prisma.subQuesitos.createMany({
        data: [
            {
                nomeSubquesito: "Domínio do conteúdo",
                notaSubequesito: 1.0,
                quesitoId: contarLenda.idQuesito,
            }, 
            {
                nomeSubquesito: "Interpretação",
                notaSubequesito: 2.0,
                quesitoId: contarLenda.idQuesito,
            },
            {
                nomeSubquesito: "Transmissão da mensagem",
                notaSubequesito: 2.0,
                quesitoId: contarLenda.idQuesito,
            },
            {
                nomeSubquesito: "Utilização de meios lúdicos",
                notaSubequesito: 1.0,
                quesitoId: contarLenda.idQuesito,
            }
        ]
    });

    const contarCauso = await prisma.quesitos.create({
        data: {
                nomeQuesito: "Contar Causo",    
                notaMaximaQuesito: 6.0,
                opcional: true,
                blocoProvaIdBloco: blocoArtistica.idBloco,
            },
    });

    await prisma.subQuesitos.createMany({
        data: [
            {
                nomeSubquesito: "Criatividade",
                notaSubequesito: 1.0,
                quesitoId: contarCauso.idQuesito,
            },
            {
                nomeSubquesito: "Verossimilhança",
                notaSubequesito: 1.0,
                quesitoId: contarCauso.idQuesito,
            },
            {
                nomeSubquesito: "Interpretação",
                notaSubequesito: 2.0,
                quesitoId: contarCauso.idQuesito,
            },
            {
                nomeSubquesito: "Transmissão da mensagem",
                notaSubequesito: 2.0,
                quesitoId: contarCauso.idQuesito,
            }
        ]
    });

    const chula = await prisma.quesitos.create({
        data: {
                nomeQuesito: "Chula",    
                notaMaximaQuesito: 6.0,
                opcional: true,
                blocoProvaIdBloco: blocoArtistica.idBloco,
            },
    });

    await prisma.subQuesitos.createMany({
        data: [
            {
                nomeSubquesito: "Criatividade",
                notaSubequesito: 1.0,
                quesitoId: chula.idQuesito,
            },
            {
                nomeSubquesito: "Interpretação",
                notaSubequesito: 1.0,
                quesitoId: chula.idQuesito,
            },
            {
                nomeSubquesito: "Ritmo",
                notaSubequesito: 2.0,
                quesitoId: chula.idQuesito,

            },
            {
                nomeSubquesito: "Execução dos passos",
                notaSubequesito: 2.0,
                quesitoId: contarCauso.idQuesito,
            }
        ]
    });

    const desenvolturaeExpressao = await prisma.quesitos.create({
        data: {
            nomeQuesito: "Desenvoltura e Expressão",
            notaMaximaQuesito: 2.0,
            opcional: false,
            blocoProvaIdBloco: blocoArtistica.idBloco,
        },
    });

    await prisma.subQuesitos.createMany({
        data: [
            {
                nomeSubquesito: "Carisma, educação e postura",
                notaSubequesito: 0.5,
                quesitoId: desenvolturaeExpressao.idQuesito,
            },
            {
                nomeSubquesito: "Fluência, naturalidade, domínio dos assuntos conversados",
                notaSubequesito: 0.5,
                quesitoId: desenvolturaeExpressao.idQuesito,
            },
            {
                nomeSubquesito: "Boa oratória, habilidades de comunicação",
                notaSubequesito: 0.5,
                quesitoId: desenvolturaeExpressao.idQuesito,
            },
            {
                nomeSubquesito: "Iniciativa e proatividade",
                notaSubequesito: 0.5,
                quesitoId: desenvolturaeExpressao.idQuesito,
            }
        ]
    });


  // =====================================================
  // PROVA CAMPEIRA
  // =====================================================

  const artesanato = await prisma.quesitos.create({
    data: {
      nomeQuesito: "Artesanato",
      notaMaximaQuesito: 5,
      opcional: false,
      blocoProvaIdBloco: blocoCampeira.idBloco,
    },
  });

  await prisma.subQuesitos.createMany({
    data: [
      {
        nomeSubquesito: "História do artesanato",
        notaSubequesito: 1.5,
        quesitoId: artesanato.idQuesito,
      },
      {
        nomeSubquesito: "Domínio da técnica do artesanato",
        notaSubequesito: 1.5,
        quesitoId: artesanato.idQuesito,
      },
      {
        nomeSubquesito: "Execução do artesanato",
        notaSubequesito: 2.0,
        quesitoId: artesanato.idQuesito,
      },
    ],
  });

  // =====================================================
  // PROVA OPCIONAIS CAMPEIRA
  // =====================================================

  const lacaracavalovacaParada = await prisma.quesitos.create({
    data: {
      nomeQuesito: "Laçar a Cavalo ou Vaca Parada",
      notaMaximaQuesito: 4,
      opcional: true,
      blocoProvaIdBloco: blocoCampeira.idBloco,
    },
  });

   await prisma.subQuesitos.createMany({
    data: [
      {
        nomeSubquesito: "Conhecimento sobre a prova escolhida",
        notaSubequesito: 1.0,
        quesitoId: lacaracavalovacaParada.idQuesito,
      },
      {
        nomeSubquesito: "Explicação da técnica a ser apresentada",
        notaSubequesito: 1.0,
        quesitoId: lacaracavalovacaParada.idQuesito,
      },
      {
        nomeSubquesito: "Domínio da técnica do artesanato",
        notaSubequesito: 2.0,
        quesitoId: lacaracavalovacaParada.idQuesito,
      }
    ],
  });

  const provaderedeas = await prisma.quesitos.create({
    data: {
      nomeQuesito: "Prova de Rédeas",
      notaMaximaQuesito: 4,
      opcional: true,
      blocoProvaIdBloco: blocoCampeira.idBloco,
    },
  });

   await prisma.subQuesitos.createMany({
    data: [
      {
        nomeSubquesito: "Conhecimento sobre a prova escolhida",
        notaSubequesito: 1.0,
        quesitoId: provaderedeas.idQuesito,
      },
      {
        nomeSubquesito: "Explicação da técnica a ser apresentada",
        notaSubequesito: 1.0,
        quesitoId: provaderedeas.idQuesito,
      },
      {
        nomeSubquesito: "Domínio da técnica do artesanato",
        notaSubequesito: 2.0,
        quesitoId: provaderedeas.idQuesito,
      }
    ],
  });

  const reconhecimentoPelagem = await prisma.quesitos.create({
    data: {
      nomeQuesito: "Reconhecimento de Pelagem",
      notaMaximaQuesito: 4,
      opcional: true,
    blocoProvaIdBloco: blocoCampeira.idBloco,
    },
    });

    await prisma.subQuesitos.createMany({
        data: [
            {
        nomeSubquesito: "Conhecimento sobre a prova escolhida",
        notaSubequesito: 1.0,
        quesitoId: reconhecimentoPelagem.idQuesito,
      },
      {
        nomeSubquesito: "Explicação da técnica a ser apresentada",
        notaSubequesito: 1.0,
        quesitoId: reconhecimentoPelagem.idQuesito,
      },
      {
        nomeSubquesito: "Domínio da técnica do artesanato",
        notaSubequesito: 2.0,
        quesitoId: reconhecimentoPelagem.idQuesito,
      }
        ],
    });

  const reconhecimentoPecasEncilha = await prisma.quesitos.create({
    data: {
      nomeQuesito: "Reconhecimento das Peças da Encilha",
      notaMaximaQuesito: 4, 
      opcional: true,
      blocoProvaIdBloco: blocoCampeira.idBloco,
    },
  });

   await prisma.subQuesitos.createMany({
    data: [
      {
        nomeSubquesito: "Conhecimento sobre a prova escolhida",
        notaSubequesito: 1.0,
        quesitoId: reconhecimentoPecasEncilha.idQuesito,
      },
      {
        nomeSubquesito: "Explicação da técnica a ser apresentada",
        notaSubequesito: 1.0,
        quesitoId: reconhecimentoPecasEncilha.idQuesito,
      },
      {
        nomeSubquesito: "Domínio da técnica do artesanato",
        notaSubequesito: 2.0,
        quesitoId: reconhecimentoPecasEncilha.idQuesito,
      }
    ],
  });

  const encilhar = await prisma.quesitos.create({
    data: {
        nomeQuesito: "Encilhar",
        notaMaximaQuesito: 4,
        opcional: true,
        blocoProvaIdBloco: blocoCampeira.idBloco,
    },
  });

   await prisma.subQuesitos.createMany({
    data: [
      {
        nomeSubquesito: "Conhecimento sobre a prova escolhida",
        notaSubequesito: 1.0,
        quesitoId: encilhar.idQuesito,
      },
      {
        nomeSubquesito: "Explicação da técnica a ser apresentada",
        notaSubequesito: 1.0,
        quesitoId: encilhar.idQuesito,
      },
      {
        nomeSubquesito: "Domínio da técnica do artesanato",
        notaSubequesito: 2.0,
        quesitoId: encilhar.idQuesito,
      }
    ],
  });

  const prepararChimarrao = await prisma.quesitos.create({
    data: {
        nomeQuesito: "Preparar Chimarrão",
        notaMaximaQuesito: 4,
        opcional: true,
        blocoProvaIdBloco: blocoCampeira.idBloco,
    },
  });

   await prisma.subQuesitos.createMany({
    data: [
      {
        nomeSubquesito: "Conhecimento sobre a prova escolhida",
        notaSubequesito: 1.0,
        quesitoId: prepararChimarrao.idQuesito,
      },
      {
        nomeSubquesito: "Explicação da técnica a ser apresentada",
        notaSubequesito: 1.0,
        quesitoId: prepararChimarrao.idQuesito,
      },
      {
        nomeSubquesito: "Domínio da técnica do artesanato",
        notaSubequesito: 2.0,
        quesitoId: prepararChimarrao.idQuesito,
      }
    ],
  });

  const prepararChurrasco = await prisma.quesitos.create({
    data: {
        nomeQuesito: "Preparar Churrasco",
        notaMaximaQuesito: 4,
        opcional: true,
        blocoProvaIdBloco: blocoCampeira.idBloco,
    },
  });

   await prisma.subQuesitos.createMany({
    data: [
      {
        nomeSubquesito: "Conhecimento sobre a prova escolhida",
        notaSubequesito: 1.0,
        quesitoId: prepararChurrasco.idQuesito,
      },
      {
        nomeSubquesito: "Explicação da técnica a ser apresentada",
        notaSubequesito: 1.0,
        quesitoId: prepararChurrasco.idQuesito,
      },
      {
        nomeSubquesito: "Domínio da técnica do artesanato",
        notaSubequesito: 2.0,
        quesitoId: prepararChurrasco.idQuesito,
      }
    ],
  });

  const nodelenco = await prisma.quesitos.create({
    data: {
        nomeQuesito: "Nó do Lenço",
        notaMaximaQuesito: 4,
        opcional: true,
        blocoProvaIdBloco: blocoCampeira.idBloco,
    },
  });

   await prisma.subQuesitos.createMany({
    data: [
      {
        nomeSubquesito: "Conhecimento sobre a prova escolhida",
        notaSubequesito: 1.0,
        quesitoId: nodelenco.idQuesito,
      },
      {
        nomeSubquesito: "Explicação da técnica a ser apresentada",
        notaSubequesito: 1.0,
        quesitoId: nodelenco.idQuesito,
      },
      {
        nomeSubquesito: "Domínio da técnica do artesanato",
        notaSubequesito: 2.0,
        quesitoId: nodelenco.idQuesito,
      }
    ],
  });
}