// ============================================================
// Content Data — Cristofer Eichstadt Portfolio V2
// ============================================================

import { environment } from '../../environments/environment';

export interface Metric {
  value: string;
  label: string;
}

export type TerminalCategory = 'build' | 'sync' | 'report' | 'automation' | 'monitoring';

export interface TerminalScriptLine {
  id: string;
  category: TerminalCategory;
  cmdHuman: string;
  outHuman: string;
  cmdDev: string;
  outDev: string;
  botHuman: string;
  botDev: string;
}

export interface TerminalLine {
  id: string;
  category: TerminalCategory;
  cmd: string;
  out: string;
  bot: string;
}

export type ChapterId = 'hero' | 'projects' | 'stack' | 'services' | 'about' | 'contact';
export type ChapterMood = 'boot' | 'editorial' | 'inspect' | 'process' | 'manifesto' | 'handoff';
export type ChapterAccentSignal =
  | 'boot-scan'
  | 'field-sync'
  | 'arsenal-grid'
  | 'method-flow'
  | 'manifesto-core'
  | 'handoff-cta';
export type ChapterRobotState = 'wake' | 'work' | 'inspect' | 'walk' | 'spy' | 'cta-focus';

export interface Chapter {
  id: ChapterId;
  navLabel: string;
  progressLabel: string;
  mood: ChapterMood;
  robotState: ChapterRobotState;
  accentSignal: ChapterAccentSignal;
}

export type ProjectSignal = 'field-sync' | 'evidence-pdf' | 'pipeline-webhook' | 'silent-ops';
export type ProjectMood = 'field' | 'evidence' | 'enterprise' | 'silent';
export type ProjectPriority = 'primary' | 'supporting' | 'atmospheric';

export interface Project {
  id: string;
  title: string;
  subHuman: string;
  subDev: string;
  bulletsHuman: string[];
  bulletsDev: string[];
  stack: string[];
  stackHuman: string[];
  role: 'main' | 'secondary';
  logo?: string;
  caseHuman?: string;
  caseDev?: string;
  signal: ProjectSignal;
  mood: ProjectMood;
  priority: ProjectPriority;
  signalLabelHuman: string;
  signalLabelDev: string;
}

export interface NdaProject {
  id: string;
  title: string;
  subHuman: string;
  subDev: string;
  quote: string;
  stack: string[];
  stackHuman: string[];
  bulletsHuman: string[];
  bulletsDev: string[];
  signal: ProjectSignal;
  mood: ProjectMood;
  priority: ProjectPriority;
  signalLabelHuman: string;
  signalLabelDev: string;
}

export interface StackCategory {
  category: string;
  techs: string[];
}

export interface Services {
  human: string[];
  dev: string[];
}

export interface About {
  fixed: string[];
  human: string;
  dev: string;
  badges: string[];
}

export interface Contact {
  whatsapp: string;
  whatsappDisplay: string;
  hasWhatsapp: boolean;
  email: string;
  linkedin: string;
}

// --- Chapters / Narrative System ---
export const chapterMap = {
  hero: {
    id: 'hero',
    navLabel: 'Início',
    progressLabel: 'Boot',
    mood: 'boot',
    robotState: 'wake',
    accentSignal: 'boot-scan',
  },
  projects: {
    id: 'projects',
    navLabel: 'Projetos',
    progressLabel: 'Casos Reais',
    mood: 'editorial',
    robotState: 'work',
    accentSignal: 'field-sync',
  },
  stack: {
    id: 'stack',
    navLabel: 'Stack',
    progressLabel: 'Arsenal',
    mood: 'inspect',
    robotState: 'inspect',
    accentSignal: 'arsenal-grid',
  },
  services: {
    id: 'services',
    navLabel: 'Serviços',
    progressLabel: 'Método',
    mood: 'process',
    robotState: 'walk',
    accentSignal: 'method-flow',
  },
  about: {
    id: 'about',
    navLabel: 'Sobre',
    progressLabel: 'Princípios',
    mood: 'manifesto',
    robotState: 'spy',
    accentSignal: 'manifesto-core',
  },
  contact: {
    id: 'contact',
    navLabel: 'Contato',
    progressLabel: 'Contato',
    mood: 'handoff',
    robotState: 'cta-focus',
    accentSignal: 'handoff-cta',
  },
} as const satisfies Record<ChapterId, Chapter>;

