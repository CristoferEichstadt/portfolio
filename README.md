# Cristofer Eichstadt

> O código está aqui. A experiência está no site.

[Acessar portfólio](https://cristofereichstadt.github.io/portfolio/)

Portfólio pessoal construído para mostrar software voltado para operação real:
- sistemas e apps que continuam funcionando quando o contexto aperta
- experiência em campo, automação, resiliência e produto em produção
- leitura em modo `human` e `dev`

Se você quer entender o trabalho de forma completa, o caminho certo é o site:

[Abrir site](https://cristofereichstadt.github.io/portfolio/)

---

## O que este repositório é

Este repositório existe para:
- manter o código do portfólio
- versionar a experiência
- publicar o site

Ele não substitui a navegação do portfólio.

---

## Stack

```text
Angular 19 · Signals · SCSS · SVG · Web Animations API
```

---

## Rodar localmente

```bash
npm install
npm start
```

Servidor padrão:
- `http://localhost:4200`

Opções suportadas:

```bash
npm run start:local
npm run start -- --host=127.0.0.1 --port=4201
```

Observação no Windows/NPM:
- use `--host=...` e `--port=...`
- se os argumentos entrarem como posicionais, o Angular pode responder `Unknown argument: 4201`

Lab do robô:
- `http://localhost:4200?lab=1`

---

## Build

```bash
npm run build
```

Saída:
- `dist/portfolio-v2/browser/`
