import cheerio from 'cheerio';
import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/quave:synced-cron';
import { VereadoresCollection } from '../api/vereadores';

SyncedCron.config({
  log: true,
});

Meteor.startup(() => {
  SyncedCron.add({
    name: 'Sync Vereadores',
    schedule(parser) {
      return parser.text('every 4 years');
    },
    job: async () => {
      // eslint-disable-next-line no-console
      console.log(`Staring sync Vereadores - ${new Date()}`);

      const apiReturn = await fetch(
        'https://www.cmbh.mg.gov.br/vereadores?title=&tid=All',
        {
          headers: {
            accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
          body: null,
          method: 'GET',
        }
      );

      const body = await apiReturn.text();

      const $ = cheerio.load(body);

      const vereadoresElements = $('.view-content .vereador');
      for await (const element of vereadoresElements) {
        const imgSrc = $(element)
          .find('.views-field-field-foto img')
          .attr('src');

        const partySigla = $(element)
          .find('.views-field-field-sigla .field-content')
          .text()
          .trim();

        const vereadorName = $(element)
          .find('.views-field-title .field-content a')
          .text()
          .trim();

        const vereador = {
          name: vereadorName,
          party: partySigla,
          imgSrc,
        };

        await VereadoresCollection.updateAsync(
          { name: vereadorName },
          { $set: vereador },
          { upsert: true }
        );
      }

      // eslint-disable-next-line no-console
      console.log(`End sync Vereadores - ${new Date()}`);
    },
    allowParallelExecution: true,
  });
  SyncedCron.start();
});

Meteor.startup(() => {
  SyncedCron.add({
    name: 'Sync Vereadores Details',
    schedule(parser) {
      return parser.text('every 4 years');
    },
    allowParallelExecution: true,
    job: async () => {
      const vereadores = [
        {
          name: 'Arruda',
          fullName: 'Enedino José de Arruda',
          about: [
            'Enedino José de Arruda, mais conhecido como Arruda, tem 57 anos e foi eleito vereador da capital mineira em sua primeira candidatura, com 8.668 votos. Morador de Minas Gerais há mais de 27 anos, é natural de Acorizal, no estado de Mato Grosso, e é casado. É membro do partido Republicanos e se destaca pelo seu compromisso com as causas sociais, a defesa dos valores cristãos e familiares e o desejo de construir um futuro melhor para Belo Horizonte.',
            'Arruda é um cristão fervoroso, que acredita no poder de transformação da fé e do trabalho conjunto. Seu mandato será dedicado a atuar pelo bem-estar da população, com especial atenção à proteção dos idosos. Para ele, a cidade precisa ser mais inclusiva e oferecer qualidade de vida a todos os seus cidadãos, especialmente àqueles que mais necessitam de cuidados e atenção.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Braulio Lara',
          fullName: 'Braulio Alves Silva Lara',
          about: [
            'Eleito em 2024 para o segundo mandato com 9.992 votos, Braulio Lara é natural de Belo Horizonte, casado e pai de três filhos. Empresário do setor imobiliário, é mestre e graduado em Ciência da Computação, especialista em Gestão de Custos e Controladoria e professor no curso de Engenharia Civil do UniBH.',
            'Em 2015, iniciou sua atuação na Associação do Bairro Buritis (ABB), da qual se tornou presidente a partir de 2017. Em seu primeiro mandato, quando recebeu 5.776 votos, destacou-se por participar de cinco Comissões Parlamentares de Inquérito (CPI): duas sobre a Lagoa da Pampulha; Ônibus Sem Qualidade; Caixa Preta da BHTrans e População em Situação de Rua.',
            'É autor de leis como a 11.392/22, que determina a retirada de fios e cabos inutilizados dos postes; a 11.362/222, sobre Transparência em Obras Públicas; a 11.530/23, que estabelece o ITBI sobre o valor declarado; e a 11.501/23, que institui o Novo Adote o Verde.',
            'Para o segundo mandato, seguirá fiscalizando e propondo melhorias para a cidade, incluindo a população de rua, a defesa da Lagoa da Pampulha, a retirada de fios e cabos partidos e aprimoramentos no transporte público de BH.',
          ],
          mandatos: [
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Bruno Miranda',
          fullName: 'Bruno Martuchele de Sales',
          about: [
            'Bruno Martuchele de Sales, mais conhecido como Bruno Miranda, é natural de Belo Horizonte, nascido em 1979, casado e pai de dois filhos. É cirurgião-dentista, professor de História e servidor público estadual.',
            'Atuou como Secretário Municipal Adjunto de Desenvolvimento Econômico, onde implantou a Sala do Empreendedor no BH Resolve, ajudou na criação do Conselho Municipal do Trabalho e Emprego e apoiou a Economia Popular Solidária. Também esteve à frente da Secretaria Municipal de Esporte e Lazer, expandindo as Academias a Céu Aberto por toda a cidade.',
            'Foi eleito para o quarto mandato na Câmara Municipal de Belo Horizonte com 8.736 votos. Em seu último mandato, foi autor de leis como a 11.617/2023, que cria o Selo Escolas Mais Seguras; a 11.709/2024, que substitui sinais sonoros tradicionais por sinalizações musicais adequadas para pessoas com TEA e Síndrome de Down; e a 11.666/2024, que institui o programa Tempo de Plantar, promovendo ações de arborização e sustentabilidade na cidade.',
          ],
          mandatos: [
            { startYear: 2009, endYear: 2012 },
            { startYear: 2013, endYear: 2013 },
            { startYear: 2014, endYear: 2016 },
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Cida Falabella',
          fullName: 'Maria Aparecida Vilhena Falabella Rocha',
          about: [
            'Cida Falabella foi eleita, em 2024, com 9.530 votos para o seu terceiro mandato como vereadora de Belo Horizonte. Integrante da Gabinetona, defende a cultura, as mulheres, as crianças, o meio ambiente, a mobilidade ativa, a educação, os cuidados, o direito ao transporte público e uma BH mais inclusiva.',
            'Atriz, diretora teatral, ativista da cultura desde 1976 e professora, Cida fez de Belo Horizonte a primeira capital do país a ter uma Lei Municipal da Cultura Viva. Também trouxe para a cidade o debate sobre a política e a economia do cuidado, contribuindo para que a capital mineira fosse pioneira na adoção de uma Política Municipal dos Cuidados.',
            'Foi autora e coautora de leis importantes, como a Lei Geral do Carnaval; a lei que tornou o programa Arte da Saúde permanente em BH; a Lei de Enfrentamento à Violência Política de Gênero; a Lei do Hip Hop; e a Lei de Enfrentamento à Violência Obstétrica, entre outras proposições voltadas para a melhoria da vida da população de BH.',
          ],
          mandatos: [
            { startYear: 2017, endYear: 2020 },
            { startYear: 2023, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Cláudio do Mundo Novo',
          fullName: 'Cláudio Mota Campos',
          about: [
            'Natural de Colatina (ES) e belo-horizontino de coração, Cláudio Mota Campos foi adotado aos 3 anos por uma família da capital mineira. Transformando sua experiência de vida em ação social, atua há 30 anos junto a instituições e hospitais filantrópicos na recuperação de dependentes químicos e no auxílio às famílias mais vulneráveis.',
            'É membro da Missão Mundo Novo, entidade assistencial de inspiração católica, de onde vem seu nome parlamentar. Formado em Administração de Empresas e pós-graduando em Poder Legislativo e Políticas Públicas, já exerceu cargos como chefe de gabinete da Regional da Pampulha, secretário de Desenvolvimento Social, Esportes e Cultura em Lagoa Santa e deputado estadual em 2018.',
            'Participante da Renovação Carismática Católica e de outros movimentos pastorais, Cláudio do Mundo Novo foi eleito vereador com 6.268 votos para o mandato de 2021 a 2024 e reeleito em 2025 com 8.261 votos. Além da recuperação e reinserção de usuários de drogas, contribui com creches, hospitais, lares de idosos e Apaes, mantendo também ações em defesa dos animais.',
          ],
          mandatos: [
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Cleiton Xavier',
          fullName: 'Cleiton Xavier da Silva',
          about: [
            'Investigador da Polícia Civil, Cleiton Xavier é referência na defesa dos direitos das crianças e adolescentes em Belo Horizonte. Nascido em 1981, casado e pai de dois filhos, luta por uma sociedade mais justa e pela valorização da família tradicional.',
            'Durante seu primeiro mandato, destacou-se por iniciativas de impacto, como a idealização da 1ª Feira Integrativa Autismo e Arte de BH, promovendo inclusão social e oportunidades de negócios para famílias atípicas. Atua no atendimento a crianças com TEA, TDAH, altas habilidades e outras atipicidades neurológicas, tornando-se um defensor incansável dessas famílias.',
            'Liderou esforços contra o abuso sexual infantil, ministrando palestras e conscientizando milhares de famílias. Também combate a violência contra as mulheres e atua na valorização da Guarda Municipal, defendendo melhores condições de trabalho e o fortalecimento da segurança pública na capital.',
            'Com 7.382 votos na última eleição, Cleiton Xavier inicia um novo mandato em 2025, reafirmando sua convicção de que fé e família são pilares para uma Belo Horizonte mais segura, justa e inclusiva.',
          ],
          mandatos: [
            { startYear: 2022, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Diego Sanches',
          fullName: 'Diego de Souza Sanches',
          about: [
            'Diego Sanches foi eleito vereador de Belo Horizonte pelo partido Solidariedade, com 6.278 votos. Natural da capital mineira, tem 36 anos, é graduado em Direito e Gestão Pública, e possui uma trajetória marcada pela dedicação a causas sociais e comunitárias.',
            'Suas principais pautas incluem a promoção e proteção dos direitos das pessoas com Transtorno do Espectro Autista (TEA) e o suporte às famílias atípicas, motivado por sua vivência como tio atípico. Embora esteja iniciando seu primeiro mandato, Diego já é reconhecido por seu trabalho social e pelo projeto Brasil Melhor, que promove inclusão por meio da educação, cultura e esporte.',
            'As sete prioridades de seu mandato são: criação do Centro de Referência em Autismo, melhoria da acessibilidade urbana, capacitação contínua dos educadores da rede municipal, desburocratização do acesso a direitos, cobrança de políticas públicas intersetoriais de inclusão, fortalecimento do esporte como ferramenta de inclusão e prevenção ao uso de drogas, e democratização do acesso à cultura.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Dr. Bruno Pedralva',
          fullName: 'Bruno Abreu Gomes',
          about: [
            'Nascido em 1984, em Pedralva, Sul de Minas, Bruno Abreu Gomes é médico formado pela UFMG, com residência em Medicina da Família e Comunidade (HOB), mestrado em Saúde Pública (UFMG) e especialização em Planejamento Urbano e Regional (UFRJ).',
            'Tem se dedicado ao Sistema Único de Saúde (SUS), participando da formulação, execução, fiscalização e avaliação das políticas públicas da área. Foi ex-presidente do Conselho Municipal de Saúde e iniciou sua militância no movimento estudantil, atuando como coordenador-geral do Diretório Acadêmico Alfredo Balena, da Faculdade de Medicina da UFMG.',
            'Além de vereador, é militante do Movimento Brasil Popular, diretor do Sindicato dos Servidores e Empregados Públicos de Belo Horizonte (Sindibel) e da Central Única dos Trabalhadores (CUT-MG).',
            'Com 3.649 votos em 2020, ficou na suplência do Partido dos Trabalhadores e assumiu mandato parlamentar em 2023. Em 2024, foi eleito com 10.870 votos para o mandato de 2025 a 2028, exercendo um mandato coletivo e popular baseado na defesa da democracia, do SUS, dos direitos sociais e dos serviços e servidores públicos.',
          ],
          mandatos: [
            { startYear: 2023, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Dra. Michelly Siqueira',
          fullName: 'Michelly Caroline Luiz Pereira de Siqueira',
          about: [
            'Eleita vereadora pelo Partido Renovação Democrática (PRD) com 6.495 votos.',
            'Natural de Corinto (MG), casada e com 40 anos, tem formação superior em Direito e atua como advogada especialista em Direito Público e Direito das Famílias.',
            'Seu trabalho tem ênfase na defesa dos direitos de pessoas com deficiência, doenças raras e graves, idosos com demência e em situação de vulnerabilidade.',
            'Conselheira da OAB-MG, preside a Comissão de Defesa dos Direitos das Pessoas com Deficiência na seccional mineira e integra a comissão nacional da mesma área no Conselho Federal da OAB.',
            'Já havia se candidatado a vereadora em 2020 pelo PP e a deputada federal em 2022 pelo Avante.',
            'Suas principais pautas incluem a defesa das pessoas com deficiência, TDAH e em vulnerabilidade social, além da defesa da advocacia.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Edmar Branco',
          fullName: 'Edmar Martins Cabral da Cruz',
          about: [
            'Eleito vereador de Belo Horizonte pelo PCdoB com 9.813 votos.',
            'Nascido em Bom Jesus do Galho, mudou-se para BH ainda criança e mora há 35 anos no bairro Paulo VI, com forte atuação na região nordeste da cidade.',
            'Iniciou sua militância na Pastoral da Juventude, foi Conselheiro Municipal da Juventude e atuou em projetos socioeducativos como "Fica Vivo", "Escola Aberta" e “Escola Integrada”.',
            'Já teve mandato de 2017 a 2020, participando das comissões de Meio Ambiente e Direitos das Mulheres e presidindo a CPI das Águas e das Barragens.',
            'Autor de leis como a que criou o cadastro único das nascentes e a regulamentação do uso de GPS em caminhões limpa-fossa.',
            'Defende direitos das mulheres, crianças e adolescentes, além de investimentos na educação pública e valorização dos professores.',
            'Suas prioridades incluem a defesa do SUS, construção de novas UBS, despoluição do Ribeirão do Onça e melhorias na mobilidade urbana com a municipalização da MG20.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Fernanda Pereira Altoé',
          fullName: 'Fernanda Elisa Pereira Altoé',
          about: [
            'Nascida em 1979, é casada e mãe de dois filhos.',
            'Advogada com pós-graduação em Direito Público pela Puc Minas, trabalhou por quase dez anos como assessora no Tribunal de Justiça de Minas Gerais e foi Promotora de Justiça do Estado de São Paulo.',
            'Uma das primeiras filiadas do Partido Novo em Minas Gerais, foi candidata a vereadora pela primeira vez em 2016 e eleita em 2020 com 6.049 votos.',
            'Em 2024, foi a quarta vereadora mais votada de BH, com 18.682 votos.',
            'Sua atuação foca na fiscalização eficiente dos gastos públicos, buscando otimizar investimentos em áreas essenciais.',
            'Tem trabalhado nas áreas de mobilidade urbana, segurança, drenagem urbana, revitalização e cuidado dos espaços públicos, visando uma cidade inteligente e inclusiva.',
          ],
          mandatos: [
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Flávia Borja',
          fullName: 'Flávia Ferreira Borja Pinto',
          about: [
            'Cristã, casada há 34 anos, mãe de três filhos e avó, nasceu em Belo Horizonte em 1972.',
            'Educadora e graduada em Fonoaudiologia, trabalhou por 30 anos na área de Educação.',
            'Sempre esteve envolvida com projetos sociais, participando de missões cristãs de educação e alfabetização de adultos.',
            'É idealizadora do Projeto Juntos BH, que faz a conexão entre empresários, voluntários e as comunidades da Vila Sumaré (Região Noroeste).',
            'Reeleita com 16.393 votos para o segundo mandato, aumentou em mais de 10 mil a quantidade de votos em comparação à sua primeira eleição.',
            'Se considera “liberal na economia e conservadora nos costumes”.',
            'Dentre suas bandeiras estão a defesa da mulher e dos valores cristãos, escola livre de doutrinação, acolhimento da gravidez indesejada, liberdade econômica e melhoria da qualidade do ensino.',
            'Pretende trabalhar na fiscalização dos mecanismos de denúncia e averiguação de violência doméstica, criação de um programa de acolhimento para mulheres em situação de gravidez indesejada, abertura de novas vagas na educação infantil por meio de bolsas e implementação da disciplina de educação financeira a partir do ensino fundamental, estimulando o empreendedorismo.',
            'Continua sendo uma representante da família conservadora de Belo Horizonte, defendendo o direito dos pais na educação moral e religiosa de seus filhos e lutando contra a erotização infantil.',
          ],
          mandatos: [
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Helinho da Farmácia',
          fullName: 'Hélio Medeiros Correa',
          about: [
            'Nascido em 1973 em São João do Oriente, no interior de Minas Gerais.',
            'Comerciário e morador da Regional Barreiro, em Belo Horizonte.',
            'Tem atuado em auxílio a projetos sociais, instituições com trabalho notável e hospitais que atendem à rede SUS.',
            'Acredita que seu trabalho garantiu o resultado obtido nas urnas.',
            'Reeleito para o terceiro mandato com 8.121 votos.',
            'Pretende manter sua atuação na área social, na saúde pública e na defesa dos direitos das pessoas com deficiência.',
            'Quer dar continuidade a um mandato participativo, ouvindo as demandas da população e transformando-as em proposições legislativas e em obras por toda a cidade.',
          ],
          mandatos: [
            { startYear: 2017, endYear: 2020 },
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Helton Junior',
          fullName: 'Helton Vieira Fernandes Junior',
          about: [
            'Eleito vereador de Belo Horizonte pelo Partido Social Democrático (PSD) com 8.013 votos.',
            'Aos 24 anos, é um dos vereadores mais novos eleitos na capital mineira.',
            'Formado em Gestão Pública pela Universidade Federal de Minas Gerais (UFMG).',
            'Já trabalhou na Prefeitura de Contagem, no Governo de Minas, no Banco de Desenvolvimento de Minas Gerais (BDMG), na Quaest e na Câmara Municipal de BH.',
            'Candidatura anterior pelo Partido Democrático Trabalhista (PDT) nas eleições de 2020.',
            'Morador do bairro Lindeia, na região do Barreiro, é conhecido por seu envolvimento com as demandas da sua comunidade e engajamento com pautas relacionadas à educação e mobilidade urbana.',
            'Compreende a política como a maior ferramenta de transformação na vida das pessoas.',
            'Para seu primeiro mandato, estabeleceu como prioridades as áreas de educação, qualidade do transporte público e profissionalização da gestão pública.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Irlan Melo',
          fullName: 'Irlan Chaves de Oliveira Melo',
          about: [
            'Nascido em Belo Horizonte em 1975, é advogado com mais de 27 anos de experiência, professor universitário de Direito Constitucional e pai de quatro filhos.',
            'Residente da região oeste da capital mineira, Irlan tem formação em Teologia e Direito, com especialização em Processo Civil.',
            'Desde cedo, destacou-se na defesa dos direitos das pessoas com deficiência, atuando na Comissão de Defesa dos Direitos da Pessoa com Deficiência da OAB-MG e no Procon Municipal.',
            'Em sua trajetória política como vereador de Belo Horizonte, tem defendido pautas que visam melhorar a vida dos cidadãos, especialmente nas áreas de mobilidade, saúde e educação.',
            'Foi o idealizador da primeira área de escape no Anel Rodoviário e autor de mais de 86 leis.',
            'É responsável pela Lei Municipal de Inclusão, voltada à acessibilidade para pessoas com deficiência, e tem sido um defensor da qualidade de ensino e estrutura escolar.',
            'Alinhado a princípios conservadores e cristãos, foi reeleito para o seu terceiro mandato com 11.660 votos.',
            'Busca promover valores de ética, família e justiça, comprometendo-se a trabalhar para que Belo Horizonte seja uma cidade mais justa e com mais oportunidades para todos.',
          ],
          mandatos: [
            { startYear: 2017, endYear: 2020 },
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Iza Lourença',
          fullName: 'Izabella Lourença Amorim Romualdo',
          about: [
            'Nasceu em 1993 e cresceu na região de Venda Nova, em Belo Horizonte.',
            'Graduada em Comunicação Social pela UFMG, trabalha como bilheteira do metrô.',
            'Durante a graduação, participou do movimento estudantil, foi coordenadora-geral do Diretório Central Acadêmico (DCE) e se engajou em lutas sociais (movimentos feministas, de combate à LGBTfobia e movimentos antirracistas).',
            'Em 2018, construiu o projeto social Consciência Barreiro - curso de educação popular preparatório para o Enem.',
            'Em 2019, foi eleita diretora de base do Sindicato dos Empregados em Transportes Metroviários e Conexos de Minas Gerais (Sindimetro-MG).',
            'Em 2020, idealizou a campanha de solidariedade Flores de Resistência, voltada para garantir que mulheres em situação de vulnerabilidade tenham acesso a absorventes higiênicos.',
            'Reeleita em 2024 com 21.485 votos, foi a terceira vereadora mais votada de Belo Horizonte.',
            'Suas principais bandeiras incluem oportunidades para a juventude, feminismo, antirracismo, respeito à diversidade, combate ao preconceito e luta pela justiça ambiental.',
            'Durante o primeiro mandato, elaborou o relatório sobre políticas públicas para a juventude negra e periférica em Belo Horizonte e uma análise sobre a violência policial e o racismo.',
            'Em 2023, organizou a Frente Parlamentar em Defesa das Matas, Serras e Águas de Belo Horizonte.',
            'A vereadora seguirá priorizando as áreas da educação, cultura, segurança cidadã, e direitos sociais e ambientais das periferias.',
          ],
          mandatos: [
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Janaina Cardoso',
          fullName: 'Janaina Ester Cardoso',
          about: [
            'Nascida em 1975 em Belo Horizonte, na Região do Barreiro.',
            'Formada em Arquitetura e Urbanismo pelo UNI-BH.',
            'Divorciada, mãe da Amanda, Ana Clara e Paulo Henrique e avó da Catarina.',
            'Cristã e apaixonada por animais, dedicando-se à causa há dez anos.',
            'Além da defesa dos animais, atua em favor do desenvolvimento das cidades, área relacionada à sua graduação, e em defesa das mulheres, ampliando a participação feminina na política.',
            'Com 7.740 votos conquistados em 2024, foi reeleita para seu segundo mandato.',
            'Planeja buscar parceiros na iniciativa privada para ampliar a oferta de atendimento veterinário de forma regionalizada na capital.',
          ],
          mandatos: [
            { startYear: 2023, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'José Ferreira',
          fullName: 'José de Jesus Ferreira',
          about: [
            'Nascido no Bairro Pindorama, Região Noroeste de Belo Horizonte, em 1984.',
            'Começou a trabalhar aos 14 anos de idade em uma sorveteria do bairro.',
            'Aos 17 anos, passou a atuar em drogarias, como atendente e auxiliar de serviços gerais, funções que exerceu por 12 anos.',
            'Também foi motorista particular.',
            'Tornou-se líder comunitário e candidatou-se a vereador em 2016.',
            'Após as eleições, trabalhou como assessor parlamentar na Câmara Municipal de Belo Horizonte.',
            'Criou o Instituto José Ferreira – Ajudai, visando auxiliar a garantia de atendimento das necessidades básicas das comunidades, estimular o desenvolvimento social e a promoção de princípios e valores.',
            'Reeleito para o segundo mandato com 9.946 votos, busca promover ações voltadas para resolver os problemas cotidianos que afetam as comunidades.',
            'Implantou em seu gabinete um serviço de zeladoria, onde recebe as demandas do munícipe, faz o envio à Prefeitura e cobra a solução.',
          ],
          mandatos: [
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Juhlia Santos',
          fullName: 'Juhlia André Santos',
          about: [
            'Eleita vereadora de Belo Horizonte pelo Partido Socialismo e Liberdade (Psol), conquistou 6.703 votos na eleição de 2024.',
            'Aos 41 anos, é comunicadora, atriz, produtora cultural e performer.',
            'Primeira mulher quilombola e travesti a ocupar uma cadeira na Câmara Municipal de BH.',
            'Integrante do Kilombo Manzo Ngunzo Kaiango, um espaço de resistência e preservação da herança cultural e espiritual afro-brasileira.',
            'Sua trajetória política institucional começou em 2018, quando se candidatou a deputada estadual.',
            'Em 2022, participou da chapa coletiva Mulheres Negras Sim, consolidando sua atuação em pautas sociais, ambientais e de justiça racial.',
            'Entre as prioridades de seu mandato estão a emergência climática, a defesa dos quilombos, o enfrentamento ao racismo, a defesa dos direitos da população LGBTQIA+ e o fortalecimento da cultura.',
            'Sonha em transformar Belo Horizonte novamente em uma "cidade-jardim", promovendo maior arborização, criação de parques e corredores ecológicos.',
            "Luta pela preservação das serras e dos cursos d'água contra a exploração predatória, promovendo uma cidade mais justa e sustentável.",
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Juninho Los Hermanos',
          fullName: 'Wagner Mariano Júnior',
          about: [
            'Nascido em 1975, em Belo Horizonte, é empresário e morador do Bairro Glória há 45 anos.',
            'Por meio do restaurante que mantém na região, criou um grupo de voluntários que desenvolve, desde 2002, diversos trabalhos sociais.',
            'Realiza o Natal Solidário, iniciativa que beneficia milhares de crianças.',
            'Eleito em 2024 para seu quarto mandato com 11.435 votos.',
            'Juninho espera manter e ampliar o trabalho desenvolvido nas legislaturas anteriores, de modo a corresponder às expectativas de seus eleitores de forma transparente e participativa.',
            'Atento às demandas populares, pretende lutar pela execução de obras públicas, melhorias em unidades de saúde, escolas e áreas de lazer.',
            'Busca cobrar a atuação integrada das forças de segurança para a redução da criminalidade.',
          ],
          mandatos: [
            { startYear: 2013, endYear: 2016 },
            { startYear: 2017, endYear: 2020 },
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Leonardo Ângelo',
          fullName: 'Leonardo Ângelo da Silva',
          about: [
            'O jornalista da Itatiaia foi eleito pela primeira vez como vereador de Belo Horizonte em 2024, com 6.156 votos.',
            'Nascido no bairro Esplanada e criado no Nova Gameleira, é conhecido em todo o estado por ser repórter da Rádio Itatiaia, onde apresentou por quase 20 anos os programas Turma do Bolota e Café com Notícia.',
            'Decidiu entrar para a política por conhecer os desafios da capital mineira.',
            'Sua missão é trazer um olhar sensível e soluções práticas para a cidade, com o compromisso de lutar por uma BH mais justa para todos, valorizando sempre o que BH tem de melhor, que são os belorizontinos.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Loíde Gonçalves',
          fullName: 'Elizete Loíde Gonçalves Tavares',
          about: [
            'Natural de Belo Horizonte, Loíde Gonçalves é advogada e pós-graduada em Direito Público pela PUC-Minas.',
            'É mãe de quatro filhos, esposa, cristã e fundadora do Instituto Maria da Conceição, que desde 2020 realiza projetos sociais e conta com mais de 250 famílias assistidas.',
            'Nas eleições de 2020, obteve 3.960 votos, garantindo a 1ª suplência do Podemos.',
            'Em 2023, assumiu a vaga de Nely Aquino, eleita deputada federal.',
            'Em 2024, foi eleita com 10.313 votos, mais que o dobro do que obteve em seu primeiro pleito.',
            'Loíde Gonçalves é defensora dos direitos das famílias, luta pela eficácia das políticas públicas voltadas para as mulheres, crianças, idosos e pessoas com deficiência, e busca a melhoria da infraestrutura e mobilidade urbana.',
            'A parlamentar também direciona suas atenções ao Terceiro Setor, buscando fomentá-lo através do estímulo ao desenvolvimento de projetos sociais eficazes.',
          ],
          mandatos: [
            { startYear: 2023, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Lucas Ganem',
          fullName: 'Lucas do Carmo Navarro',
          about: [
            'Com 10.753 votos, Lucas Ganem foi eleito em 2024 para o seu primeiro mandato na Câmara Municipal de BH.',
            'Natural de São Paulo, Lucas tem 28 anos, é formado em Administração de Empresas e Bacharel em Propaganda e Marketing, atua como agente administrativo e é ativista da causa animal.',
            'Sua trajetória política começou desde cedo, fazendo trabalhos em eleições majoritárias e proporcionais, além disso também trabalhou como assessor parlamentar na Câmara Municipal de Indaiatuba (SP).',
            'Sua dedicação e trabalho incansável têm sido fundamentais na promoção de políticas públicas voltadas para o bem-estar animal, fazendo dele uma figura respeitada e influente na defesa dos direitos dos animais.',
            'Como um representante do conceituado Grupo Ganem, o vereador eleito tem a missão de dar voz aos que não podem se defender, garantindo que todo animal tenha uma vida digna, livre de maus-tratos.',
            'Lucas também defende a assistência às pessoas com neurodivergências e a garantia de segurança nas escolas.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Luiza Dulci',
          fullName: 'Luiza Borges Dulci',
          about: [
            'Economista e doutora em sociologia, Luiza Dulci, de 34 anos, foi eleita em 2024 para o seu primeiro mandato na Câmara Municipal de BH, com 10.169 votos.',
            'Foi assessora da Secretaria Geral da Presidência da República no governo do presidente Lula e fundadora do movimento Bem Viver MG, que busca promover desenvolvimento social, ambiental e econômico a fim de garantir qualidade de vida para todas as pessoas.',
            'Luiza também integra a rede da Economia de Francisco e Clara, formada a partir do chamado do Papa Francisco para a construção de uma economia que promove a vida e cuida da casa comum.',
            'A vereadora é filiada ao PT há 15 anos e defende uma cidade inclusiva, diversa, participativa e equitativa.',
            'Entre as suas principais bandeiras, estão a economia do cuidado e a representatividade feminina, jovem e da comunidade LGBT.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Maninho Félix',
          fullName: 'Glauton Santiago Félix de Jesus',
          about: [
            'Natural de Belo Horizonte, Maninho Félix, filho do ex-vereador Geraldo Félix, é advogado, casado e pai de uma filha.',
            'Graduado em Direito e pós-graduado em Direito do Trabalho e Direito Previdenciário, foi assessor da presidência do Ceasa e do Instituto Ceasa Minas, ajudando a coordenar programas sociais como o Prodal – Banco de Alimentos, em apoio a diversas instituições filantrópicas.',
            'Atuou como gerente de patrimônio da Companhia Brasileira de Trens Urbanos (CBTU) e é membro da Executiva Municipal do Partido Social Democrático.',
            'Foi presidente das frentes parlamentares em defesa do Cooperativismo (Frencoop-BH) e em defesa da Serra da Piedade, além de membro da Frente Parlamentar Cristã.',
            'Em 2024, foi reeleito com 7.061 votos. Como parlamentar, atua para fortalecer o papel do Legislativo Municipal, buscando sempre a aproximação com o cidadão e o desenvolvimento de Belo Horizonte por meio de um mandato participativo.',
          ],
          mandatos: [
            { startYear: 2019, endYear: 2020 },
            { startYear: 2023, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Marilda Portela',
          fullName: 'Marilda de Castro Portela',
          about: [
            'Marilda Portela é professora, comunicadora e defensora dos valores cristãos, com grande influência nas redes sociais.',
            'Integrante de uma família em que os princípios do Evangelho norteiam a forma de viver e de fazer política, ela atua como uma das vozes mais ativas na defesa da família, dos valores cristãos e na luta pela justiça social.',
            'Durante sua trajetória como parlamentar, participou de importantes conquistas para a população. Foi autora da lei do Programa Menor Aprendiz em BH (Lei 11.248); da lei que institui o Plano de Prevenção à Depressão Pós-Parto (Lei 11.093); e da lei que criou o Programa Municipal de Alimentação Escolar (Lei 11.198); além de ser coautora da lei que proíbe a utilização de verba pública em eventos que promovam a sexualização de crianças e adolescentes (Lei 11.730).',
            'Ainda foi uma das líderes na garantia da gratuidade no transporte público para pacientes oncológicos do SUS e seus acompanhantes.',
            'Eleita para seu terceiro mandato com 6.279 votos, Marilda Portela reafirma seu compromisso com a luta contra as drogas, a favor das famílias, da cultura gospel e do desenvolvimento social.',
            'Entre seus principais objetivos, estão a implantação de políticas públicas para os jovens e mulheres, geração de emprego e renda e ações em defesa da vida.',
          ],
          mandatos: [
            { startYear: 2017, endYear: 2020 },
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Neném da Farmácia',
          fullName: 'Mozair José Braga',
          about: [
            'Eleito pela primeira vez para a Câmara Municipal de BH nas eleições de 2024 com 4.702 votos, Mozair José Braga, o Neném da Farmácia, é cristão, casado e pai de três filhos.',
            'O empresário, que tem 62 anos, nasceu em Moema (MG), foi criado em Lagoa da Prata (MG) e veio para Belo Horizonte aos 15 anos de idade.',
            'É conhecido por ser proprietário da Farmácia do Neném, no bairro Nazaré, onde se tornou liderança comunitária.',
            'O desejo de entrar na política surgiu após acompanhar dificuldades de moradores do bairro em ter acesso a exames e tratamentos.',
            'É defensor das bandeiras da vida, da saúde e da dignidade para todos.',
            'Neném é fundador da Associação Mais Amigos, que transforma vidas de pessoas com dependência química por meio de parcerias com clínicas de recuperação.',
            'A organização também oferece consultas médicas, exames, óculos, consultoria jurídica e contábil e atendimentos de fonoaudiologia, fisioterapia e psicologia a preços acessíveis.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Osvaldo Lopes',
          fullName: 'Osvaldo Lopes de Oliveira Junior',
          about: [
            'Osvaldo Lopes retorna à Câmara Municipal de Belo Horizonte em 2025 pelo Republicanos, com 10.345 votos.',
            'Foi vereador em 2016 e 2017 pelo PHS, deputado estadual de 2019 a 2023 pelo mesmo partido e secretário adjunto de Meio Ambiente na Prefeitura de BH em 2023.',
            'O vereador tem 56 anos, é divorciado, tem um filho e duas enteadas.',
            'Defensor da causa animal, Osvaldo Lopes foi criador dos dois únicos hospitais veterinários gratuitos de Minas Gerais e autor da lei do fim das carroças na capital, que acontecerá em 22 de janeiro de 2026.',
            'Enquanto deputado estadual, foi responsável por destinar emendas parlamentares para a realização do maior programa de castrações gratuitas do estado, quando cerca de 225 mil animais foram atendidos.',
            'Atuou ainda como vice-presidente da Comissão para Tombamento da Serra do Curral.',
            'Osvaldo foi também autor de quatro importantes leis estaduais em prol dos animais.',
          ],
          mandatos: [
            { startYear: 2016, endYear: 2017 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Pablo Almeida',
          fullName: 'Phablo Gomes Almeida',
          about: [
            'Pablo Almeida tem 31 anos e assume pela primeira vez um lugar na Câmara Municipal de BH.',
            'O parlamentar do PL foi eleito em 2024 com 39.960 votos, tornando-se o vereador mais votado da história da capital mineira.',
            'É casado e pai de uma menina.',
            'Cristão e conservador, Pablo defende as bandeiras de Deus, pátria, família e liberdade.',
            'Seus projetos para a CMBH serão focados no respeito aos valores cristãos, proteção da família, segurança pública, liberdade econômica, educação, saúde e transporte.',
            'Também pretende resgatar a função do vereador de fiscalizar o Executivo e os gastos públicos.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Pedro Patrus',
          fullName: 'Pedro Patrus',
          about: [
            'Pedro Luiz Neves Victer Ananias, conhecido como Pedro Patrus, aprendeu muito cedo a valorizar a luta por justiça social e pelos direitos das minorias.',
            'Aos 16 anos, filiou-se ao PT e participou ativamente dos movimentos de juventude.',
            'Graduado em História, mestre em Ciências Sociais e especialista em Política Urbana, Patrus dedicou seus mandatos à luta em defesa dos direitos humanos e do fortalecimento das políticas públicas.',
            'Com 7.675 votos, o vereador foi reeleito no pleito de 2024 e assume seu quarto mandato parlamentar.',
            'Consciente dos desafios da cidade, Pedro Patrus pretende continuar lutando por participação popular, pelas políticas da Assistência Social, pela agricultura urbana, pelo combate à crise climática, pela cultura e pelos trabalhadores em geral.',
          ],
          mandatos: [
            { startYear: 2013, endYear: 2016 },
            { startYear: 2017, endYear: 2020 },
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Pedro Rousseff',
          fullName: 'Pedro Farah Rousseff',
          about: [
            'Pedro Rousseff é nascido e criado em Belo Horizonte, filho do médico Pedro Rousseff e da enfermeira Geisa Cristina Silva.',
            'Pedro relata que despertou para a política ainda aos 16 anos, quando acompanhou de perto “o injusto processo de impeachment contra sua tia, Dilma Rousseff”.',
            'Formado em Administração, foi conselheiro municipal de Juventude de Belo Horizonte (2022-2024) e participou da coordenação da campanha do Presidente Lula em Minas Gerais.',
            'Em 2024 foi eleito o vereador mais votado da história do PT no estado, recebendo 17.595 votos de belo-horizontinos e belo-horizontinas em seu primeiro mandato.',
            'O parlamentar tem como principais bandeiras a defesa da democracia e combate ao extremismo; a reforma urbana, principalmente do centro da cidade; o aumento da coleta de lixo nas periferias; e a defesa da pauta da moradia e das políticas de inclusão social.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Professor Juliano Lopes',
          fullName: 'Juliano Lopes',
          about: [
            'Juliano Lopes Lobato nasceu em 1972 e sempre morou na Região do Barreiro.',
            'Formado em Educação Física, em licenciatura plena e bacharel, é pós-graduado em Gestão Pública de Projetos Sociais.',
            'É presidente da Comissão de Arbitragem da Federação Mineira de Futebol (FMF) e é ex-árbitro da Federação Mineira de Futebol (FMF) e da Confederação Brasileira de Futebol (CBF).',
            'Em 2007, criou o projeto Academia Móvel, que oferece aulas gratuitas de reforço muscular, alongamento e dança, em 10 espaços públicos da cidade, com orientação de profissionais especializados.',
            'Eleito pela primeira vez em 2013, sempre trabalhou a favor da saúde, educação e esportes, além de incentivar a prática de atividades físicas.',
            'Reeleito com 9.328 votos para seu quarto mandato, Professor Juliano Lopes atua fiscalizando o funcionamento de equipamentos públicos e cobrando melhorias.',
            'O parlamentar defende ainda a educação pública de qualidade. É autor ou coautor de mais de 180 projetos de lei que garantem os direitos dos belo-horizontinos.',
          ],
          mandatos: [
            { startYear: 2013, endYear: 2016 },
            { startYear: 2017, endYear: 2020 },
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Professora Marli',
          fullName: 'Marli Aparecida de Aro Ferreira',
          about: [
            'A Professora Marli é de Belo Horizonte e deixou as salas de aula “para trabalhar pela população da cidade que tanto ama”.',
            'É professora há mais de 45 anos e conquistou a instalação de salas multissensoriais em 27 escolas para ajudar alunos com deficiência, Transtorno do Espectro Autista e doenças raras.',
            'Em 2024, foi reeleita com 23.773 votos, sendo a segunda mais votada do pleito.',
            'Sua neta mais velha nasceu com a Síndrome Cornélia de Lange, uma doença genética rara que se caracteriza por múltiplas anomalias congênitas.',
            'Ela superou todos os prognósticos médicos e a incentivou a lutar pelos raros.',
            'Em 2019, ajudou a fundar a Casa de Maria, a primeira casa de acolhimento às pessoas com doenças raras do Brasil.',
            'A Professora Marli atua, sobretudo, em defesa das mulheres, da educação, da saúde e da inclusão.',
            'As leis e as emendas parlamentares que ela destinou para essas e outras áreas já ajudaram muitas pessoas.',
            'Também tem um olhar diferenciado para as comunidades e trabalha diariamente para atender às demandas da população de Belo Horizonte.',
          ],
          mandatos: [
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Rudson Paixão',
          fullName: 'Rudson Felipe da Paixão',
          about: [
            'Eleito pelo partido Solidariedade com 6.594 votos, Rudson Felipe Paixão nasceu em Belo Horizonte em 1993.',
            'Filho de José e Josefa, Rudson Paixão conquistou os votos de 40% dos eleitores do Bairro Jaqueline, na região Norte de BH, o que demonstra “o reconhecimento e a confiança depositada pela comunidade em seu trabalho”, que já dura mais de uma década.',
            'Apresentando-se como “cidadão que fiscaliza” e parceiro das causas sociais, o vereador pretende trabalhar duro e fazer a diferença na vida da população por meio de políticas públicas de qualidade.',
            'Expandindo para toda a cidade seu compromisso com o bem-estar e a segurança, ele pretende fazer de seu mandato uma ferramenta de transformação social e construção de um futuro melhor para todos.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Sargento Jalyson',
          fullName: 'Jalyson Maycon Gonçalves',
          about: [
            'Nascido em Ubá (MG) em 1986, o Sargento Jalyson é bacharel em Direito, pós-graduado em Direito Penal, professor de Legislação Institucional e instrutor de Armamento e Tiro.',
            'Eleito vereador da capital pelo Partido Liberal (PL) com 7.080 votos, ele integra há 15 anos a Polícia Militar de Minas Gerais e afirma seu compromisso com todos os temas de interesse da cidade.',
            'Com experiência na Segurança Pública, na docência e no Legislativo, onde assessorou parlamentares e redigiu diversos projetos de lei no âmbito federal e dos estados de Minas Gerais, São Paulo e Rondônia.',
            'O vereador encara a missão de enfrentar os desafios da atualidade e atender às demandas e os anseios da população de Belo Horizonte, norteado pelos princípios de Deus, pátria, família e liberdade.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Tileléo',
          fullName: 'Leonardo José Rodrigues Martins',
          about: [
            'Leonardo José Rodrigues Martins, conhecido como Tileléo, nasceu em Belo Horizonte em 1982. Caçula de quatro irmãos, perdeu os pais ainda na infância: o pai, Oraci Correia, faleceu quando ele tinha apenas 3 anos; e a mãe, Efigênia Rodrigues Martins, aos 5 anos, de forma trágica.',
            'Órfão, foi criado pelo irmão mais velho, Jefferson, e pela cunhada Ilza. Ao longo de sua vida, enfrentou grandes desafios e, com muitas superações, aprendeu lições valiosas.',
            'Casado com Gisele e pai de Arthur, Kaleb e Sofia, Tileléo é idealizador de diversos projetos educacionais, terapêuticos, sociais e esportivos no Jardim Vitória e em bairros vizinhos, na Região Nordeste de Belo Horizonte.',
            'Antes de sua eleição, já oferecia suporte a crianças, adolescentes e famílias em situação de vulnerabilidade na comunidade. Em 2024, foi eleito vereador pelo Partido Progressistas (PP) com 5.065 votos após “uma das campanhas mais econômicas da história recente da cidade”.',
            'Na Câmara, Tileléo continua a luta por melhorias na educação, revitalização de espaços públicos e urbanização nas comunidades. Seu projeto “Tileléo” visa expandir as opções de esporte, lazer, cultura e assistência terapêutica para pessoas com deficiência, além de oferecer novas oportunidades para crianças, adolescentes, jovens e famílias de toda a cidade.',
            'Com o lema “Juntos somos mais fortes”, segue dedicado a ajudar as pessoas e a transformar Belo Horizonte em uma cidade mais justa e igualitária para todos.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Trópia',
          fullName: 'Marcela de Lacerda Trópia',
          about: [
            'Nascida em Belo Horizonte, em 1994, Marcela Trópia é especialista em políticas públicas, formada pela Fundação João Pinheiro (MG), com pós-graduação em Liderança e Gestão Pública pelo Centro de Liderança Pública (SP), incluindo módulo na Universidade de Oxford.',
            'Está em seu segundo mandato como vereadora de Belo Horizonte. Em 2020, foi eleita pelo Partido Novo com 10.741 votos, alcançando a sexta maior votação da cidade.',
            'Foi presidente da Comissão de Educação, batalhando pela reabertura das escolas na pandemia e pelo combate ao abandono e à evasão escolar. Criou o Mutirão Oftalmológico, que garante exames de vista e óculos gratuitos para alunos do ensino fundamental das escolas públicas da cidade, via emendas parlamentares.',
            'Foi secretária-geral da Câmara no biênio 23-24, cargo no qual coordenou a criação do site BH pra Você, que simplifica o acesso aos gastos da Prefeitura.',
            'É autora da lei Transparência nos Empréstimos, que exige maior detalhamento nos pedidos de crédito do Poder Executivo. Defende a liberdade econômica e foi presidente da Comissão de Desburocratização do Setor Econômico e da Comissão de Modernização do Código de Posturas.',
            'Apresentou o Pacote de Inovação, com três projetos para impulsionar o setor de tecnologia e inovação da cidade.',
            'Reeleita para seu segundo mandato com 17.878 votos, Marcela pretende trabalhar para melhorar dez áreas essenciais da cidade: educação, saúde, segurança, transporte, transparência, pautas das mulheres, desburocratização, inovação, urbanização e sustentabilidade.',
          ],
          mandatos: [
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Uner Augusto',
          fullName: 'Uner Augusto de Carvalho Alvarenga',
          about: [
            'Voltando “mais forte” à Câmara de BH após o período de dois meses e meio em que ocupou o cargo na condição de suplente de Nikolas Ferreira, Uner Augusto de Carvalho Alvarenga foi eleito vereador pelo Partido Liberal (PL) com 13.401 votos.',
            'Nascido em 13 de dezembro de 1990 em Belo Horizonte, filho do Fred e da Simone, marido de Renata e pai de três meninas, Uner Augusto é advogado especialista em Direito Público.',
            'Católico, defensor da justiça, da vida, da família e das liberdades, o parlamentar tem como bandeira a luta pelo atendimento das demandas da população e solução de seus problemas, além da transparência e fiscalização da administração municipal, garantindo a destinação de recursos e execução das ações necessárias para o desenvolvimento da cidade e a preservação de seus valores, identidade, cultura e história.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Vile',
          fullName: 'Wili dos Santos',
          about: [
            'Vile Santos recebeu 14.705 votos do eleitorado de Belo Horizonte, cidade onde mora e trabalha. Vile se destaca por ser um político carismático e defensor do conservadorismo, promovendo políticas econômicas que buscam reduzir a intervenção do governo na economia.',
            'O vereador também é um ferrenho defensor do Bitcoin como uma forma de garantir a liberdade financeira para o cidadão. Além disso, Vile é criador da frente parlamentar “Anti-woke”, que visa barrar qualquer projeto “woke” e avançar com iniciativas em defesa da família e da agenda conservadora.',
          ],
          mandatos: [{ startYear: 2025, endYear: 2028 }],
        },
        {
          name: 'Wagner Ferreira',
          fullName: 'Wagner de Jesus Ferreira',
          about: [
            'Em 2020, Wagner Ferreira conquistou 3.128 votos e ficou como 1º suplente de seu partido. Assumiu a cadeira de vereador em 2023, defendendo a infraestrutura urbana nas periferias e as políticas públicas direcionadas ao meio ambiente. Também atuou em defesa do servidor público, do esporte, lazer, empreendedorismo e dos direitos humanos, com destaque para a luta pela inclusão das pessoas com deficiência e o combate ao racismo.',
            'Entre as leis de sua autoria, destacam-se a lei que determina prazo para aviso de supressão de árvores; a que estabelece distribuição gratuita ou permissão para levar água potável em eventos; a que criou o Dia da Consciência Negra em Belo Horizonte; a que impede que condenados por crimes de racismo assumam cargos públicos; entre outras.',
            'Em 2024, Wagner Ferreira foi reeleito com 10.963 votos. O parlamentar defende as bandeiras da Infraestrutura Urbana, Trabalho e Renda, Serviço Público, Meio Ambiente, Esporte e Lazer e Inclusão. Seu trabalho é guiado pela crença de que a política deve ser um instrumento de transformação social, capaz de promover justiça e dignidade para todos, especialmente para aqueles que mais precisam.',
          ],
          mandatos: [
            { startYear: 2023, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
        {
          name: 'Wanderley Porto',
          fullName: 'Wanderley de Araujo Porto Filho',
          about: [
            'Nascido em Belo Horizonte em 1982 e morador da região do Barreiro desde então, Wanderley de Araújo Porto Filho é formado em Publicidade e Propaganda e especialista em Marketing Político pela UFMG. Eleito em 2020 com 3.767 votos, conquistou 9.261 votos em 2024 para seu segundo mandato.',
            'Por mais de 15 anos exerceu cargos de gestão e assessoramento no Executivo e no Legislativo. Foi assessor de comunicação, gerente do Orçamento Participativo, secretário nas prefeituras de Belo Horizonte e Contagem e chefe de gabinete na Câmara Municipal e na Assembleia.',
            'Membro da Comissão de Meio Ambiente, Defesa dos Animais e Política Urbana da Câmara Municipal desde 2021, é protagonista nos debates relacionados à preservação ambiental e à causa animal. É autor da lei que reduziu o prazo para o fim das carroças na cidade de 2031 para janeiro de 2026 e de leis que aumentaram o valor das multas para abandono e maus-tratos de animais, que proíbem eventos com práticas violentas, o acorrentamento contínuo e o adestramento agressivo, entre outras.',
            'O parlamentar também é autor de leis que ampliam a inclusão de pessoas com deficiência, a proteção às mulheres, a saúde, a educação, a preservação e o desenvolvimento da cidade. Durante o primeiro mandato, direcionou R$10 milhões para hospitais, centros de saúde, recuperação de ruas, praças e quadras, obras de drenagem, além da proteção e promoção da saúde dos animais.',
          ],
          mandatos: [
            { startYear: 2021, endYear: 2024 },
            { startYear: 2025, endYear: 2028 },
          ],
        },
      ];

      for await (const vereador of vereadores) {
        console.log('Vereador:', vereador.name);
        await VereadoresCollection.updateAsync(
          { name: vereador.name },
          { $set: vereador }
        );
      }
    },
  });
  SyncedCron.start();
});
