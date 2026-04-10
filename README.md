# Blog Java

Sistema de blog full-stack com autenticação, gerenciamento de posts e comentários.

## Funcionalidades

- **Autenticação:** Registro e login com JWT
- **Posts:** Criar, editar, visualizar e excluir posts
- **Comentários:** Adicionar e gerenciar comentários
- **Dashboard:** Painel do usuário com seus posts
- **Busca:** Filtrar posts por título
- **Status:** Publicar como rascunho ou publicado

## Stack

- **Backend:** Java 21, Spring Boot 4, Spring Security (JWT)
- **Frontend:** React 18, Vite, Tailwind CSS
- **Banco:** H2 (desenvolvimento) / PostgreSQL (produção)

## Rodar

```bash
# Backend (porta 8080)
cd demo && ./mvnw spring-boot:run

# Frontend (porta 5173)
cd frontend && npm install && npm run dev
