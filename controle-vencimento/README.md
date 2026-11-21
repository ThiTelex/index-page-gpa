# Controle de Vencimentos — Sistema V1.4

## Novidades desta versão
- Paginação de 30 registros por página.
- Relatório para impressão que reúne todos os registros do filtro atual, independentemente da página exibida.
- Filtro de prazo de 10, 20 ou 30 dias, além de opção para todos os prazos. Registros vencidos continuam visíveis como prioridade.
- Botão **Desfazer** na lista de tratados, usando a rota PATCH existente para retornar `tratado` a `0`.
- Mantidos login, identidade visual roxa, leitor de código de barras, áudio `barcode-bip.m4a` e integração com o Worker/D1.

## Compatibilidade
- API esperada: `https://vencimentos-api.thitelex1999.workers.dev`
- O Worker deve aceitar `PATCH /api/vencimentos/:id/tratado` com `{ "tratado": 0 }` ou `{ "tratado": 1 }`.
- Não exige alteração no banco D1 nem execução de SQL.
- Paginação e filtro de prazo são aplicados no navegador sobre o resultado completo retornado pela API. A impressão usa todos os registros filtrados, não apenas a página atual.

## Publicação
Envie o conteúdo desta pasta para o repositório do GitHub Pages, substituindo os arquivos da versão anterior. Mantenha `config.json`, `barcode-bip.m4a` e `login-logo-extra-mercado.png` na mesma pasta de `index.html`.

## Arquivos
- `index.html`: estrutura do painel e formulários.
- `style.css`: estilos e responsividade.
- `app.js`: autenticação visual, integração com API, filtros, paginação, impressão, tratativas e leitor.
- `config.json`: configuração da senha visual.
- `barcode-bip.m4a`: áudio do leitor.
- `login-logo-extra-mercado.png`: imagem do login.

## Observação
A senha visual configurada no `config.json` é apenas uma barreira de interface no navegador, não um mecanismo de segurança para proteger a API ou os dados.
