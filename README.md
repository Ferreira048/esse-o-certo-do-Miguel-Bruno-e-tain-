# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Rodar no VS Code do navegador (sem instalar nada)

Funciona em qualquer notebook, mesmo sem permissão para instalar programas: o VS Code
roda no navegador e o Node.js já vem pronto no ambiente.

1. Conecte o projeto ao GitHub (no Lovable: nome do projeto → Settings → Git → Connect).
2. No repositório no GitHub, abra a aba **Code → Codespaces → + New codespace**.
3. Aguarde a preparação. O `.devcontainer/` deste repositório instala as dependências e
   inicia o site sozinho; a pré-visualização abre em uma nova aba quando o servidor sobe.
4. Para reiniciar manualmente, use o terminal dentro do navegador: `npm run dev`.
   (Endereço local: `http://localhost:5173`.)
5. Salve o trabalho normalmente (Ctrl+S) e faça commit/push pela aba Source Control —
   o Lovable sincroniza os commits do branch conectado.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
