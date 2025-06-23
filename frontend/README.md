# 🚀 Sistema Tributário 100% IA - Frontend

## ⚡ Stack
- Next.js 14
- Tailwind CSS
- React 18
- API Backend: [https://backend-sergio-2143-sergio-carneiro-leaos-projects.vercel.app](https://backend-sergio-2143-sergio-carneiro-leaos-projects.vercel.app)

## ▶️ Como rodar local
```bash
cd frontend
npm install
npm run dev
```
Acesse: [http://localhost:3000](http://localhost:3000)

## 🏗️ Estrutura sugerida
```
frontend/
  src/
    app/           # Páginas Next.js
    components/    # Componentes reutilizáveis
    hooks/         # Hooks customizados (ex: useApi)
    context/       # Contextos globais
    styles/        # Estilos globais
```

## 🧩 Componentes sugeridos
- Botão padrão
- Input de arquivo
- Card de documento
- Loader/Spinner
- Toast/Alerta

## 🌐 Integração com Backend
- Configure a URL da API em um arquivo `.env.local` se necessário:
```
NEXT_PUBLIC_API_URL=https://backend-sergio-2143-sergio-carneiro-leaos-projects.vercel.app
```
- Use o hook `useApi` para consumir endpoints

## 🛠️ Scripts úteis
```bash
npm run dev       # Dev server
npm run build     # Build produção
npm run lint      # Lint
npm run start     # Start produção
```

## 🏁 Primeira Sprint Sugerida
- [ ] Dashboard inicial com status da API
- [ ] Upload de arquivos
- [ ] Listagem de documentos
- [ ] Página de status

---
**Dica:** Use o Tailwind para estilizar rapidamente e crie componentes reutilizáveis! 