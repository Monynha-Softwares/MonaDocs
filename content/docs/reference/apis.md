---
title: "Padrões de API"
slug: "apis"
description: "Convenções para desenvolvimento e consumo das APIs Monynha."
summary: "Formatos de request/response, autenticação e versionamento."
date: 2024-04-19T00:00:00+00:00
lastmod: 2024-04-19T00:00:00+00:00
weight: 25
toc: true
seo:
  title: "Referência de APIs Monynha"
  description: "Diretrizes para construir e consumir APIs dentro do ecossistema Monynha Softwares."
  canonical: ""
  noindex: false
---

## Autenticação

- Utilize OAuth 2.0 com fluxo client credentials para integrações servidor-servidor.
- Clientes web e mobile devem adotar PKCE.
- Tokens expiram em 60 minutos; use endpoints de refresh para renovar com segurança.

## Convenções de requisição

| Prática | Detalhe |
| --- | --- |
| Padrão de URL | `https://api.monynha.com/{versao}/{recurso}` |
| Versionamento | Versão major obrigatória no caminho (`v1`, `v2` etc.). |
| Formato | JSON UTF-8, campos em snake_case. |
| Paginação | Parâmetros `page` e `page_size` com limite máximo de 100 itens. |

## Respostas padrão

```json
{
  "data": {},
  "meta": {
    "request_id": "string",
    "timestamp": "2024-04-19T12:00:00Z"
  },
  "errors": []
}
```

- Inclua `request_id` em todos os logs para rastreabilidade.
- Utilize códigos HTTP semânticos (2xx sucesso, 4xx erro do cliente, 5xx erro do servidor).

## Tratamento de erros

| Código | Quando utilizar | Exemplo de mensagem |
| --- | --- | --- |
| 400 | Requisições inválidas | `validation_error` |
| 401 | Credenciais inválidas ou expiradas | `invalid_token` |
| 403 | Acesso negado por perfil | `insufficient_permissions` |
| 409 | Conflitos de recurso | `duplicate_record` |
| 422 | Erros de negócio específicos | `business_rule_violation` |

## Boas práticas adicionais

- Documente endpoints usando OpenAPI 3.1 e publique na central de APIs interna.
- Gere SDKs automaticamente e publique no repositório `sdks-monynha`.
- Monitore latência e taxa de erros com alertas automáticos configurados no stack de observabilidade.

Consulte a pasta "APIs" no repositório interno para exemplos completos e testes de contrato.
