---
title: "Como publicar um guia no Mona Docs"
description: "Passo a passo para escrever, revisar e compartilhar tutoriais inclusivos com a comunidade Monynha."
summary: "Aprenda a estruturar conteúdos acessíveis, com linguagem acolhedora e referências transparentes."
date: 2024-06-01T00:00:00+00:00
lastmod: 2024-06-01T00:00:00+00:00
draft: false
weight: 10
toc: true
---

## Por que este guia importa

Compartilhar conhecimento é um ato de cuidado coletivo. Ao publicar um tutorial no Mona Docs, você reforça a missão da Monynha Softwares de democratizar tecnologia com diversidade, transparência e afeto. Este documento explica como preparar conteúdos consistentes, acessíveis e fáceis de manter.

## Antes de começar

1. **Defina o objetivo do tutorial.** Descreva o problema que a pessoa leitora resolverá e qual impacto isso traz para o ecossistema Monynha.
2. **Planeje os passos.** Liste tarefas em ordem lógica, com comandos, capturas de tela e resultados esperados.
3. **Colete referências.** Registre links, comandos ou artigos de onde partiu o conhecimento. Citamos fontes para honrar a transparência e o acesso aberto da FACODI.
4. **Revise linguagem inclusiva.** Prefira termos neutros ("todes", "pessoas") e explique jargões em uma frase.

## Estruturando o arquivo Markdown

Crie um arquivo `*.md` dentro de `content/docs/guias/` com o seguinte modelo:

```markdown
---
title: "Título do guia"
description: "Resumo objetivo com verbos no infinitivo"
date: YYYY-MM-DDTHH:MM:SSZ
lastmod: YYYY-MM-DDTHH:MM:SSZ
draft: false
toc: true
---

## Introdução

Apresente o contexto, o público e os pré-requisitos.

## Seções principais

Organize cada etapa com títulos de nível 2 (`##`). Dentro de cada etapa, use listas numeradas para passos, trechos de código com ```bash``` e observações em blocos de citação.

## Próximos passos

Encorage contribuições, cite contatos ou repositórios e indique materiais relacionados.
```

## Boas práticas de linguagem

- Prefira frases curtas e diretas, evitando termos exclusivos ou discriminatórios.
- Use gênero neutro ou inclua as formas feminina, masculina e neutra ao mencionar pessoas.
- Quando introduzir um conceito técnico, adicione uma explicação breve ou link para o glossário.
- Valorize a colaboração: agradeça contribuidoras e indique como sugerir melhorias via issues ou pull requests.

## Imagens, vídeos e mídia complementar

- **Imagens:** coloque arquivos em `static/images/` e use `![texto alternativo descritivo](/images/nome-do-arquivo.png)`. O texto alternativo precisa dizer o que a pessoa veria.
- **Vídeos:** utilize o shortcode do YouTube do Doks — `{{< youtube video-id >}}` — e forneça contexto sobre o que o vídeo demonstra.
- **Códigos ou diagramas:** sempre inclua legenda ou descrição após o bloco, explicando a intenção daquela figura.

## Revisão e publicação

1. Revise ortografia, clareza e coerência dos passos.
2. Garanta que todas as referências externas estejam listadas ao final do documento em uma seção **Referências**.
3. Execute `hugo server` localmente para validar navegação, índice automático (`toc: true`) e contrastes.
4. Abra um pull request descrevendo mudanças, referências utilizadas e impactos esperados. A cultura de transparência da Monynha valoriza histórico bem documentado.

## Contribua continuamente

O Mona Docs é vivo. Sempre que descobrir uma prática mais inclusiva, otimizar um comando ou notar lacunas, atualize o guia ou abra uma issue. Nosso futuro digital se constrói com participação coletiva.
