## v54 — primeira versão de teste da função PBi
- Adicionada a primeira tratativa funcional da fonte **PBi**, usando a estrutura do `data.xlsx` como referência.
- `NOM_PROD` → descrição; `Preço De (R$)` → DE; `Preço Promo (R$)` → POR quando preenchido; `DAT_INICIO_OFERTA`/`DAT_FIM_OFERTA` → validade; `COD_PLU` → PLU e código de barras.
- Caixa preta construída a partir de `TIPO_CLIENTE` + `DINÂMICA`, com **EXCLUSIVO CLUBE EXTRA** para `Fidelidade (Clube Extra / PA+)`.
- Dinâmicas **A PARTIR DE X PAGUE Y**, **LEVE X PAGUE Y** e **X% DE DESCONTO** são reconhecidas.
- Em **A PARTIR DE X PAGUE Y**, a caixa exibe `A PARTIR DE X UN.` e o POR é extraído do valor Y da própria dinâmica quando `Preço Promo (R$)` estiver vazio.
- Em **LEVE X PAGUE Y**, o POR é calculado como `Preço De × Y ÷ X`.
- Em **X% DE DESCONTO**, o POR usa `Preço Promo (R$)`.
- Para as três dinâmicas especiais é exibido `NESTA PROMOÇÃO, A UN. SAI POR`.
- Para outras dinâmicas, a caixa usa `OFERTA`, conforme a regra definida para o primeiro teste.
- Esta versão é uma base de teste da PBi; as regras do Result permanecem preservadas.

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

## v48 — modo Pack nos Cartazes
- Adicionado o modo **Pack** na aba 3 · Cartazes, usando o campo **Unidades do pack** para dividir o preço.
- Pack normal usa **Preço Venda** como preço original e como base do cálculo por unidade.
- O cartaz Pack não imprime os rótulos **DE** e **POR** e não aplica risco/corte sobre o preço original.
- A organização visual do Pack passa a ser: descrição → preço original → caixa preta **NESTA EMBALAGEM, A UND. SAI POR** → preço resultante da divisão.
- Na dinâmica **20 · FIDELIDADE CLUBE EXTRA**, o Pack usa **Preço Fide/Promo** como preço original e base da divisão e exibe **EXCLUSIVO CLUBE EXTRA** abaixo da descrição.
- No Pack, a mensagem **Oferta válida de X a Y ou enquanto durar nossos estoques** só é exibida quando **Data Inicio Fide/Promo** estiver preenchida; a data final é usada como Y.
- Mantidas as demais regras de processamento, tratamento, quantidades de cartazes, impressão e COD.



## v49 — modo Parcelamento nos Cartazes
- Adicionado o modo **Parcelamento** na aba 3 · Cartazes, usando o campo **Parcelas** para definir a quantidade de parcelas.
- Parcelamento normal usa **Preço Venda** como preço principal e como base do cálculo da parcela.
- O cartaz Parcelamento não imprime os rótulos **DE** e **POR** e não aplica risco/corte sobre o preço original.
- A organização visual do Parcelamento passa a ser: descrição → preço original → caixa preta **EM Yx SEM JUROS NOS CARTÕES DE CRÉDITO** → valor da parcela.
- A quantidade Y da caixa preta acompanha o campo **Parcelas** e o texto pode quebrar linha dentro da caixa.
- Na dinâmica **20 · FIDELIDADE CLUBE EXTRA**, o Parcelamento usa **Preço Fide/Promo** como preço original e base da divisão e exibe **EXCLUSIVO CLUBE EXTRA** abaixo da descrição.
- No Parcelamento, a mensagem **Oferta válida de X a Y ou enquanto durar nossos estoques** só é exibida quando **Data Inicio Fide/Promo** estiver preenchida; a data final é usada como Y.
- Corrigido o limite de 500 registros na tabela da aba 2 · Tratamento, mantendo a lista completa de produtos.
- Mantidas as demais regras de processamento, quantidades de cartazes, impressão e COD.

## v50 — destaque visual no parcelamento
- Ajustada a caixa preta do modo **Parcelamento** para separar a mensagem em duas linhas:
  - **EM Yx SEM JUROS**
  - **NOS CARTÕES DE CRÉDITO**
