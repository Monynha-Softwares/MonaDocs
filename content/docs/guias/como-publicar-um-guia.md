---
title: "Como publicar um guia no Mona Docs"
description: "Passo a passo para escrever, revisar e publicar tutoriais inclusivos na plataforma."
lead: "Aprenda a estruturar conteúdos acolhedores, citar fontes e usar os recursos do tema Doks para compartilhar conhecimento."
date: 2024-06-01T00:00:00+00:00
lastmod: 2024-06-01T00:00:00+00:00
draft: false
weight: 10
toc: true
seo:
  title: "Como publicar um guia no Mona Docs"
  description: "Instruções para criar tutoriais acessíveis, com citações e multimídia, alinhados à missão da Monynha Softwares."
  canonical: ""
  noindex: false
---

## 1. Planeje a narrativa

1. Defina o objetivo do guia e descreva o resultado esperado em poucas frases.
2. Liste pré-requisitos com links para materiais abertos e, quando possível, cite a fonte original.
3. Divida o processo em etapas curtas, com títulos claros. Prefira verbos no imperativo suave ("Configure", "Teste").

Essa abordagem acolhe pessoas com diferentes níveis de experiência e reafirma a missão da Monynha de democratizar tecnologia.

## 2. Escreva usando Markdown

O Mona Docs utiliza Markdown padrão.

- Use `#` para o título principal, `##` e `###` para subtítulos, garantindo hierarquia acessível.
- Utilize listas numeradas para sequências de passos e listas com hífen para notas ou sugestões.
- Adicione **negrito** para termos importantes e _itálico_ para conceitos novos, explicando cada um na primeira aparição.

### Inserindo imagens

1. Salve arquivos em `static/images/` e utilize nomes descritivos, como `deploy-coolify-passo-1.png`.
2. Referencie a imagem com texto alternativo significativo: `![Captura mostrando o painel do Coolify](../../images/deploy-coolify-passo-1.png)`.
3. Garanta que as imagens tenham contraste adequado; o tema Doks já segue o padrão WCAG.

### Incorporando vídeos do YouTube

Use o shortcode nativo:

```go-html-template
{{< youtube id="VIDEO_ID" title="Descrição curta do vídeo" >}}
```

Substitua `VIDEO_ID` pelo código do vídeo e descreva o conteúdo no atributo `title` para apoiar tecnologias assistivas.

## 3. Cite fontes e referências

- Indique a origem de comandos, scripts ou processos com links ou referências bibliográficas.
- Para materiais internos, registre o repositório ou documento compartilhado.
- Quando adaptar tutoriais externos, explique o que mudou para atender às práticas éticas e transparentes da Monynha.

## 4. Revise com atenção coletiva

1. Leia o texto em voz alta para verificar clareza e fluidez.
2. Peça revisão a outra pessoa da comunidade; colaboração é parte do nosso ecossistema.
3. Confirme que os exemplos funcionam e que todas as imagens possuem alternativas textuais.

## 5. Publique

1. Crie um branch dedicado e abra um pull request descrevendo as atualizações.
2. Execute `hugo server` localmente para revisar o guia no navegador.
3. Após o merge, gere a versão final com `hugo --minify` e publique conforme o fluxo de deploy da equipe.

Ao seguir estas orientações, todes ajudam a manter o Mona Docs vivo, diverso e transparente — um espaço onde qualquer pessoa pode aprender e contribuir com o futuro digital que estamos construindo juntes.