export const chapters: Chapter[] = Object.values(chapterMap);

// --- Hero ---
export const hero = {
  headline: 'Desenvolvo sistemas e apps que funcionam quando a operação real não perdoa.',
  subHuman: 'Já resolvi problema de campo, de escritório, de automação e de relatório. Se tem um processo travado ou um sistema pra construir, eu entro e faço funcionar.',
  subDev: 'Mobile, web, API, automação, dashboard — já atuei em todos esses contextos em produção. Angular, React Native, .NET, Spring Boot, Selenium. Entro onde o problema está.',
  metrics: [
    { value: '3+', label: 'Anos em projetos em produção' },
    { value: '12+', label: 'Integrações em contexto real' },
    { value: '4', label: 'Frentes: Web, Mobile, API e Portal' },
  ] as Metric[],
};

// --- Terminal (mode-aware, bot-guided) ---
export const terminalScript: TerminalScriptLine[] = [
  {
    id: 'build-check',
    category: 'build',
    cmdHuman: 'checar-base --status',
    outHuman: '✓ tudo respondendo',
    cmdDev: 'npm run build -- --configuration production',
    outDev: '✓ build ok',
    botHuman: 'Estou conferindo se a estrutura principal está estável antes de seguir.',
    botDev: 'Build concluído e artefatos prontos para publicar.',
  },
  {
    id: 'offline-sync',
    category: 'sync',
    cmdHuman: 'salvar-dados --offline',
    outHuman: '✓ nada se perdeu',
    cmdDev: 'offline-sync --queue flush',
    outDev: '✓ 0 conflicts',
    botHuman: 'Aqui eu garanto que a operação continua mesmo quando o sinal cai.',
    botDev: 'Fila offline drenada e sincronização aplicada sem conflito.',
  },
  {
    id: 'report-publish',
    category: 'report',
    cmdHuman: 'enviar-relatorio --cliente',
    outHuman: '✓ relatório enviado',
    cmdDev: 'report-service publish --target client',
    outDev: '✓ pdf + email dispatched',
    botHuman: 'Transformo o que aconteceu na operação em um resumo claro para decidir rápido.',
    botDev: 'Relatório consolidado, exportado e disparado para o canal final.',
  },
  {
    id: 'automation-closeout',
    category: 'automation',
    cmdHuman: 'rodar-rotina --automatica',
    outHuman: '✓ rotina concluída',
    cmdDev: 'hangfire enqueue nightly:closeout',
    outDev: '✓ job queued',
    botHuman: 'Essa etapa sai da mão da equipe e roda sozinha para economizar tempo.',
    botDev: 'Job agendado em background para processar a rotina sem intervenção manual.',
  },
  {
    id: 'monitoring-status',
    category: 'monitoring',
    cmdHuman: 'monitorar-operacao --status',
    outHuman: '✓ tudo estável',
    cmdDev: 'monitoring status --since 1h',
    outDev: '✓ 0 new issues',
    botHuman: 'Também fico de olho para descobrir problema cedo e evitar surpresa.',
    botDev: 'Monitoramento limpo no recorte recente; sem incidentes novos.',
  },
];

export const terminalHuman: TerminalLine[] = terminalScript.map(line => ({
  id: line.id,
  category: line.category,
  cmd: line.cmdHuman,
  out: line.outHuman,
  bot: line.botHuman,
}));

export const terminalDev: TerminalLine[] = terminalScript.map(line => ({
  id: line.id,
  category: line.category,
  cmd: line.cmdDev,
  out: line.outDev,
  bot: line.botDev,
}));

// Keep legacy export for compatibility
export const terminal = terminalHuman;

