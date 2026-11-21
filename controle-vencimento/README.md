# Controle de Vencimentos — Sistema V1.5

## Novidades
- Botão **+ Importar** ao lado de **+ Novo lançamento**.
- Importação CSV delimitado por ponto e vírgula (`;`), com suporte a campos entre aspas e aspas escapadas.
- Prévia editável por exclusão individual antes da gravação.
- Mapeamento por nome do cabeçalho (não depende da ordem das colunas).
- Processamento sequencial com barra de progresso, contagem de sucesso e falhas por linha.
- Paginação de 30 registros, filtro de prazo 10/20/30 dias ou todos, relatório para impressão com todos os registros filtrados e ação Desfazer tratativa.
- Mantidos login, visual roxo, leitor de código de barras e `barcode-bip.m4a`.

## Mapeamento CSV
- `Descrição PLU` → `descricao` (maiúsculo)
- `EAN` → `plu_ean` (texto)
- `Data de Validade` → `validade` (ISO `AAAA-MM-DD`)
- `Quantidade Coletada` → `quantidade` (inteiro; vazio vira zero)
- `Id Tarefa` → `responsavel` como `PRÓ-ATIVO ID {Id Tarefa}`
- `Data Reg.` → `data_lancamento` (preservada no banco)
- `Depto.` → `setor`: exatamente `2` gera `PERECÍVEIS`; qualquer outro valor gera `MERCEARIA`.
- `tratado` sempre inicia em `0`.

## Publicação da API — obrigatório para preservar Data Reg.
O site V1.5 usa o contrato da API V2.2 para aceitar `data_lancamento` no POST. No Cloudflare Workers, substitua o código pelo arquivo `worker-v2.2.js`, mantendo o binding D1 com nome `DB`, e publique (Deploy). A API usa a coluna `data_lancamento` já existente; não exige migração SQL.

## Publicação do site
Envie os arquivos desta pasta para o GitHub Pages. Mantenha `config.json`, `barcode-bip.m4a` e `login-logo-extra-mercado.png` na mesma pasta de `index.html`.

## Formato de datas
O importador reconhece `DD/MM/AAAA`, `DD-MM-AAAA`, `AAAA-MM-DD` e números seriais comuns de datas do Excel. Linhas sem datas válidas ou com campos obrigatórios inválidos são destacadas e bloqueiam a finalização até serem excluídas. A data de lançamento é armazenada no formato ISO aceito pela API.

## Versões
- Sistema: V1.5
- API: V2.2
- D1: estrutura existente, sem alteração SQL.
