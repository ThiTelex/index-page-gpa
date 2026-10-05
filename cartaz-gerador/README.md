# A7 Gerador de Cartazes — v23

## Correção desta versão
- A caixa preta da dinâmica foi convertida para um fundo SVG inline, evitando dependência da opção do navegador de imprimir fundos/cores.
- O texto da dinâmica permanece branco sobre a caixa preta.
- A borda externa de cada cartaz A7 continua sendo ocultada na impressão.
- A exportação em PDF foi removida na v26.
- O botão “Imprimir todas as páginas” monta temporariamente todas as folhas A4 (8 cartazes por folha) somente durante a impressão; elas não são adicionadas à pré-visualização.

Senha atual permanece no `config.json`.

## v26
- Baseada diretamente na v24 (grade física 4x2).
- Removido completamente o recurso Exportar PDF e as bibliotecas html2canvas/jsPDF.
- Adicionado Imprimir todas as páginas, usando uma área de impressão temporária que é limpa após a impressão.
- A pré-visualização continua exibindo apenas a página A4 selecionada.


## v28 — Montserrat e correção do COD
- Montserrat é carregada diretamente do Google Fonts e aplicada como fonte principal do sistema, com fallback para Arial.
- O COD de impressão recebeu uma altura de item maior e uma grade interna fixa para separar DESCRIÇÃO, código de barras SVG e PLU.
- O SVG não fica mais sobreposto à descrição.


## v29 — regras da dinâmica 23 e frase promocional
- Dinâmica 23: a descrição da caixa passa a ser `A PARTIR DE` + `Msg1` + ` UN.`.
- Dinâmica 23 não usa mais `Mensagem Etiqueta` para essa descrição.
- A frase `NESTA PROMOÇÃO, A UN. SAI POR` aparece somente nas dinâmicas 19, 23 e 24 quando houver DE/POR.

## v31 — Unidade de medida abaixo do preço
- Result: divisão Perecíveis é analisada pela descrição do PLU.
- ` KG` no final => `kg`.
- `100G` no final => `100g`.
- ` UN` no final => `cada`.
- sem `G` no final => `kg`.
- demais casos => `cada`.
- Fora de Perecíveis => `cada`.
- A unidade fica imediatamente abaixo do preço; em DE/POR aparece abaixo de DE e de POR.


## v32 — Ajuste de espaço DE+POR
- Baseada na v31.
- A condição de Perecíveis usa `Nome Depto.`.
- SVG do código de barras reduzido verticalmente para 18px.
- Texto de validade das ofertas reduzido de 12px para 10px.
- Mantidas as unidades abaixo de cada preço e as demais regras.


## v33 — Correção de unidade e espaço DE+POR
- A identificação de Perecíveis usa exclusivamente `Nome Depto.` do Result.
- Normalização de acentos, espaços e caixa antes das comparações.
- ` KG` no final → kg; `100G` no final → 100g; sem `G` no final → kg; demais → cada.
- SVG do código de barras reduzido para 28px de altura.
- Frase de validade reduzida para 9px.
- Frase "NESTA PROMOÇÃO..." reduzida para 10px nos cartazes DE+POR.

## v34 — Departamento numérico para unidade de medida
- A regra de Perecíveis do Result passa a usar a coluna `Depto.`.
- `Depto. = 2` => aplica a regra de unidade.
- `Depto. = 1` (Mercearia), `3` (Bazar) e demais valores => `cada`.
- Dentro de `Depto. = 2`: final ` KG` => `kg`; final `100G` => `100g`; final sem `G` => `kg`; demais casos => `cada`.


## v35 — Litros + caixa de dinâmica em uppercase
- Em `Depto. = 2`, descrições terminadas em `L` são classificadas como `cada`.
- A regra de `L` é avaliada antes da regra de ausência de `G`, evitando que produtos como `1.5L` recebam `kg`.
- O texto dentro da caixa preta da dinâmica recebe `text-transform: uppercase !important`.


## v36 — Litros/gramas e posicionamento da unidade
- `Depto. = 2`: sufixo `L` ou `GR` no final da descrição resulta em `cada`.
- Mantidas as regras `KG`, `100G` e kg implícito.
- Unidade de medida reposicionada para a direita, abaixo da região dos centavos, em vez de centralizada sob o preço.


## v37 — Unidade DE/POR alinhada aos centavos
- Baseada na v36.
- Unidade do preço DE e do preço POR agora é posicionada em linha própria abaixo do respectivo valor, alinhada à direita do valor/centavos.
- Não altera o posicionamento do preço simples.

