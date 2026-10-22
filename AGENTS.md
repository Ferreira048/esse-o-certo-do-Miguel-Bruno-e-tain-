<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the imported model catalog and existing used-car listings in one shared listing module with distinct IDs and a single detail route, so every interest link resolves consistently.
- Uploaded catalog photos use project-scoped asset pointers; do not embed the original archive scripts or duplicate the application framework.
- Keep `.devcontainer/` and the dev-server host allowlist in vite.config.ts so the repo still opens as a browser-based VS Code with Node ready; people work on machines where installing software is not allowed.
- `site-pronto/` is a script-free, relative-path prerendered copy rebuilt with `node scripts/montar-site-pronto.mjs` (static mode via `VITE_STATIC_COPY`); rebuild it after site changes, because course laptops can only open plain files, sometimes by double-click.
