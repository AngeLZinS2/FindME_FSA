# FindMe - Plataforma de Eventos Locais

<p align="center">
  <img src="public/logo.svg" alt="FindMe Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Conectando pessoas através de eventos únicos na sua região</strong>
</p>

<p align="center">
  <a href="#sobre">Sobre</a> •
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#tecnologias">Tecnologias</a> •
  <a href="#instalação">Instalação</a> •
  <a href="#uso">Uso</a> •
  <a href="#estrutura">Estrutura</a> •
  <a href="#contribuição">Contribuição</a>
</p>

---

## 📋 Sobre

O **FindMe** é uma plataforma moderna e intuitiva para descoberta e participação em eventos locais. Nossa missão é conectar pessoas através de experiências únicas, facilitando a busca por eventos interessantes na sua região e promovendo conexões genuínas entre participantes.

### ✨ Por que escolher o FindMe?

- **🎯 Focado na sua região**: Encontre eventos perto de você
- **🔍 Busca inteligente**: Filtros avançados por categoria, localização e interesse
- **👥 Conexões reais**: Conheça pessoas com interesses similares
- **📱 Interface moderna**: Design responsivo e experiência de usuário otimizada
- **🌙 Modo escuro**: Suporte completo a tema claro e escuro

---

## 🚀 Funcionalidades

### Para Usuários
- **Exploração de Eventos**
  - Busca por eventos locais com filtros avançados
  - Visualização detalhada de eventos com informações completas
  - Mapa interativo com localização dos eventos
  - Sistema de categorias para facilitar a descoberta

- **Participação**
  - Confirmação de presença em eventos
  - Acompanhamento de eventos que você participa
  - Perfil pessoal com histórico de participações

- **Experiência do Usuário**
  - Interface responsiva para desktop e mobile
  - Modo escuro/claro com persistência de preferência
  - Animações suaves e feedback visual
  - Loading states e skeleton screens

### Para Administradores
- **Painel Administrativo**
  - Dashboard com estatísticas e métricas
  - Gerenciamento completo de eventos
  - Gestão de usuários e permissões
  - Relatórios detalhados de participação

- **Criação de Eventos**
  - Formulário intuitivo para criação de eventos
  - Upload de imagens com prévia
  - Integração com mapas para definir localização
  - Campos para redes sociais e informações de contato

---

## 🛠 Tecnologias

### Frontend
- **React 18** - Biblioteca principal para construção da UI
- **TypeScript** - Tipagem estática para maior robustez
- **Vite** - Build tool moderna e rápida
- **React Router DOM** - Roteamento client-side
- **Tailwind CSS** - Framework CSS utilitário

### UI Components
- **shadcn/ui** - Componentes acessíveis e customizáveis
- **Radix UI** - Primitivos de UI de alta qualidade
- **Lucide React** - Ícones modernos e consistentes
- **React Hook Form** - Gerenciamento de formulários

### State Management & Hooks
- **TanStack Query** - Gerenciamento de estado server
- **Custom Hooks** - Lógica reutilizável para funcionalidades específicas

### Backend & Database
- **Supabase** - Backend as a Service
  - Autenticação de usuários
  - Database PostgreSQL
  - Storage para imagens
  - Real-time subscriptions

### Styling & Animation
- **Tailwind CSS** - Sistema de design consistente
- **CSS Modules** - Estilos modulares e scoped
- **Framer Motion** - Animações fluidas (preparado para integração)

### Development Tools
- **ESLint** - Linting e qualidade de código
- **PostCSS** - Processamento de CSS
- **TypeScript** - Análise estática e IntelliSense

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (para funcionalidades backend)

### Passo a passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/findme.git
cd findme
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

4. **Execute o projeto**
```bash
npm run dev
# ou
yarn dev
```

5. **Acesse a aplicação**
Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

---

## 🎯 Uso

### Navegação Principal

- **🏠 Home (/)**: Página inicial com busca rápida e eventos em destaque
- **📅 Eventos (/eventos)**: Lista completa de eventos com filtros avançados
- **👤 Perfil (/perfil)**: Área pessoal do usuário
- **🔐 Login/Registro**: Autenticação de usuários

### Funcionalidades Principais

#### 🔍 Busca de Eventos
1. Acesse a página de eventos
2. Use a barra de busca para encontrar eventos específicos
3. Aplique filtros por categoria e localização
4. Clique em um evento para ver detalhes completos

#### 👥 Participação em Eventos
1. Navegue até o evento desejado
2. Clique em "Participar" ou "Confirmar Presença"
3. Acompanhe seus eventos na seção "Meus Eventos"

#### ⚙️ Administração (Área Admin)
1. Acesse `/admin/login` com credenciais administrativas
2. Use o dashboard para overview geral
3. Gerencie eventos em `/admin/eventos`
4. Monitore usuários em `/admin/usuarios`

---

## 📁 Estrutura do Projeto