- **EM Yx SEM JUROS** recebe fonte ligeiramente maior para criar hierarquia visual e destacar a condição do parcelamento.
- As duas linhas são elementos SVG/HTML independentes dentro da mesma caixa preta, com centralização controlada, evitando quebra automática em ponto inadequado.
- Mantidas todas as regras de preços, dinâmica 20, validade, Pack, Percentual, tratamento sem limite de 500 produtos e demais modos.
\n## v51 — caixa de parcelamento mais expressiva
- Aumentada a tipografia da caixa preta do modo **Parcelamento** para aproveitar melhor a largura disponível da arte.
- **EM Yx SEM JUROS** passa a usar fonte **20px**, mantendo o destaque visual da primeira linha.
- **NOS CARTÕES DE CRÉDITO** passa a usar fonte **16px**, também maior que na v50 e menor que a primeira linha.
- A caixa preta foi ampliada verticalmente para acomodar as duas linhas com melhor presença visual.
- Considerado o limite de até **2 dígitos** para a quantidade de parcelas (ex.: 10x e 12x), mantendo as duas linhas em uma única linha cada.
- A regra visual também foi preservada na impressão, sem reduzir as duas linhas para uma fonte única menor.
- Mantidas todas as regras de preços, dinâmica 20, validade, Pack, Percentual, tratamento sem limite de 500 produtos e demais modos.

## v52 — ajuste equilibrado do destaque do parcelamento
- Reduzido o aumento excessivo aplicado na v51 à caixa preta do modo Parcelamento.
- Mantidas as duas linhas com hierarquia visual: `EM Yx SEM JUROS` maior e `NOS CARTÕES DE CRÉDITO` menor.
- Ajustadas as fontes para 18px e 14px, respectivamente, mantendo destaque sem ocupar largura excessiva.
- Reduzida levemente a largura da caixa e sua altura para melhorar a proporção dentro do SVG.
- Considerado o limite de até 2 dígitos para parcelas (ex.: 10x e 12x), evitando estouro lateral.
- Mantidas todas as regras de preços, dinâmica 20, validade, Pack, Percentual e demais modos.

## v53 — numeração do tratamento e opção de não imprimir
- Adicionada uma coluna de numeração na aba **2 · Tratamento**, iniciando em **1** e seguindo a ordem dos produtos analisados a partir do arquivo Excel.
- A numeração identifica o produto na lista analisada e permanece vinculada à posição original mesmo quando a tabela é pesquisada ou filtrada.
- O seletor **Qtd. Cartaz** agora aceita **0**.
- Quando um produto recebe quantidade **0**, ele permanece listado no Tratamento, mas é excluído da pré-visualização, do total de cartazes e da impressão.
- O botão de diminuir pode levar a quantidade até 0; o botão de aumentar permite voltar de 0 para 1 ou mais.
- Mantidas todas as regras de preços, dinâmicas, Pack, Percentual, Parcelamento, validade, SVG e demais funcionalidades existentes.

## v55 — correção do processamento PBi e tratamento da estrutura Power BI
- Corrigido o processamento da fonte **PBi** para usar as colunas reais do export do Power BI (`COD_PLU`, `NOM_PROD`, `Preço De (R$)`, `Preço Promo (R$)`, `DINÂMICA`, `TIPO_CLIENTE`, `DAT_INICIO_OFERTA` e `DAT_FIM_OFERTA`), em vez dos nomes usados na estrutura Result.
- A aba **2 · Tratamento** agora mostra PLU, descrição, dinâmica e preços reais do PBi.
- O filtro de dinâmica do PBi passa a usar o texto original da coluna `DINÂMICA`.
- Implementada a interpretação das três famílias especiais:
  - `A PARTIR DE X PAGUE Y` → `A PARTIR DE X UN.` e preço Y;
  - `LEVE X PAGUE Y` → cálculo `Preço De × Y ÷ X`;
  - `X% DE DESCONTO` → usa `Preço Promo (R$)`.
