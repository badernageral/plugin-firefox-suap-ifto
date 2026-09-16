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

Para gerar uma nova versão assinada:
1. Atualize `version` em `manifest.json`.
2. Gere suas credenciais de API em https://addons.mozilla.org/pt-BR/developers/addon/api/key/ (uma vez só).
3. Exporte as credenciais no seu terminal (não commitar):
   ```bash
   export WEB_EXT_API_KEY=SEU_JWT_ISSUER
   export WEB_EXT_API_SECRET=SEU_JWT_SECRET
   ```
4. Rode:
   ```bash
   npm run sign
   ```
5. Commit o novo `web-ext-artifacts/suap_ifto.xpi`.
