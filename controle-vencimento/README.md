# Controle de Vencimentos — Sistema V2.1

## Novidades V2.1
- Indicadores de urgência por registro: vermelho (0–3 dias), laranja (4–10), amarelo (11–20), azul (21–30) e cinza (acima de 30 dias).
- Registros vencidos permanecem armazenados no D1, mas são ocultados da lista operacional, dos indicadores e dos relatórios de tratativas. Uma futura área de consulta de vencidos poderá recuperá-los.
- Botão de leitura por câmera ao lado da busca: lê o EAN e pesquisa automaticamente os registros correspondentes.
- Painel de distribuição substitui o gráfico de pizza por uma barra segmentada entre Tratados e A tratar, com contagens e percentuais calculados sobre os filtros de setor e dias, independentemente do filtro de situação.

## Histórico de funcionalidades preservadas
- Botões do topo reorganizados no mobile: **Modelo XLSX** e **Importar** ficam juntos na primeira linha; **Novo lançamento** ocupa a linha seguinte em largura total e com maior destaque.
- Botão **Modelo XLSX** agora tem bordas arredondadas e acabamento visual consistente com os demais botões.
- Removido o botão **Sair** da barra superior; a sessão permanece ativa na aba até seu fechamento ou limpeza da sessão do navegador.
- Importação de arquivos Excel `.xlsx` além do CSV, com processamento local no navegador pela biblioteca SheetJS.
- Leitura automática da aba `Proativo` (ou de outra aba que contenha os sete cabeçalhos obrigatórios).
- Compatibilidade com a planilha simplificada de 7 colunas e com o CSV original de 32 colunas, desde que contenham os mesmos cabeçalhos necessários.
- Botões **+ Importar** e **+ Novo lançamento** com espaçamento maior, inclusive em telas pequenas; quebra de linha segura quando faltar espaço.
- Logo Extra Mercado adicionada à barra superior, ao lado do título do sistema.
- Busca e botão Imprimir relatório agrupados na primeira linha; filtros de setor, situação e prazo organizados na linha seguinte.
- Ícone de cadeado do login com borda roxa combinando com o contorno do cartão.
- Botão Entrar alinhado ao centro, com dimensões e área de ícone padronizadas.
- Painel renomeado para **Painel de Status**.
- Indicadores **Tratativas**, **Tratados** e **A tratar**, calculados pelo setor e prazo selecionados, sem serem afetados pelo filtro de situação.
- Gráfico de pizza comparando a quantidade e o percentual de registros tratados e a tratar.
- Detalhes visuais discretos nos indicadores: roxo, verde e amarelo, com ícones Material Symbols.
- Filtro de situação aplicado localmente à lista e ao relatório; os indicadores continuam comparando os dois status.
- Botão **+ Importar** ao lado de **+ Novo lançamento**.
- Importação CSV delimitado por ponto e vírgula (`;`), com suporte a campos entre aspas e aspas escapadas, e importação Excel `.xlsx` via SheetJS.
- Prévia editável por exclusão individual antes da gravação.
- Mapeamento por nome do cabeçalho (não depende da ordem das colunas).
- Processamento sequencial com barra de progresso, contagem de sucesso e falhas por linha.
- Paginação de 30 registros, filtro de prazo 10/20/30 dias ou todos, relatório para impressão com todos os registros filtrados e ação Desfazer tratativa.
- Mantidos login, visual roxo, leitor de código de barras e `barcode-bip.m4a`.

## Mapeamento CSV e XLSX
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
Envie os arquivos desta pasta para o GitHub Pages. Mantenha `config.json`, `barcode-bip.m4a` e `login-logo-extra-mercado.png` e `header-logo-extra.png` na mesma pasta de `index.html`.

## Formato de datas
O importador reconhece `DD/MM/AAAA`, `DD-MM-AAAA`, `AAAA-MM-DD` e números seriais comuns de datas do Excel. Linhas sem datas válidas ou com campos obrigatórios inválidos são destacadas e bloqueiam a finalização até serem excluídas. A data de lançamento é armazenada no formato ISO aceito pela API.

## Versões
- Sistema: V2.3
- API: V2.2
- D1: estrutura existente, sem alteração SQL.

- Botão **Baixar modelo** com ícone de download; usa o caminho relativo `Modelo_Proativo_Importacao.xlsx` na mesma pasta publicada do `index.html`, para baixar o modelo XLSX hospedado no GitHub Pages.


## Versão 2.1
- Sistema web: V2.1
- API: V2.2 (sem alteração)
- Banco D1: sem alteração SQL.


## Versão 2.2
- Botões Baixar modelo e Importar com mesmo fundo, borda e arredondamento.
- Rótulo único do download: Baixar modelo, em desktop e mobile.
- Busca e scanner agrupados na primeira linha.
- Filtros de setor, situação e prazo agrupados com Imprimir relatório na segunda linha; no mobile, impressão ao lado do filtro de dias.
- API V2.2 e D1 sem alterações.


## Versão 2.3
- Botão **Expirados** com ícone `history` no lado direito da barra superior; no mobile, exibe somente o ícone.
- Modal dedicado a produtos com validade anterior à data atual de Brasília.
- Ordenação do vencimento mais recente ao mais antigo.
- Paginação de 30 registros por página.
- Busca por descrição/PLU/EAN, leitura por câmera, filtros de setor, tratativa e tempo desde o vencimento.
- Relatório para impressão considera todos os registros filtrados, não apenas a página visível.
- API V2.2 e D1 sem alterações; não requer SQL nem novo deploy do Worker.

- Sistema web atual: V2.3


## V2.4 — atualização obrigatória na virada do dia e área Expirados simplificada
- A área Produtos expirados passa a utilizar uma cópia em memória dos registros vencidos carregada na abertura inicial do sistema, incluindo todos os setores.
- Abrir ou reabrir o modal Expirados, pesquisar e escanear não executam novas consultas ao D1.
- A lista Expirados mantém pesquisa, scanner, impressão e paginação; foram removidos os filtros de setor, situação e período.
- O scanner permanece ao lado do campo de pesquisa em telas pequenas.
- Ao detectar a mudança da data em `America/Sao_Paulo`, o sistema apresenta um modal obrigatório, sem opção de fechar ou continuar. A única ação é atualizar a página.
- A mudança de data é verificada por temporizador e também quando a aba volta a ficar visível ou recebe foco, cobrindo a suspensão do navegador em celulares.
- A primeira abertura realiza uma consulta adicional sem filtros para preencher o cache completo de expirados, pois a tela principal inicia filtrada por setor. Essa consulta acontece na abertura do sistema, não a cada acesso ao modal.