## v38 — Correção do preço POR
- Mantém o rótulo `POR:` pequeno.
- O valor numérico do POR volta a usar 42px e peso 950, igual ao preço promocional definido.
- A unidade de medida permanece separada abaixo do valor.


## v39 — Quantidade de cartazes no Tratamento
- Adicionada coluna editável `Qtd. Cartaz` na aba 2 · Tratamento.
- Valor inicial preserva a quantidade já informada pela fonte.
- Botões − / + e campo numérico permitem ajustar a quantidade após processar.
- A quantidade de cartazes é usada somente para geração/paginação A7; não altera a quantidade do produto usada no COD.
- Ao alterar, os cartazes, estatísticas e paginação são recalculados.


## v40 — Refinamento do controle Qtd. Cartaz
- Baseada na v39.
- Controle refinado com `input type="number"`.
- Botões `+` e `−` usam Material Icons.
- Alinhamento e dimensões padronizados.
- Campo aceita digitação direta e mantém mínimo de 1.
- Mantida a lógica de atualização da quantidade de cartazes da v39.


## v41 — refinamento do controle de quantidade
- Botões de diminuir/aumentar da coluna **Qtd. Cartaz** usam Material Symbols Rounded.
- Botões são circulares, com dimensões fixas e alinhamento central vertical/horizontal.
- O campo de quantidade continua sendo `input type="number"`, com foco visual e controle consistente no mobile.


## v42 — nova tela de login
- Tela de acesso redesenhada com identidade visual preta/vermelha, brilho vermelho e card central inspirado na referência fornecida.
- Logo Extra Mercado mantido no acesso.
- Cadeado usa Material Symbols Rounded.
- Campo de senha recebeu cadeado Material Symbols e acabamento vermelho.
- Botão ENTRAR recebeu destaque vermelho e efeito de brilho.
- Mantida a autenticação pelo `config.json`; a senha atual continua sendo `1833` e pode ser alterada futuramente nesse arquivo.
- Demais funcionalidades do v41 foram preservadas.


## v43 — logo completa na tela de login + favicon
- Baseada diretamente na v42.
- A tela de login passa a usar a logo completa do Extra Mercado com o símbolo/chapéu acima.
- A logo da tela de login foi separada da logo do cabeçalho para não alterar a identidade do restante do sistema.
- Ajustado o tamanho responsivo da logo no login, removendo a limitação de altura que a deixava pequena.
- Adicionado `logo.ico` ao projeto, usando o símbolo do Extra Mercado como favicon.
- Adicionado ao HTML: `<link rel="icon" href="logo.ico">`.
- Nenhuma regra de processamento, impressão, tratamento, COD ou autenticação foi alterada.


## v44 — dinâmica 13 e unidade 100g por dinâmica
- Dinâmica 13 (PRÓXIMO AO VENCIMENTO) passa a usar `Preço De` como DE e `Preço Venda` como POR, exibindo corretamente o bloco DE+POR.
- Para produtos do `Depto.` 2 (Perecíveis), a dinâmica 17 passa a definir a unidade como `100g`, mesmo quando a descrição do PLU não termina com `100G`.
- As regras anteriores de unidade continuam válidas para os demais produtos: `L` e `GR` no final resultam em `cada`; ` KG` no final resulta em `kg`; `100G` no final resulta em `100g`; demais descrições de Perecíveis sem `G` final resultam em `kg`; outros departamentos resultam em `cada`.


## v45 — título longo das dinâmicas e preço da dinâmica 17
- Títulos da caixa preta das dinâmicas continuam obrigatoriamente em `uppercase`.
- Quando o título da dinâmica possui mais de 15 caracteres, a caixa preta usa uma tipografia menor (`16px`) e permite quebra controlada de linha para evitar que o texto seja cortado.
- Dinâmica 17 passa a usar `Preço Venda` como seu único preço, exibido como `POR`.
- A dinâmica 17 continua definindo a unidade de medida como `100g` para produtos do `Depto. = 2`.


## v46 — tratamento sem limite de 500 produtos
- Removido o limite que exibia apenas os primeiros 500 registros na aba **2. Tratamento**.
- A tabela de tratamento agora lista todos os produtos que passaram pelo processamento, mantendo pesquisa, filtro por dinâmica e controle individual de quantidade.
- O cartazeamento e a impressão continuam usando a lista completa, sem alteração nas regras de preços, dinâmicas ou unidades de medida.
