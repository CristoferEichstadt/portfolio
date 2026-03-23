# AGENTS.md

Este arquivo é o guia operacional do Codex para este repositório.

Use-o para manter as mudanças alinhadas com a intenção do produto, a direção visual e as regras específicas do projeto.

## Resumo do Projeto

Portfólio pessoal de Cristofer Eichstadt, construído como uma single-page em Angular 19.

Posicionamento central:
- software para operação real;
- sistemas que continuam funcionando quando o ambiente está bagunçado;
- confiabilidade técnica silenciosa acima de brilho vazio;
- identidade divertida através do robô, mas nunca infantil.

Este site não é um portfólio genérico de dev. Ele deve parecer operacional, preciso e autoral.

## Comandos

```bash
npm install
npm start
npm run start:local
npm run start -- --host=127.0.0.1 --port=4201
npm run build
npm test
```

Observações:
- servidor padrão de desenvolvimento: `http://localhost:4200`
- lab do robô: `http://localhost:4200?lab=1`
- no Windows/NPM, os overrides de host e porta devem usar `--host=... --port=...`
- se o comando virar `ng serve 127.0.0.1 4201`, o Angular falha com `Unknown argument: 4201`

## Arquitetura

- Angular 19 com componentes standalone
- Signals para estado da aplicação
- sem Angular Router para navegação entre páginas
- narrativa de scroll em single-page
- SCSS para estilos
- robô em SVG customizado e terminal customizado

Estrutura principal:

```text
src/app/
  components/
    layout/nav/
    sections/
      hero/
      projects/
      stack/
      services/
      about/
      contact/
    robot/
      robot/
      robot-lab/
  data/content.ts
  services/
```

Arquivos mais importantes como fonte de verdade:
- `src/app/data/content.ts`: copy principal, capítulos, projetos e terminal
- `src/app/services/narrative.service.ts`: capítulo ativo e narrativa de scroll
- `src/app/components/robot/robot/*`: comportamento e visual do robô
- `src/app/components/sections/hero/*`: terminal, métricas e cena inicial

## Regras de Conteúdo

Este repositório usa dois modos de audiência:
- `human`: valor em linguagem clara, sem jargão desnecessário
- `dev`: precisão técnica e linguagem de implementação

Regras:
- se um texto relevante mudar, valide se ele precisa existir em `human` e `dev`
- `human` deve explicar valor para visitantes não técnicos
- `dev` pode usar termos técnicos, mas só quando isso ajuda
- evite vazar jargão técnico para labels, chips, resumos, bullets ou CTAs em `human`
- texto fixo só é aceitável quando realmente não deve variar por audiência

O site deve soar como alguém que resolve problema operacional com software, não como uma página genérica de “full-stack for hire”.

## Guardrails de Produto e Escrita

Mantenha estes princípios estáveis:
- priorizar operação real, confiabilidade, resiliência offline, automação e continuidade
- não usar screenshots falsos, dashboards falsos ou filler decorativo
- marcas e logos de empresas são prova contextual, nunca protagonistas
- `FlowService` é o case dominante
- `Mega Vistorias` e `Flow2` são cases de apoio em contexto real
- o trabalho sob NDA deve continuar atmosférico e discreto
- evitar aberturas genéricas como “Olá, eu sou Cristofer”
- evitar que o robô carregue a identidade inteira do site
- o objetivo final da página é clareza comercial: levar ao WhatsApp sem parecer desesperado nem barulhento

## Guardrails Visuais e de Interação

O sistema visual deve parecer:
- sóbrio premium
- técnico, mas humano
- intencional, não com cara de template
- rico por tipografia, ritmo, motion e estrutura, não por excesso visual

Faça:
- motion com propósito
- hierarquia visual forte
- desktop e mobile igualmente considerados
- respeito a `prefers-reduced-motion`
- linguagem visual consistente entre favicon, logo, terminal, robô e acentos das seções

Não faça:
- glow, glitch ou gimmick aleatório sem função narrativa
- deixar o robô sobrepor texto ou CTA importante
- deixar o terminal mais denso do que precisa
- introduzir peças com cara de biblioteca de UI que quebrem o visual autoral

## Sistema de Marca

O símbolo pessoal é `CE`.

Direção atual da marca:
- `CE` precisa continuar legível
- o símbolo deve parecer autoral, não genérico
- o mesmo símbolo deve se manter consistente entre favicon e topo
- a marca deve comunicar estrutura, sinal, continuidade e precisão operacional

Se mudar assets de marca:
- atualize favicon e logo do nav juntos
- evite construção dependente de fonte para o logo
- prefira geometria simples e durável, que sobreviva em `16x16`

## Sistema do Robô

O robô é um companheiro de narrativa, não um mascote.

Expectativas:
- reage às seções e à jornada da página
- deve parecer vivo, mas não ocupado o tempo todo
- não pode atrapalhar a leitura
- o payoff do contato importa mais do que motion chamativo

Notas de implementação:
- o SVG usa viewBox `0 0 80 120`
- as animações são guiadas principalmente por CSS em `robot.component.scss`
- o lab mode fica disponível em `?lab=1`
- mudanças de estado estão ligadas à progressão por capítulos e a alguns gatilhos de serviço

Limitação conhecida:
- `robot.component.scss` hoje excede o budget de warning do Angular para estilos de componente
- não aumente esse arquivo sem critério; prefira substituir ou consolidar motion quando possível

## Sistema do Terminal

O terminal é uma cena de apoio no hero, não a história inteira do produto.

Regras:
- manter leitura clara e ritmo bom
- no modo `human`, os comandos devem continuar compreensíveis
- o console deve ser crível o suficiente para parecer real, mas não técnico demais a ponto de excluir visitante leigo
- as interações do robô dentro do terminal devem continuar sutis e divertidas

## Material Privado

Planejamento interno e documentação específica de assistentes devem ficar fora da superfície pública do repositório.

Convenção atual:
- colocar documentos internos em `.private/`
- não reintroduzir docs de planejamento ou docs de assistente na raiz
- se surgir um novo arquivo interno, ele deve ficar em `.private/` e continuar ignorado pelo Git

## Validação Antes de Encerrar

Antes de fechar uma mudança, prefira validar:
- `npm run build`
- layout desktop
- layout mobile
- toggle `human/dev` quando for relevante
- robô não cobrindo conteúdo importante
- contraste de tema claro e escuro

Para mudanças visuais, valide também:
- legibilidade do hero
- ritmo do terminal
- consistência entre nav e logo
- clareza do CTA de contato

## Git e Higiene do Repositório

- mantenha a raiz limpa e pública
- evite commitar docs internos de planejamento
- evite mudanças destrutivas de histórico sem pedido explícito
- se o histórico público for reescrito, confirme branch e remoto com cuidado antes

## Estratégia Padrão de Mudança

Ao editar:
- prefira correções em nível de comportamento em vez de remendos cosméticos espalhados
- preserve a linguagem visual existente, a menos que a mudança seja uma evolução intencional
- se mudar copy, atualize primeiro `content.ts`
- se mudar comportamento de narrativa, revise `narrative.service.ts`, hero, nav e robô em conjunto
- se mudar branding, atualize favicon e nav juntos

Se um pedido entrar em conflito com estas regras, siga o pedido do usuário, mas faça isso de forma deliberada e mantendo a coerência do repositório.
