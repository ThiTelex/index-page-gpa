# Controle de Vencimentos — leitor EAN

Esta versão integra ZXing Browser para leitura de códigos de barras EAN-13 pela câmera do dispositivo. O repositório enviado é a biblioteca ZXing JS, não um aplicativo pronto; ela fornece o mecanismo de leitura que foi integrado ao formulário.

## Arquivos
- `index.html`: login, painel, cadastro e janela de leitura.
- `style.css`: tema roxo, raios luminosos, cadeado e correção `#loginScreen[hidden]`.
- `app.js`: integração com a API e leitor de câmera.
- `config.json`: senha visual de demonstração `1833`.
- `login-logo-extra-mercado.png`: logo extraída do projeto de referência anterior.

## Publicar
Substitua os arquivos do site no repositório GitHub Pages por estes arquivos e publique. A câmera exige HTTPS (GitHub Pages fornece HTTPS). Permita o acesso à câmera quando solicitado. O carregamento da biblioteca ZXing usa CDN e exige conexão com a internet.

## API
Usa o Worker `https://vencimentos-api.thitelex1999.workers.dev` e os endpoints GET/POST/PATCH já definidos no projeto.

## Limitação de segurança
O login é apenas visual; `config.json` fica público. A API deve receber autenticação real no servidor antes de uso comercial.
