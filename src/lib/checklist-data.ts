export type Status = 'pendente' | 'em_andamento' | 'concluido' | 'na'

export interface ItemState {
  id?: string // record ID in PB
  item_id: string
  status: Status
  responsavel: string
  anotacao: string
}

export const HOJE = new Date()
HOJE.setHours(0, 0, 0, 0)

export const TARGET_DATE = '2026-06-07'

export const cronograma = [
  {
    data: '2026-05-18',
    titulo: 'Publicação do Edital',
    desc: 'Anexo I do Edital nº 189/2026.',
    tipo: 'oficial',
  },
  {
    data: '2026-05-20',
    titulo: 'Encerramento do período de impugnação',
    desc: 'Período: 18/05/2026 a 20/05/2026 (Anexo I). Impugnação por e-mail a edital-educacaoinclusiva@alvorada.rs.gov.br.',
    tipo: 'oficial',
  },
  {
    data: '2026-05-22',
    titulo: 'Encerramento da análise da impugnação',
    desc: 'Período: 21/05/2026 a 22/05/2026 (Anexo I).',
    tipo: 'oficial',
  },
  {
    data: '2026-05-25',
    titulo: 'Divulgação do resultado da impugnação',
    desc: 'Anexo I do Edital.',
    tipo: 'oficial',
  },
  {
    data: '2026-06-02',
    titulo: 'Início do período de inscrição',
    desc: 'Anexo I e item 3.2: 02/06/2026.',
    tipo: 'oficial',
  },
  {
    data: '2026-06-07',
    titulo: 'Encerramento das inscrições (item 3.2 do Edital)',
    desc: 'O item 3.2 indica 07/06/2026. O Anexo I indica 08/06/2026. Em caso de divergência interna, adotar a data mais restritiva (07/06).',
    tipo: 'critico',
  },
  {
    data: '2026-06-08',
    titulo: 'Encerramento das inscrições (Anexo I do Edital)',
    desc: 'Anexo I indica 08/06/2026. Divergente do item 3.2 (07/06).',
    tipo: 'oficial',
  },
  {
    data: '2026-06-10',
    titulo: 'Encerramento da análise das inscrições e documentação',
    desc: 'Período: 09/06/2026 a 10/06/2026 (Anexo I).',
    tipo: 'oficial',
  },
  {
    data: '2026-06-11',
    titulo: 'Divulgação do resultado preliminar',
    desc: 'Anexo I do Edital.',
    tipo: 'critico',
  },
  {
    data: '2026-06-12',
    titulo: 'Recurso contra indeferimento',
    desc: 'Anexo I. O item 3.5 admite apresentação de novos documentos exclusivamente para sanar falhas/inconsistências verificadas na inscrição ou documentação.',
    tipo: 'critico',
  },
  {
    data: '2026-06-15',
    titulo: 'Análise de recursos',
    desc: 'Anexo I do Edital.',
    tipo: 'oficial',
  },
  {
    data: '2026-06-16',
    titulo: 'Divulgação do resultado dos recursos e publicação do resultado final',
    desc: 'Anexo I do Edital.',
    tipo: 'critico',
  },
]