// --- Projects ---
export const projects: Project[] = [
  {
    id: 'flowservice',
    title: 'App que funciona quando a equipe está no campo, com ou sem internet',
    subHuman: 'Um app feito para a operação continuar rodando mesmo quando a conexão falha.',
    subDev: 'Aplicativo mobile com foco em offline-first, fila local, sincronização resiliente e recursos nativos de operação externa.',
    bulletsHuman: [
      'Tarefas, formulários e fotos continuam funcionando mesmo sem sinal',
      'Arquivos pesados sobem sem travar o uso em campo',
      'Localização, mapas e rota ajudam a operação a se mover melhor',
    ],
    bulletsDev: [
      'Fila offline com persistência local, retry e tratamento de falha',
      'Upload robusto de formulários, imagens e anexos grandes em iOS e Android',
      'Geolocalização, mapas, notificações e integrações operacionais nativas',
    ],
    caseHuman: 'Aqui o valor não está em tela bonita. Está em fazer a operação acontecer quando o técnico está na rua, sem sinal, com anexo para enviar e pouco tempo para errar.',
    caseDev: 'O case destaca operação mobile corporativa com persistência local, sincronização resiliente, upload multipart, rastreamento, notificações e observabilidade em contexto de rede instável.',
    stack: ['React Native', 'Redux Saga', 'Firebase', 'Sentry', 'Jest'],
    stackHuman: ['App mobile', 'Funciona sem internet', 'Dados sempre atualizados', 'Monitoramento de erros'],
    role: 'main',
    logo: 'everflow',
    signal: 'field-sync',
    mood: 'field',
    priority: 'primary',
    signalLabelHuman: 'campo / sem sinal / rota',
    signalLabelDev: 'offline / sync / geolocalização',
  },
  {
    id: 'mega-vistorias',
    title: 'App de vistoria que precisa funcionar no sol, sem sinal, com câmera e PDF no final',
    subHuman: 'Entrei para evoluir um produto que já existia e reforçar o que mais importava: estabilidade no campo, envio de evidências e fluxo operacional.',
    subDev: 'Atuação em app mobile, API e portal administrativo com foco em sync, mídia, PDFs, backend Spring Boot e fluxo operacional de vistoria.',
    bulletsHuman: [
      'Corrigi e melhorei partes do fluxo de vistoria que precisavam aguentar o uso real',
      'Reforcei captura de fotos, envio de anexos e sincronização em campo',
      'Contribuí para o portal e para o servidor que sustenta a operação',
    ],
    bulletsDev: [
      'Evolução de fluxo mobile offline-first com mídia, anexos e sincronização progressiva',
      'Contribuições em backend Spring Boot com autenticação, upload, PDFs e S3',
      'Apoio na evolução do portal administrativo conectado à operação',
    ],
    caseHuman: 'Não é um produto começado do zero por mim. É um produto real que precisou de reforço técnico onde a operação sente primeiro: estabilidade, envio, mídia e continuidade de uso.',
    caseDev: 'O valor do case está na atuação em produto vivo multi-camadas, cobrindo mobile, API e admin com foco em resiliência operacional, documentação e manutenção evolutiva.',
    stack: ['Ionic React', 'Capacitor', 'Spring Boot', 'MongoDB', 'AWS S3', 'MUI'],
    stackHuman: ['App mobile', 'Fotos e anexos', 'Servidor robusto', 'Armazenamento na nuvem'],
    role: 'secondary',
    logo: 'mega-vistorias',
    signal: 'evidence-pdf',
    mood: 'evidence',
    priority: 'supporting',
    signalLabelHuman: 'fotos / laudo / evidência',
    signalLabelDev: 'mídia / pdf / sync',
  },
  {
    id: 'flow2',
    logo: 'everflow',
    title: 'Plataforma interna que conecta operação, financeiro e automações numa empresa que não para',
    subHuman: 'Trabalhei na evolução de uma plataforma grande, usada por diferentes áreas da empresa, conectando operação, financeiro e automações internas.',
    subDev: 'Atuação full-stack em sistema enterprise com Angular, .NET, SQL Server, Hangfire, SignalR e múltiplas integrações de negócio.',
    bulletsHuman: [
      'Ajudei a evoluir fluxos que conectam operação, financeiro e rotina interna',
      'Trabalhei em automações, dashboards e funcionalidades usadas por diferentes áreas',
      'Entreguei dentro de um sistema grande, vivo e com regra de negócio real',
    ],
    bulletsDev: [
      'Evolução full-stack em Angular, API .NET, domínio, dados e integrações externas',
      'Atuação em pipelines de O.S., dashboards, webhooks, uploads e jobs em background',
      'Experiência em produto enterprise multi-autoria e longa vida útil',
    ],
    caseHuman: 'Esse case vale menos como vitrine visual e mais como prova de maturidade: consegui entregar em produto grande, com legado, contexto compartilhado e impacto operacional real.',
    caseDev: 'O case comprova atuação em arquitetura enterprise com frontend, API, domínio, persistência, jobs e integrações, sem vender falsa autoria integral do produto.',
    stack: ['Angular', '.NET', 'SQL Server', 'Hangfire', 'SignalR', 'Docker'],
    stackHuman: ['Sistema web', 'Automações internas', 'Banco de dados', 'Tarefas automáticas', 'Atualização instantânea'],
    role: 'secondary',
    signal: 'pipeline-webhook',
    mood: 'enterprise',
    priority: 'supporting',
    signalLabelHuman: 'fluxo / automação / operação',
    signalLabelDev: 'pipeline / webhook / jobs',
  },
];

