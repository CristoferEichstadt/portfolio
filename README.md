# Cristofer Eichstadt — Portfolio

> *"Faz o que foi pedido. E o que não foi, mas devia."*

Portfólio pessoal construído com Angular 19 e um robô que anda, voa e cospe fogo.

---

## O que tem aqui

- **Modo humano / dev** — dois modos de leitura: um para clientes, outro para devs
- **Robô animado** — SVG animado com estados: idle, walk, fly, work, inspect, scan, wake, teleport, sleep
- **Thrusters Iron Man-style** — chamas com partículas, núcleo branco quente e timings primos para parecer orgânico
- **Terminal interativo** — comandos que mudam conforme o modo selecionado
- **Projetos reais** — sem lorem ipsum, sem mockup. Código que foi pra produção
- **Lab mode** — acesse `?lab=1` para testar cada estado do robô com scrubber de timeline e controle de velocidade

---

## Stack

```
Angular 19 · Signals · Web Animations API · SCSS · SVG puro
```

Sem bibliotecas de UI. Sem atalhos. Tudo à mão.

---

## Rodar local

```bash
npm install
npm start
```

Acesse `http://localhost:4200`

Opções suportadas:

```bash
npm run start:local
npm run start -- --host=127.0.0.1 --port=4201
```

Observação importante no Windows/NPM:
- use `--host=127.0.0.1 --port=4201` com `=`
- se os argumentos entrarem como posicionais, o Angular pode receber `ng serve 127.0.0.1 4201` e responder `Unknown argument: 4201`

Para o lab do robô: `http://localhost:4200?lab=1`

---

## Build

```bash
ng build
```

Output em `dist/portfolio-v2/browser/`

---

## Estrutura

```
src/
├── app/
│   ├── components/
│   │   ├── hero/         # Terminal + métricas
│   │   ├── nav/          # Toggle humano/dev
│   │   ├── projects/     # Cases reais
│   │   ├── about/        # Quem sou
│   │   ├── services/     # O que faço
│   │   ├── stack/        # Tecnologias
│   │   ├── contact/      # Contato + footer
│   │   ├── robot/        # O robô (SVG + animações)
│   │   └── robot-lab/    # Ambiente de teste do robô
│   ├── data/
│   │   └── content.ts    # Todo o conteúdo do site
│   └── services/
│       ├── mode.service.ts   # humano / dev
│       └── theme.service.ts  # dark / light
└── styles/               # Tokens, reset, tipografia
```

---

## Por que esse portfólio existe

Porque portfólio de dev que só tem "sobre mim" e uma lista de tecnologias é entediante.

Esse aqui tem um robô com jato de fogo nos pés.

---

## Contato

**cristofer2002ti@gmail.com**
[linkedin.com/in/cristofer-eichstadt](https://www.linkedin.com/in/cristofer-eichstadt)
WhatsApp: configurado via secrets no deploy