export const categorias = [
  {
    id: 'impugnacao',
    nome: 'Janela de impugnação (Anexo I)',
    descricao: 'Registro do procedimento inicial do certame · prazo já encerrado',
    nota: 'O Edital prevê apenas a janela de impugnação. Não há, no texto convocatório, etapa formal de “pedido de esclarecimento” distinta da impugnação. O prazo de impugnação encerrou em 20/05/2026 (Anexo I). Esta seção registra a decisão da OSC sobre esse prazo e o alerta operacional decorrente da divergência interna do Edital sobre o encerramento das inscrições.',
    itens: [
      {
        titulo: 'Registro da decisão sobre a janela de impugnação encerrada em 20/05/2026',
        desc: 'A janela ocorreu entre 18/05/2026 e 20/05/2026 (Anexo I). A análise pela SMED ocorreu entre 21/05/2026 e 22/05/2026, com divulgação do resultado em 25/05/2026. Registrar internamente se houve análise crítica do Edital pela OSC e a motivação técnica de eventual decisão de não impugnar.',
        refs: [{ t: 'Edital, Anexo I', c: 'anexo' }],
        critico: true,
      },
      {
        titulo: 'Adoção interna da data mais restritiva para o encerramento das inscrições',
        desc: 'O item 3.2 do corpo do Edital indica encerramento em 07/06/2026; o Anexo I (Cronograma) indica 08/06/2026. Em face da divergência interna do Edital, a OSC deve adotar como limite operacional 07/06/2026, evitando o risco do entendimento mais restritivo da SMED.',
        refs: [
          { t: 'Edital, 3.2', c: 'edital' },
          { t: 'Anexo I', c: 'anexo' },
        ],
        critico: true,
      },
    ],
  },
  {
    id: 'logistica',
    nome: 'Logística do protocolo',
    descricao: 'Itens 3.2, 3.3, 3.4, 3.5, 3.7, 4.10, 4.13 e 4.14 do Edital',
    nota: 'A logística do protocolo é matéria do próprio Edital. O item 3.7 afasta a responsabilidade da SMED por problemas técnicos no envio; o item 4.13 atribui à OSC integral responsabilidade pela veracidade das informações prestadas e por eventuais erros no envio; o item 4.14 reforça que a SMED não se responsabiliza por inconsistências na documentação. Toda a precaução operacional decorre desses três dispositivos.',
    itens: [
      {
        titulo: 'Veículo único de protocolo — e-mail edital-educacaoinclusiva@alvorada.rs.gov.br',
        desc: 'Itens 3.2 e 3.3 do Edital. O item 3.7 veda expressamente o envio por meios diversos. Confirmar acesso institucional ao remetente que assinará o envio.',
        refs: [{ t: 'Edital, 3.2 / 3.3 / 3.7', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Formato PDF',
        desc: 'Item 3.3. O formulário de inscrição e a documentação exigida devem ser encaminhados em formato PDF.',
        refs: [{ t: 'Edital, 3.3', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Identificação do título do e-mail',
        desc: 'Item 3.3: o e-mail deve ser identificado no título como “INSCRIÇÃO EDITAL Nº 189/2026”. O Anexo VII orienta que, no assunto do e-mail, seja identificada a OSC precedida dessa expressão.',
        refs: [
          { t: 'Edital, 3.3', c: 'edital' },
          { t: 'Anexo VII', c: 'anexo' },
        ],
        critico: true,
      },
      {
        titulo: 'Envio dentro da janela 02/06 a 07/06/2026 (limite interno conservador)',
        desc: 'Item 3.2: 02/06/2026 a 07/06/2026. Anexo I (Cronograma): 02/06/2026 a 08/06/2026. Em razão da divergência interna do Edital, adotar 07/06 como limite operacional. Item 3.4: inscrições enviadas fora do prazo não serão consideradas.',
        refs: [
          { t: 'Edital, 3.2 / 3.4', c: 'edital' },
          { t: 'Anexo I', c: 'anexo' },
        ],
        critico: true,
      },
      {
        titulo: 'Margem de antecipação no envio efetivo',
        desc: 'Decorrência operacional do item 3.7: a SMED não se responsabiliza pelo não recebimento da documentação em razão de problemas técnicos. O envio com antecedência preserva janela para reenvio em caso de falha técnica.',
        refs: [{ t: 'Edital, 3.7', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Conferência integral de assinaturas em todas as declarações',
        desc: 'Item 4.10: todas as declarações devem estar assinadas e datadas pelo dirigente máximo da OSC, acompanhadas do documento de identificação, de cópia autenticada, de assinatura eletrônica válida ou original digitalizada. Documento sem assinatura é desconsiderado.',
        refs: [{ t: 'Edital, 4.10', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Veracidade das informações e da documentação enviada',
        desc: 'Item 4.13: a OSC é integralmente responsável pela veracidade das informações prestadas, bem como por eventuais erros no envio ou no preenchimento da documentação, os quais serão de sua exclusiva responsabilidade. Item 4.14: a SMED não se responsabiliza por inconsistências na documentação.',
        refs: [{ t: 'Edital, 4.13 / 4.14', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Conhecimento do regime de complementação documental em recurso',
        desc: 'Item 3.5: durante o prazo destinado a recursos do indeferimento da inscrição e da documentação (12/06/2026, conforme Anexo I), será admitida a apresentação de novos documentos exclusivamente com a finalidade de sanar falhas ou inconsistências verificadas na inscrição realizada dentro do prazo estipulado ou na documentação anteriormente encaminhada.',
        refs: [
          { t: 'Edital, 3.5', c: 'edital' },
          { t: 'Anexo I', c: 'anexo' },
        ],
      },
      {
        titulo: 'Conhecimento da regra do item 4.15 — submissão como aceitação integral',
        desc: 'Item 4.15: a submissão da proposta implica a aceitação integral das regras do Edital, não sendo aceita alegação de desconhecimento. Reforçado pelo item 14.5 (não serão aceitas, em quaisquer fases, alegações de desconhecimento das normas do Edital e da legislação aplicável).',
        refs: [{ t: 'Edital, 4.15 / 14.5', c: 'edital' }],
      },
    ],
  },
  {
    id: 'envelope',
    nome: 'Documentos do envelope (habilitação)',
    descricao: 'Itens 3.1, 3.6 e 4 do Edital + Anexos II, III, IV, V e VII',
    nota: 'Toda a documentação a ser enviada por e-mail no PDF acompanhando o formulário de inscrição (item 3.1). A análise das inscrições e documentação é conduzida pela Comissão de Seleção entre 09/06 e 10/06/2026 (Anexo I). O resultado preliminar é divulgado em 11/06/2026, com prazo de recurso em 12/06/2026 — o item 3.5 admite, nesse momento, apresentação de novos documentos exclusivamente para sanar falhas verificadas na inscrição.',
    itens: [
      {
        titulo:
          'Anexo VII — Formulário de Inscrição preenchido e assinado pelo representante legal',
        desc: 'Item 3.1 e Anexo VII. Identificação completa da OSC (nome, endereço, CEP, CNPJ, telefone, e-mail) e do representante legal (nome, RG, CPF, telefone, e-mail). Declaração de ciência de que a inscrição prévia não implica formalização da parceria e de aceitação das normas do Edital.',
        refs: [
          { t: 'Edital, 3.1', c: 'edital' },
          { t: 'Anexo VII', c: 'anexo' },
        ],
        critico: true,
      },
      {
        titulo: 'Anexo II — Plano de Trabalho preenchido',
        desc: 'Item 3.6: a OSC deverá encaminhar o Plano de Trabalho, conforme modelo do Anexo II, junto com a solicitação de participação. O modelo contempla dados cadastrais (incluindo dados bancários em banco público — item 7.6), público-alvo, descrição da realidade, finalidade estatutária, proposta de trabalho, apresentação, objeto da parceria, justificativa, objetivos (geral conforme Meta 4 do PME — Lei Municipal nº 2.897/2015 — e específicos previstos no Anexo II), metas conforme item 8.2, ações, parâmetros de aferição conforme item 8.3, metodologia, resultados esperados, horário de atendimento, previsão de receita e despesas com cronograma de desembolso, detalhamento da aplicação dos recursos, remuneração da equipe conforme item 5.4, encargos sociais, e declaração final do representante legal de inexistência de débito com a Administração Pública Municipal.',
        refs: [
          { t: 'Edital, 3.6', c: 'edital' },
          { t: 'Anexo II', c: 'anexo' },
        ],
        critico: true,
      },
      {
        titulo: 'Coerência do Plano de Trabalho com as diretrizes pedagógicas da SMED',
        desc: 'Item 12.4: propostas com Planos de Trabalho em desacordo com as diretrizes pedagógicas da Secretaria Municipal de Educação serão automaticamente desclassificadas, conforme facultado pela Lei nº 13.019/2014.',
        refs: [{ t: 'Edital, 12.4', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Plano de Formação Continuada alinhado ao PPP, sujeito à aprovação da SMED',
        desc: 'Itens 2.2.1 e 2.2.2: o Plano de Formação Continuada deve estar alinhado com o Projeto Político-Pedagógico das escolas e ser aprovado pela equipe técnica da Secretaria Municipal de Educação. Carga horária mínima de 12 horas anuais em cada escola em que desenvolvida a parceria.',
        refs: [{ t: 'Edital, 2.2.1 / 2.2.2', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Cópia do documento de identidade e CPF do representante legal',
        desc: 'Item 4.5. Documentos compatíveis com a Ata de Eleição (item 4.6, “b”) e com a subscrição das declarações dos Anexos III, IV e V.',
        refs: [{ t: 'Edital, 4.5', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Cópia do Estatuto registrado e das suas alterações',
        desc: 'Item 4.6, “a”. Observar o art. 33 da Lei nº 13.019/2014.',
        refs: [{ t: "Edital, 4.6 'a'", c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Estatuto contém cláusula de destinação do patrimônio em caso de dissolução',
        desc: 'Item 4.8, I. O estatuto deve prever expressamente que, em caso de dissolução, o patrimônio líquido seja transferido a outra pessoa jurídica de igual natureza que preencha os requisitos da Lei nº 13.019/2014, e cujo objeto seja preferencialmente o mesmo da entidade extinta (inc. III do art. 33).',
        refs: [{ t: 'Edital, 4.8 I', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Estatuto contém cláusula de escrituração contábil conforme NBC',
        desc: 'Item 4.8, II. O estatuto deve prever expressamente escrituração de acordo com os princípios fundamentais de contabilidade e com as Normas Brasileiras de Contabilidade (inc. IV do art. 33 da Lei nº 13.019/2014).',
        refs: [{ t: 'Edital, 4.8 II', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Regimento interno, se necessário',
        desc: 'Item 4.6, “a”, parte final. Apresentar apenas se houver e for relevante à demonstração da governança.',
        refs: [{ t: "Edital, 4.6 'a'", c: 'edital' }],
      },
      {
        titulo: 'Cópia da Ata de Eleição do quadro dirigente atual, registrada no órgão competente',
        desc: 'Item 4.6, “b”. Verificar registro e vigência do mandato.',
        refs: [{ t: "Edital, 4.6 'b'", c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Comprovante de inscrição no CNPJ, com cadastro ativo',
        desc: 'Item 4.6, “c”, I. Documentação emitida pela Secretaria da Receita Federal do Brasil.',
        refs: [{ t: "Edital, 4.6 'c' I", c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'CNPJ com no mínimo 1 (um) ano de existência',
        desc: 'Item 4.6, “c”, II. Verificada pela data de abertura no CNPJ, a contar da data de solicitação de participação no certame.',
        refs: [{ t: "Edital, 4.6 'c' II", c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'CND Federal — Tributos Federais e Dívida Ativa da União',
        desc: 'Item 4.6, “c”, III. Atualizada e válida na data do envio. Item 4.9: serão aceitas certidões positivas com efeito de negativa.',
        refs: [
          { t: "Edital, 4.6 'c' III", c: 'edital' },
          { t: 'Edital, 4.9', c: 'edital' },
        ],
        critico: true,
      },
      {
        titulo: 'CND Municipal de Alvorada',
        desc: 'Item 4.6, “c”, IV, primeira parte. Atualizada e válida. Necessária ainda que a OSC tenha sede em outro município.',
        refs: [{ t: "Edital, 4.6 'c' IV", c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'CND Municipal da sede da OSC, se diversa de Alvorada',
        desc: 'Item 4.6, “c”, IV, parte final. Exigida quando a sede da OSC for em outro município.',
        refs: [{ t: "Edital, 4.6 'c' IV", c: 'edital' }],
      },
      {
        titulo: 'CRF/FGTS — Certificado de Regularidade do FGTS',
        desc: 'Item 4.6, “c”, V. Atualizado e válido.',
        refs: [{ t: "Edital, 4.6 'c' V", c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'CNDT — Certidão Negativa de Débitos Trabalhistas',
        desc: 'Item 4.6, “c”, VI. Atualizada e válida.',
        refs: [{ t: "Edital, 4.6 'c' VI", c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'CND da Fazenda Estadual — SEFAZ-RS',
        desc: 'Item 4.6, “c”, VII. Certidão de Regularidade Fiscal Estadual.',
        refs: [{ t: "Edital, 4.6 'c' VII", c: 'edital' }],
        critico: true,
      },
      {
        titulo:
          'Anexo V — Declaração de não ocorrência dos impedimentos do art. 39 da Lei nº 13.019/2014',
        desc: 'Item 4.7, I. Confirmação, sob as penas da lei, das cláusulas: regular constituição; não omissão em prestação de contas anterior; ausência de dirigente nas vedações relativas a membros de Poder, MP ou dirigentes públicos; não ter contas rejeitadas nos últimos 5 anos; não estar sob sanção de suspensão ou inidoneidade; não ter contas julgadas irregulares por Tribunal ou Conselho de Contas, em decisão irrecorrível, nos últimos 8 anos; e não ter, entre dirigentes, pessoas em tais situações.',
        refs: [
          { t: 'Edital, 4.7 I', c: 'edital' },
          { t: 'Anexo V', c: 'anexo' },
        ],
        critico: true,
      },
      {
        titulo: 'Anexo III — Declaração e relação nominal atualizada dos dirigentes',
        desc: 'Item 4.7, II. Dirigentes conforme estatuto, com endereço, telefone, e-mail, RG (com órgão expedidor) e CPF. Declaração de inexistência das vedações do art. 39, § 5º, da Lei nº 13.019/2014.',
        refs: [
          { t: 'Edital, 4.7 II', c: 'edital' },
          { t: 'Anexo III', c: 'anexo' },
        ],
        critico: true,
      },
      {
        titulo: 'Anexo IV — Declaração de cumprimento do art. 7º, XXXIII, da Constituição',
        desc: 'Item 4.7, III. Não emprega menor de 18 em trabalho noturno, perigoso ou insalubre; nem menor de 16 em qualquer trabalho, salvo aprendiz a partir de 14 anos.',
        refs: [
          { t: 'Edital, 4.7 III', c: 'edital' },
          { t: 'Anexo IV', c: 'anexo' },
        ],
        critico: true,
      },
      {
        titulo: 'Atestados de Capacidade Técnica',
        desc: 'Item 4.11. De pessoa jurídica pública ou privada, em gestão educacional, educação infantil, projetos de inclusão ou outras áreas que sejam objeto do Edital.',
        refs: [{ t: 'Edital, 4.11', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Conteúdo mínimo dos atestados',
        desc: 'Item 4.12. Cada atestado deve conter: nome da entidade e CNPJ, objeto/projeto, endereço, período de execução (datas) e assinatura do responsável.',
        refs: [{ t: 'Edital, 4.12', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Documentação para pontuação — Tempo de existência da OSC',
        desc: 'Item 12.2, “a”. Comprovação pelo CNPJ. 10 pontos para 3 a 5 anos; 20 pontos para mais de 5 e até 10 anos; 30 pontos para mais de 10 anos. Teto: 30 pontos.',
        refs: [{ t: "Edital, 12.2 'a'", c: 'edital' }],
      },
      {
        titulo: 'Documentação para pontuação — Serviços na área de Educação Básica',
        desc: 'Item 12.2, “b”. 5 pontos por cada atestado de capacidade técnica em parcerias, convênios ou contratos de gestão voltados ao apoio escolar na rede pública ou privada. Teto: 30 pontos (6 atestados).',
        refs: [{ t: "Edital, 12.2 'b'", c: 'edital' }],
      },
      {
        titulo: 'Documentação para pontuação — Serviços na área de Educação Inclusiva',
        desc: 'Item 12.2, “c”. 10 pontos por cada projeto de educação inclusiva comprovadamente executado, com duração mínima de 12 (doze) meses. Teto: 40 pontos (4 projetos). Critério principal e primeiro critério de desempate (item 12.3).',
        refs: [
          { t: "Edital, 12.2 'c'", c: 'edital' },
          { t: 'Edital, 12.3', c: 'edital' },
        ],
        critico: true,
      },
    ],
  },
  {
    id: 'celebracao',
    nome: 'Pós-seleção e celebração',
    descricao: 'Itens 1.6, 1.7, 2.4.2, 2.5, 5.4, 5.10 a 5.14.1, 7.6 e cláusula 10 do Edital',
    nota: 'Esta seção fica em segundo plano durante a fase de habilitação — apenas para conhecimento e organização antecipada. Ativa-se após o resultado final, em 16/06/2026 (Anexo I). Cada OSC homologada deverá, em ordem de classificação, escolher um único lote regional (itens 1.6 e 1.7) e estar pronta para iniciar a execução em até 15 dias após a ordem de início (item 5.10).',
    itens: [
      {
        titulo: 'Escolha do lote regional, conforme ordem de classificação',
        desc: 'Item 1.6: cada OSC deverá escolher 01 (um) único lote regional para formalização de parceria, com ordem de preferência definida pela classificação final. Item 1.7: caso não haja interessados para a totalidade dos 04 (quatro) lotes, a Administração poderá convocar OSCs já homologadas para suprir a demanda. Item 7.3: valores máximos por região — Alfa R$ 170.403,21/mês, Beta R$ 117.550,21/mês, Gama R$ 129.986,21/mês, Delta R$ 108.223,20/mês. Anexo VI: distribuição de escolas e percentual de público-alvo por região.',
        refs: [
          { t: 'Edital, 1.6 / 1.7 / 7.3', c: 'edital' },
          { t: 'Anexo VI', c: 'anexo' },
        ],
        critico: true,
      },
      {
        titulo:
          'Abertura de conta em instituição financeira pública, exclusiva e isenta de tarifas',
        desc: 'Item 7.6. Conta utilizada unicamente para a movimentação dos recursos repassados pelo Município.',
        refs: [{ t: 'Edital, 7.6', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Designação do Coordenador, com ensino superior preferencialmente na área afim',
        desc: 'Itens 2.5 e 2.5.1: Coordenador com ensino superior, preferencialmente com curso na área afim, responsável por coordenar o trabalho dos profissionais de Educação Especial. Item 5.4: 1 Coordenador, 20h semanais. Item 5.5: se a OSC firmar parceria em mais de um lote, fica limitada a um único coordenador, com carga ampliada para 40h semanais.',
        refs: [{ t: 'Edital, 2.5 / 5.4 / 5.5', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Composição rígida da equipe técnica (item 5.4)',
        desc: 'Por lote: 1 Coordenador (20h), 1 Assistente Social (30h), 2 Psicólogos (20h cada, em turnos alternados manhã e tarde). Agentes de Educação Inclusiva por zona: Alfa 50, Beta 33, Gama 37, Delta 30 — total 150. Item 2.4.1: Agentes com ensino médio completo e, preferencialmente, com curso na área de Educação Inclusiva.',
        refs: [{ t: 'Edital, 5.4 / 2.4.1', c: 'edital' }],
        critico: true,
      },
      {
        titulo:
          'Conclusão da formação dos Agentes ofertada pela SMED antes do início das atividades',
        desc: 'Item 2.4.2: a SMED ofertará formação na área de Educação Inclusiva antes da apresentação dos Agentes nas Escolas, bem como sempre que necessário ao longo da execução. Item 5.10: indispensável que os Agentes tenham concluído essa formação até a data de início das atividades.',
        refs: [{ t: 'Edital, 2.4.2 / 5.10', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Disponibilização do quadro completo em até 15 dias após a assinatura',
        desc: 'Item 5.10: a execução do objeto deverá iniciar em até 15 (quinze) dias após a assinatura do Termo de Colaboração. Nesse prazo, a OSC deverá apresentar o quadro completo de profissionais.',
        refs: [{ t: 'Edital, 5.10', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Encaminhamento do quadro completo de contratados à equipe gestora',
        desc: 'Item 5.11: após o prazo do item 5.10, a OSC deverá encaminhar o quadro completo de profissionais contratados à equipe gestora da parceria.',
        refs: [{ t: 'Edital, 5.11', c: 'edital' }],
      },
      {
        titulo: 'Eventual pedido de prorrogação com 5 dias de antecedência',
        desc: 'Item 5.12: caso não seja possível disponibilizar os profissionais na data prevista, a OSC deverá comunicar formalmente à Administração a justificativa, com antecedência mínima de 5 dias consecutivos, ressalvados os casos de força maior e caso fortuito devidamente comprovados.',
        refs: [{ t: 'Edital, 5.12', c: 'edital' }],
      },
      {
        titulo: 'Vedação à contratação com recursos da parceria de parentes de agentes da SMED',
        desc: 'Item 4.7.1: a OSC deverá observar os princípios da moralidade e impessoalidade, sendo vedada a utilização de recursos da parceria para contratação de cônjuge, companheiro ou parente até o terceiro grau de agentes públicos vinculados à Secretaria Municipal de Educação. A vedação tem efeito direto sobre a montagem da equipe.',
        refs: [{ t: 'Edital, 4.7.1', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Vedação à subcontratação integral do objeto',
        desc: 'Item 5.3.1: é vedada a subcontratação integral do objeto da parceria, admitindo-se apenas contratações acessórias indispensáveis à execução das atividades previstas no Plano de Trabalho.',
        refs: [{ t: 'Edital, 5.3.1', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Fornecimento de EPI adequado às atividades',
        desc: 'Item 5.14.1: a OSC será integralmente responsável pelo fornecimento de EPI adequados, especialmente nos casos que envolvam auxílio em higiene pessoal, troca de fraldas, alimentação assistida e demais atividades correlatas.',
        refs: [{ t: 'Edital, 5.14.1', c: 'edital' }],
      },
      {
        titulo: 'Substituição imediata em licença superior a 15 dias ou desligamento',
        desc: 'Item 5.14: a OSC deverá providenciar substituição imediata de profissionais em casos de licença superior a 15 dias ou desligamento. A Gestora pode solicitar substituição por conduta inadequada ou desempenho insuficiente, mediante solicitação fundamentada.',
        refs: [{ t: 'Edital, 5.14', c: 'edital' }],
      },
      {
        titulo: 'Reuniões mensais de alinhamento — escolas/OSC e coordenador/SMED',
        desc: 'Item 5.7: reuniões de alinhamento entre as escolas e a OSC, no mínimo mensalmente, sob a coordenação do responsável designado; e, também mensalmente, reuniões entre o coordenador e a equipe da SMED.',
        refs: [{ t: 'Edital, 5.7', c: 'edital' }],
      },
      {
        titulo: 'Termos de Confidencialidade para funcionários e prestadores',
        desc: 'Item 10.3: dever da entidade garantir que seus funcionários e prestadores de serviços externos assinem Termos de Confidencialidade específicos, comprometendo-se a não utilizar as informações obtidas para finalidades diversas do objeto da parceria.',
        refs: [{ t: 'Edital, 10.3', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Medidas técnicas e administrativas de proteção de dados pessoais',
        desc: 'Item 10.1: a OSC terá acesso a dados pessoais sensíveis de crianças e adolescentes, assumindo a condição de operadora, sob a Lei nº 13.709/2018. Item 10.2: implementar medidas técnicas e administrativas aptas a proteger os dados contra acessos não autorizados e situações acidentais ou ilícitas de destruição, perda, alteração ou difusão.',
        refs: [{ t: 'Edital, 10.1 / 10.2', c: 'edital' }],
        critico: true,
      },
      {
        titulo: 'Notificação de incidente de segurança à SMED',
        desc: 'Item 10.4: em caso de incidente de segurança ou vazamento de dados, a OSC deverá notificar a SMED. Item 10.5: a omissão na notificação ou a negligência na guarda dos dados acarretará responsabilidade civil, sem prejuízo das sanções administrativas previstas no MROSC.',
        refs: [{ t: 'Edital, 10.4 / 10.5', c: 'edital' }],
        critico: true,
      },
    ],
  },
].map((c, i) => ({
  ...c,
  numero: i + 2,
  itens: c.itens.map((it, j) => ({
    ...it,
    id: `${c.id}-${j + 1}`,
    numero: `${i + 2}.${j + 1}`,
  })),
}))