// --- NDA Project ---
export const ndaProject: NdaProject = {
  id: 'nda',
  title: 'Automação de rotina crítica sem depender de trabalho manual todo dia',
  subHuman: 'Robôs executando tarefas repetitivas enquanto a operação dorme.',
  subDev: 'Manutenção e evolução de robôs de coleta com foco em estabilidade, adaptação a mudança externa e continuidade operacional.',
  quote: 'Vários navegadores abrindo em paralelo, cada um cumprindo seu roteiro. Eles dançavam com os sites. Todo amanhecer os dados já estavam lá.',
  stack: ['C#', 'Selenium', 'JavaScript'],
  stackHuman: ['Automação noturna', 'Navegadores em paralelo', 'Dados entregues todo dia'],
  bulletsHuman: [
    'Mantive rotinas automáticas funcionando mesmo quando os sites mudavam',
    'Reduzi dependência de consulta manual e retrabalho operacional',
    'Garanti continuidade em processo que precisava amanhecer estável',
  ],
  bulletsDev: [
    'Ajuste contínuo de navegação, seletores e fluxo de captura em Selenium',
    'Tratamento e normalização de dados para consumo interno',
    'Ênfase em tolerância a quebra e recuperação rápida de rotina crítica',
  ],
  signal: 'silent-ops',
  mood: 'silent',
  priority: 'atmospheric',
  signalLabelHuman: 'coleta / rotina / estabilidade',
  signalLabelDev: 'paralelo / coleta / estabilidade',
};

// --- Stack human capabilities ---
export type CapabilityIcon = 'smartphone' | 'monitor' | 'server' | 'database' | 'cloud' | 'bot' | 'eye';

// --- Stack layers (hero strip) ---
export interface Layer { icon: CapabilityIcon; label: string; labelHuman: string; }
export const layers: Layer[] = [
  { icon: 'smartphone', label: 'App',     labelHuman: 'Celular' },
  { icon: 'monitor',    label: 'Web',     labelHuman: 'Site' },
  { icon: 'server',     label: 'API',     labelHuman: 'Servidor' },
  { icon: 'database',   label: 'Dados',   labelHuman: 'Dados' },
  { icon: 'cloud',      label: 'Deploy',  labelHuman: 'Nuvem' },
  { icon: 'eye',        label: 'Monitor', labelHuman: 'Sem susto' },
];

export interface StackCapability {
  icon: CapabilityIcon;
  title: string;
  desc: string;
}

