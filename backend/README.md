
# Backend Python com Flask e SQLite

Este é o backend da aplicação de eventos, desenvolvido em Python usando Flask e SQLite.

## Instalação

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Crie um ambiente virtual:
```bash
python -m venv venv
```

3. Ative o ambiente virtual:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

4. Instale as dependências:
```bash
pip install -r requirements.txt
```

## Executar o servidor

```bash
python run.py
```

O servidor será iniciado em http://localhost:5000

## Usuário Admin Padrão

- Email: admin@admin.com
- Senha: admin123

## Endpoints da API

### Autenticação
- POST `/api/register` - Registrar usuário
- POST `/api/login` - Login de usuário
- POST `/api/admin/login` - Login de admin

### Eventos
- GET `/api/events` - Listar todos os eventos
- POST `/api/events` - Criar novo evento (requer autenticação)
- GET `/api/events/:id` - Detalhes de um evento
- POST `/api/events/:id/join` - Participar de evento (requer autenticação)
- DELETE `/api/events/:id/leave` - Sair de evento (requer autenticação)

### Usuário
- GET `/api/user/events` - Eventos do usuário (criados e participando)

### Admin
- GET `/api/admin/stats` - Estatísticas gerais
- GET `/api/admin/users` - Listar usuários
- GET `/api/admin/events` - Listar eventos (admin)

## Estrutura do Banco de Dados

### Tabelas:
- `users` - Usuários do sistema
- `events` - Eventos cadastrados
- `event_participation` - Relação entre usuários e eventos
