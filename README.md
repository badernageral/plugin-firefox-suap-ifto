# Plugin para firefox - SUAP IFTO
Facilita o lançamento de presenças e notas no sistema SUAP do IFTO

Requisitos
--
Para utilizar o plugin você vai precisar do navegador Mozilla Firefox (qualquer versão recente, não precisa ser a Developer Edition).

Instalação
--
1. Baixe a extensão [clicando aqui](https://github.com/badernageral/plugin-firefox-suap-ifto/raw/main/web-ext-artifacts/suap_ifto.xpi).
2. O Firefox vai abrir um aviso perguntando se você confia no complemento "SUAP IFTO". Clique em **Adicionar**.
3. Pronto — o ícone do plugin aparece automaticamente quando você acessa uma página do SUAP (`*.ifto.edu.br`).

Tutorial
--
[![Tutorial](https://img.youtube.com/vi/ALQC1PhgVnI/0.jpg)](https://www.youtube.com/watch?v=ALQC1PhgVnI)

Publicando uma nova versão (assinatura via AMO)
--
O `.xpi` distribuído aqui é assinado pela Mozilla (self-distribution / canal "unlisted" no [addons.mozilla.org](https://addons.mozilla.org)), então instala direto em qualquer Firefox, sem precisar da versão Developer.

A assinatura e a publicação da release são automáticas via GitHub Actions ([.github/workflows/release.yml](.github/workflows/release.yml)), disparadas por push de tag `v*.*.*`. **Sempre que fizer bump de versão, siga os passos abaixo — o bump sozinho não gera release:**

1. Atualize `version` em `manifest.json`.
2. Commit e push para `main`.
3. Crie e envie uma tag anotada com o mesmo número de versão, prefixada com `v`:
   ```bash
   git tag -a vX.Y.Z -m "vX.Y.Z"
   git push origin vX.Y.Z
   ```
4. O workflow assina o `.xpi` via AMO e cria a release no GitHub automaticamente — acompanhe em Actions.

As credenciais de assinatura (`WEB_EXT_API_KEY`/`WEB_EXT_API_SECRET`, geradas em https://addons.mozilla.org/pt-BR/developers/addon/api/key/) já estão configuradas como secrets do repositório; não é necessário exportá-las localmente nem rodar `npm run sign` manualmente.
