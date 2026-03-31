# Blog Java

Blog full-stack com autenticação JWT, posts, comentários e filtros de pesquisa.

## Stack

**Backend:** Java 21, Spring Boot 4, Spring Security (JWT), H2/PostgreSQL  
**Frontend:** React 18, Vite, Tailwind CSS

## Como Executar

```bash
# Backend (porta 8080)
cd demo && ./mvnw spring-boot:run

# Frontend (porta 5173)
cd frontend && npm install && npm run dev
```

- API: http://localhost:8080
- Frontend: http://localhost:5173
- H2 Console: http://localhost:8080/h2-console

## API

### Autenticação
| Método | Endpoint | Body |
|--------|----------|------|
| POST | `/api/auth/register` | `{"username":"x","email":"x@x.com","password":"123456"}` |
| POST | `/api/auth/login` | `{"username":"x","password":"123456"}` |

### Posts
| Método | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/posts` | Não |
| GET | `/api/posts/{id}` | Não |
| POST | `/api/posts` | Bearer Token |
| PUT | `/api/posts/{id}` | Bearer Token |
| DELETE | `/api/posts/{id}` | Bearer Token |
| GET | `/api/posts/my` | Bearer Token |

### Comentários
| Método | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/posts/{id}/comments` | Não |
| POST | `/api/posts/{id}/comments` | Bearer Token |

### Filtros
```
/api/posts?title=termo&status=PUBLISHED&page=0&size=10
```

## Segurança

- JWT com expiração de 24h
- BCrypt para senhas
- Header: `Authorization: Bearer <token>`

## Teste no Postman

1. POST `/api/auth/register` → copie o `token`
2. Use o token no header para endpoints protegidos

---

Daniel Santana