- `LISTA DE PRODUTOS` e `VALOR FIXO` ficam como oferta normal, sem criar uma segunda linha de dinâmica.
- `TIPO_CLIENTE = Fidelidade (Clube Extra / PA+)` passa a gerar `EXCLUSIVO CLUBE EXTRA` e, nas três famílias especiais, uma segunda linha com a dinâmica.
- Para as demais situações, a caixa preta usa `OFERTA` ou a própria dinâmica conforme a regra PBi definida.
- Implementada a validade usando `DAT_INICIO_OFERTA` e `DAT_FIM_OFERTA`.
- Mantida a função Result e todas as funcionalidades anteriores de quantidade, Pack, Parcelamento, Percentual, impressão e COD.

## v56 — correções de PLU, datas e dinâmica exibida no tratamento PBi
- Corrigido o carregamento do XLSX do PBi para não interpretar valores numéricos de `COD_PLU` como datas do Excel.
- `COD_PLU` passa a ser preservado como número/código, evitando resultados como `Wed Dec 14 3138...` no PLU e no código de barras.
- Datas `DAT_INICIO_OFERTA` e `DAT_FIM_OFERTA` em formato serial do Excel passam a ser convertidas para `DD/MM/AAAA` no cartaz.
- Na aba **2 · Tratamento**, a coluna **Dinâmica** do PBi passa a mostrar exatamente o conteúdo original da coluna `DINÂMICA`, em vez de substituir códigos derivados por textos da estrutura Result, como `OFERTA 2 UNID`.
- Assim, um produto cuja `DINÂMICA` é `20% DE DESCONTO` aparece como `20% DE DESCONTO` no Tratamento e continua usando essa mesma dinâmica na caixa preta do cartaz.
- Mantidas as regras já implementadas para `A PARTIR DE X PAGUE Y`, `LEVE X PAGUE Y`, `X% DE DESCONTO`, Clube Extra, validade, quantidades e função Result.


## v57 — melhorias PBi e EAN no Result
- PBi: o preço **DE** passa a usar o mesmo porte visual do DE do Result.
- PBi: os modos **Percentual**, **Pack** e **Parcelamento** ficam desabilitados quando a fonte é PBi; somente **Padrão** permanece ativo.
- PBi: linhas com `ESTOQUE = 0` são descartadas após o processamento e não geram tratamento, cartaz ou impressão.
- Result: antes da linha **PLU** e do código de barras, o cartaz passa a exibir **EAN**, usando a coluna `EAN` do CSV, com o mesmo tamanho e cor visual do PLU.
- Demais regras de Result e PBi preservadas.

## v58 — entrada por texto para ZEBRINHA
- Adicionada entrada por caixa de texto para colar diretamente a tabela do e-mail da ZEBRINHA, separada por tabulações.
- O cabeçalho é validado por nome de coluna antes do processamento.
- O Tratamento usa `PLU virtual`, `Descrição`, `Quantidade`, `Preço Original` e `Novo Preço Arredondado`.
- Quantidade de cartazes começa com o valor de `Quantidade` e continua editável, inclusive para zero.
- Cartaz padrão com dinâmica `PRÓXIMO AO VENCIMENTO`, validade desde a data local atual até `Validade da Oferta` e código de barras baseado no PLU virtual.
- Percentual, Pack e Parcelamento desativados para ZEBRINHA; Result e PBi preservados.


## v59 — correção de preços e entrada condicional da ZEBRINHA
- Corrigida a interpretação dos valores monetários com `R$`, vírgula decimal e espaços, para que Preço Original e Novo Preço Arredondado sejam processados corretamente.
- A área de envio de arquivo aparece somente para Result e PBi.
- A caixa de texto da ZEBRINHA aparece somente quando essa fonte está selecionada, inclusive no carregamento inicial da aplicação.
- O botão de demonstração fica oculto na ZEBRINHA.


## v60 — atalhos para sistemas de origem
- Removido o botão “Carregar demonstração” da tela de entrada.
- Atualizados os subtítulos de RESULT, PBi e ZEBRINHA conforme solicitado.
- Adicionado o atalho “Acessar GPR Cockpit” quando RESULT estiver selecionado.
- Adicionado o atalho “Acessar Power Bi Ofertas” quando PBi estiver selecionado.
- Adicionado o atalho “Acessar Outlook” quando ZEBRINHA estiver selecionada.
- Os atalhos abrem em nova aba; o campo de arquivo ou a caixa de texto continua aparecendo conforme a fonte selecionada.
