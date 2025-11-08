# Docker Compose

## Descrição

Docker Compose é uma ferramenta para definir e executar aplicações Docker multi-container. Permite descrever uma aplicação completa (serviços, redes, volumes) em um arquivo YAML e gerenciá-la com comandos simples.

## Por que usamos

- Orquestração de múltiplos containers
- Desenvolvimento local consistente
- Facilita setup de ambientes complexos
- Versionamento de configurações de infraestrutura

## Projetos que utilizam

- (Projetos que usam Docker Compose para desenvolvimento/local)

## Como usar

### Arquivo docker-compose.yml básico

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Comandos comuns

```bash
# Iniciar serviços
docker-compose up

# Iniciar em background
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs

# Reconstruir e iniciar
docker-compose up --build
```

## Recursos

- [Documentação Oficial](https://docs.docker.com/compose/)
- [Guia de Início Rápido](https://docs.docker.com/compose/gettingstarted/)