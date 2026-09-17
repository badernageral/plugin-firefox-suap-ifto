# Instruções para o Claude Code

## Bump de versão

Sempre que fizer bump de `version` em `manifest.json` e enviar (push) essas mudanças para `main`, crie e envie também a tag `vX.Y.Z` correspondente — é isso que dispara o workflow de assinatura/release no GitHub Actions ([.github/workflows/release.yml](.github/workflows/release.yml)). Um push para `main` sozinho não gera release.

```bash
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin vX.Y.Z
```

Veja detalhes em [README.md](README.md#publicando-uma-nova-versão-assinatura-via-amo).
