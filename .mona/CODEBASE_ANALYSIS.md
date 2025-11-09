## Análise do Codebase — MonaDocs

Autor: AI assistant (análise automatizada)
Data: 2025-11-09

Resumo executivo
-----------------

Este repositório é um site de documentação construído com Docusaurus v3. A estrutura é clara e segue convenções típicas de sites de docs: pasta `docs/` para conteúdo, `blog/` para posts, `src/components/` para componentes React reutilizáveis, e `static/` para ativos estáticos. O projeto requer Node >= 20 e usa `yarn` como gerenciador. O objetivo deste documento é registrar padrões, convenções e recomendações acionáveis.

Contrato da análise (inputs/outputs)
-----------------------------------
- Inputs: código-fonte do repositório (arquivos principais lidos: `package.json`, `docusaurus.config.js`, `sidebars.js`, `README.md`, `docs/intro.md`).
- Output: este arquivo de análise com padrões identificados, riscos e recomendações.
- Critério de sucesso: documento legível e acionável, cobrindo stack, arquitetura, convenções de docs e sugestões práticas.
- Modos de falha esperados: arquivos ausentes/inconsistentes (não ocorreu), referências a runtime de browser no SSR (risco comum e documentado abaixo).

Resumo técnico e stack
----------------------
- Framework: Docusaurus v3 (preset `classic`).
- Node: engines.node >= 20.
- Package manager: yarn (scripts no `package.json`).
- React: 19.x (dependência declarada).
- MDX/MD: suporte via `@mdx-js/react` e arquivos `.md` / `.mdx` em `docs/` e `blog/`.
- Syntax highlighting: `prism-react-renderer`.

Estrutura e padrões observados
------------------------------
- `docusaurus.config.js`: configura navbar, footer, presets, i18n (apenas `en` configurado) e opções de build. `editUrl` aponta para a branch `dev` no GitHub.
- `sidebars.js`: gerador programático de sidebar. Padrão:
  - TOP_FOLDERS explícito: `['projects','repositories','technologies','guidelines','identity','contribution','architecture']`.
  - Lógica: lê `docs/<folder>`; prioriza `index.md`/`index.mdx`; deduplica entradas e ordena (index primeiro, depois alfabético).
  - Usa `_category_.json` quando presente para rótulos e descrições.
- Docs: estrutura por subpastas (projects, technologies, etc.). Convenção recomendada observada: ter apenas um `index.md`/`index.mdx` por pasta.
- Componentes: `src/components/` armazena componentes reusáveis usados nas páginas/MDX (ex.: `HomepageFeatures`, `Repositories`, `TechStack`).

Padrões de desenvolvimento e riscos conhecidos
-------------------------------------------
- SSR vs browser APIs: o README e o código alertam para não usar `window`/`localStorage` diretamente em arquivos que executam em SSR (config e sidebars rodam em Node). A prática certa (já mencionada no README) é acessar APIs de browser dentro de `useEffect` ou com `typeof window !== 'undefined'`.
- Duplicidade de documentação: ter `index.md` e `index.mdx` na mesma pasta pode gerar entradas duplicadas na sidebar. `sidebars.js` tenta deduplicar, mas é melhor manter um único arquivo índice por pasta.
- Componentes que fazem fetch (ex.: `Repositories`) usam cache em localStorage com TTL — atenção a rate limits e comportamento em CI/SSG (deve haver fallback gracioso quando não autorizado ou em ambiente sem `window`).

Scripts e fluxo de desenvolvedor
--------------------------------
- scripts principais (`package.json`):
  - `start` -> `docusaurus start` (dev server)
  - `build` -> `docusaurus build`
  - `serve` -> `docusaurus serve` (preview da build)
  - `deploy` -> `docusaurus deploy` (GitHub Pages)
  - `favicon:generate` -> `node scripts/generate-favicons.js`
  - `test` -> `node --test scripts`
- Observação: `test` executa testes via Node e `scripts/` contém alguns testes utilitários (`homepage.test.js`). Não há um pipeline de CI padronizado no repositório (a ser recomendado).

Conveções de conteúdo (docs/blog)
---------------------------------
- Uso de `_category_.json` para metadados de categoria na pasta `docs/`.
- Nomes de arquivos/URLs: usar `YYYY-MM-DD-title.md` para posts e frontmatter para metadata no blog.
- Imagens locais para docs: conventiona é colocar imagens dentro da pasta da seção e referenciar como `./img/foo.png` quando aplicável.

Observações sobre configuração dinâmica do sidebar
-------------------------------------------------
- O `sidebars.js` é programático e depende de `TOP_FOLDERS`. Isso facilita organização automática, mas:
  - Fornece menos controle manual sobre ordem fina dentro de categorias; para casos especiais pode-se substituir por uma sidebar manual para aquela categoria.
  - Mudanças estruturais em `docs/` podem alterar a sidebar automaticamente — bom para produtividade, exige revisão de PRs que mexam em pastas.

Recomendações (priorizadas)
---------------------------
1) Adicionar CI básico (GitHub Actions) que execute:
   - `yarn` e `yarn build` (garante que o site constrói em Node >= 20)
   - `yarn test` (executa `node --test scripts`)
   - um passo opcional de checagem de links (link checker) e checagem de acessibilidade básica.
2) Adicionar linter/formatador (ESLint + Prettier) nas partes de JS/TS/MDX para consistência e evitar erros de runtime (ex.: uso inadvertido de APIs de browser).
3) Criar arquivo `CODEOWNERS` ou documento de manutenção (quem aprova PRs por área: docs, components, infra).
4) Documentar claramente no README/CONTRIBUTING as regras de SSR e patterns para components (ex.: usar `useEffect` para localStorage). Link para exemplos.
5) Padronizar um único `index.md`/`index.mdx` por pasta e adicionar uma checagem de CI que falhe quando detectar ambos (script simples que procura pares duplicados).
6) Opcional: adicionar um pequeno smoke test Playwright/puppeteer que carregue a rota `/` e confirme 200/markup básico após `yarn build`.

Edge cases e riscos
-------------------
- Ambientes de build sem `window` (SSG) — componentes que acessam localStorage sem guarda podem quebrar `yarn build`.
- Limites de API ao consumir GitHub public endpoints sem autenticação — componentes devem degradar graciosamente.
- Mudanças automáticas na estrutura de `docs/` podem alterar a ordem do sidebar inesperadamente; rever PRs que adicionem pastas.

Próximos passos sugeridos (curto prazo)
-------------------------------------
1. Merge deste arquivo em `.mona` (feito). Use-o como ponto de referência para PRs sobre infra.  
2. Criar workflow GitHub Actions mínimo (build + test + link-check).  
3. Adicionar `CONTRIBUTING.md` com checklist rápido (build local, lint, testes manuais).  
4. Implementar checagem simples para duplicação index.md/index.mdx em CI.

Referências (arquivos lidos)
---------------------------
- `package.json` — scripts, engines, dependências.  
- `docusaurus.config.js` — configuração global (navbar, footer, presets, theme).  
- `sidebars.js` — gerador dinâmico de sidebar; TOP_FOLDERS e lógica de leitura.  
- `README.md` — instruções de dev, build e deploy, boas práticas e pitfalls.  
- `docs/intro.md` — exemplo de conteúdo e frontmatter.

Fim da análise.