export const stackCapabilitiesHuman: StackCapability[] = [
  { icon: 'smartphone', title: 'App que funciona sem sinal', desc: 'Sistemas que a equipe usa no campo mesmo quando a internet cai' },
  { icon: 'monitor',    title: 'Interface que a equipe usa de verdade', desc: 'Dashboards, portais e telas pensadas para operação real' },
  { icon: 'server',     title: 'Servidor que sustenta a demanda', desc: 'APIs, integrações e rotinas rodando em background' },
  { icon: 'database',   title: 'Dados que não se perdem', desc: 'Armazenamento local, nuvem e sincronização confiável' },
  { icon: 'cloud',      title: 'Infraestrutura que aguenta produção', desc: 'Deploy, containers e pipeline automatizado' },
  { icon: 'bot',        title: 'Automação de tarefas repetitivas', desc: 'Robôs que fazem o trabalho manual enquanto a equipe dorme' },
  { icon: 'eye',        title: 'Visibilidade quando algo quebra', desc: 'Monitoramento e alertas para resolver antes do cliente notar' },
];

// --- Stack ---
export const stackCategories: StackCategory[] = [
  { category: 'Mobile', techs: ['React Native', 'Ionic React', 'Capacitor', 'TypeScript'] },
  { category: 'Frontend', techs: ['React', 'Angular', 'JavaScript', 'TypeScript', 'MUI', 'Redux', 'Vite'] },
  { category: 'Backend', techs: ['Spring Boot', '.NET', 'REST APIs', 'Hangfire', 'SignalR'] },
  { category: 'Banco de Dados', techs: ['MongoDB', 'SQL Server', 'AsyncStorage / IndexedDB', 'Entity Framework'] },
  { category: 'Cloud & Infra', techs: ['AWS S3', 'Docker', 'GitHub Actions', 'App Center', 'Azure DevOps'] },
  { category: 'Testes & Automação', techs: ['Selenium', 'Jest', 'Vitest', 'Cypress', 'NUnit'] },
  { category: 'Observabilidade', techs: ['Sentry', 'Application Insights'] },
];

// --- Services ---
export const services: Services = {
  human: [
    'App que funciona sem internet — a equipe não para porque o sinal sumiu',
    'Sistema que conecta áreas que hoje falam por planilha ou WhatsApp',
    'Robô que faz o trabalho chato de madrugada enquanto ninguém precisa olhar',
    'Integração entre ferramentas que hoje não conversam entre si',
    'Sistema antigo que precisa crescer sem quebrar o que já funciona',
  ],
  dev: [
    'App mobile offline-first com fila local, retry, sync progressiva e upload resiliente',
    'Sistema full-stack sob medida: Angular ou React + API .NET ou Spring Boot + banco + integrações',
    'Automação com Selenium: coleta, scraping e rotina paralela com tratamento de quebra',
    'Integração entre plataformas via API, webhook, fila e normalização de dados',
    'Manutenção evolutiva em legado: sem reescrever tudo, sem quebrar o que já aguenta produção',
  ],
};

// --- About ---
export const about: About = {
  fixed: ['Direto.', 'Às vezes perfeccionista.', 'Fala pouco, ouve muito.', 'Entrega muito bem feito.'],
  human: 'Gosto de resolver o que trava a operação. Menos discurso. Mais sistema funcionando direito.',
  dev: 'Trabalho bem em contexto de regra de negócio, legado, integração, sincronização e software que precisa aguentar uso real.',
  badges: [
    'Faz o que foi pedido. E o que não foi, mas devia.',
    'Funciona em produção. Não só no localhost.',
    'Entende o negócio antes de abrir o editor.',
    'O legado tem dono: quem vai mexer depois.',
    'De app a planilha com API: já viu contexto demais pra ter medo de problema novo.',
  ],
};

// --- Contact ---
export const contact: Contact = {
  whatsapp: environment.whatsapp,
  whatsappDisplay: environment.whatsappDisplay,
  hasWhatsapp: environment.hasWhatsapp,
  email: 'cristofer2002ti@gmail.com',
  linkedin: 'https://www.linkedin.com/in/cristofer-eichstadt/',
};