```
findme/
├── public/                 # Arquivos estáticos
│   ├── logo.svg           # Logo da aplicação
│   └── lovable-uploads/   # Uploads de imagens
├── src/
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes de UI base (shadcn)
│   │   ├── AdminLayout.tsx
│   │   ├── EventCard.tsx
│   │   ├── EventFilters.tsx
│   │   ├── Navbar.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ...
│   ├── pages/            # Páginas da aplicação
│   │   ├── Admin/        # Páginas administrativas
│   │   ├── EventDetails.tsx
│   │   ├── Events.tsx
│   │   ├── Index.tsx
│   │   └── ...
│   ├── hooks/            # Custom hooks
│   │   ├── useMockAuth.ts
│   │   ├── useMockEvents.ts
│   │   ├── useGeolocation.ts
│   │   └── ...
│   ├── lib/              # Utilitários e configurações
│   │   ├── utils.ts
│   │   ├── geolocationUtils.ts
│   │   └── imageUtils.ts
│   ├── integrations/     # Integrações externas
│   │   └── supabase/     # Configuração Supabase
│   ├── data/             # Dados mock para desenvolvimento
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Ponto de entrada
│   └── index.css         # Estilos globais
├── backend/              # Backend Flask (desenvolvimento)
├── tailwind.config.ts    # Configuração Tailwind
├── vite.config.ts        # Configuração Vite
└── package.json          # Dependências e scripts
```

### Principais Diretórios

- **`src/components/`**: Componentes reutilizáveis da aplicação
- **`src/pages/`**: Componentes de página organizados por funcionalidade
- **`src/hooks/`**: Hooks customizados para lógica específica
- **`src/lib/`**: Utilitários, helpers e configurações
- **`src/integrations/`**: Configurações de APIs e serviços externos

---

## 🎨 Sistema de Design

### Tema e Cores
O FindMe utiliza um sistema de design baseado em tokens semânticos que suportam modo claro e escuro:

```css
/* Tokens principais */
--primary: Cor primária da marca
--secondary: Cor secundária
--accent: Cor de destaque
--background: Cor de fundo
--foreground: Cor do texto principal
--muted: Cores atenuadas
--border: Bordas e divisores
```

### Componentes UI
Baseados no **shadcn/ui** com customizações específicas:
- Buttons com variantes semânticas
- Cards responsivos com sombras suaves
- Inputs com foco states consistentes
- Navigation com active states

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
npm run preview      # Preview do build

# Qualidade de código
npm run lint         # Executa ESLint
npm run type-check   # Verifica tipos TypeScript

# Backend (desenvolvimento)
cd backend && python run.py  # Inicia servidor Flask
```

---

## 🧪 Desenvolvimento

### Dados Mock
Durante o desenvolvimento, o sistema utiliza dados mock para simular:
- Lista de eventos
- Autenticação de usuários
- Participações em eventos
- Dados geográficos

### Hooks de Desenvolvimento
- `useMockEvents`: Simula API de eventos
- `useMockAuth`: Simula autenticação
- `useMockEventParticipation`: Simula participações

### Debugging
- Console logs estruturados
- Error boundaries para captura de erros
- Loading states em todas as operações assíncronas

---

## 🚀 Deploy

### Opções de Deploy

1. **Lovable Platform** (Recomendado)
   - Deploy automático via interface
   - SSL gratuito
   - CDN global

2. **Vercel**
```bash
npm run build
npx vercel
```

3. **Netlify**
```bash
npm run build
# Upload da pasta dist/
```

### Variáveis de Ambiente (Produção)
```env
VITE_SUPABASE_URL=sua-url-producao
VITE_SUPABASE_ANON_KEY=sua-chave-producao
```

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Siga estes passos:

### Como Contribuir

1. **Fork o projeto**
2. **Crie uma branch para sua feature**
```bash
git checkout -b feature/AmazingFeature
```

3. **Commit suas mudanças**
```bash
git commit -m 'Add some AmazingFeature'
```

4. **Push para a branch**
```bash
git push origin feature/AmazingFeature
```

5. **Abra um Pull Request**

### Diretrizes de Desenvolvimento

- **Code Style**: Siga as configurações do ESLint
- **Commits**: Use conventional commits
- **TypeScript**: Mantenha tipagem forte
- **Tests**: Adicione testes para novas funcionalidades
- **Responsividade**: Certifique-se que funciona em mobile

### Issues e Bugs

- Use templates de issue apropriados
- Inclua screenshots quando aplicável
- Descreva passos para reprodução
- Mencione ambiente (browser, OS, etc.)

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👥 Equipe

- **Desenvolvimento**: Equipe FindMe
- **Design**: Sistema baseado em shadcn/ui
- **Backend**: Supabase

---

## 🙏 Agradecimentos

- [shadcn/ui](https://ui.shadcn.com/) pelos componentes base
- [Lucide](https://lucide.dev/) pelos ícones
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS
- [Supabase](https://supabase.com/) pela plataforma backend
- [Lovable](https://lovable.dev/) pela plataforma de desenvolvimento

---

## 📞 Suporte

- **Documentação**: [docs.findme.com](docs.findme.com)
- **Email**: suporte@findme.com
- **Discord**: [Community Server](discord.gg/findme)

---

<p align="center">
  Feito com ❤️ pela equipe FindMe
</p>

<p align="center">
  <a href="#top">⬆️ Voltar ao topo</a>
</p>
