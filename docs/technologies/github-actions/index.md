# GitHub Actions

## Descrição

GitHub Actions é uma plataforma de CI/CD integrada ao GitHub que permite automatizar workflows de desenvolvimento, incluindo build, teste, deploy e outras tarefas automatizadas.

## Por que usamos

- Integração nativa com repositórios GitHub
- Workflows baseados em eventos (push, PR, releases)
- Grande ecossistema de actions pré-construídas
- Execução gratuita para projetos open source
- Controle de versão dos workflows

## Projetos que utilizam

- MonaDocs (este projeto usa GitHub Actions para CI)

## Como usar

### Workflow básico (.github/workflows/ci.yml)

```yaml
name: CI

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main, dev ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run tests
        run: yarn test

      - name: Build
        run: yarn build
```

### Actions comuns

- `actions/checkout@v4` - Checkout do código
- `actions/setup-node@v4` - Setup Node.js
- `actions/upload-artifact@v4` - Upload de artefatos
- `actions/deploy-pages@v4` - Deploy para GitHub Pages

## Recursos

- [Documentação Oficial](https://docs.github.com/en/actions)
- [Marketplace de Actions](https://github.com/marketplace?type=actions)