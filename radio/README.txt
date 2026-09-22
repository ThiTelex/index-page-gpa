AUTO ANÚNCIOS EXTRA — v2.0.19

Variação experimental que combina anúncios MP3 com locuções geradas pela voz disponível no navegador.

Alterações da v2.0.18:
- Horários de início e fim agora usam uma apresentação visual personalizada, integrada ao tema escuro do projeto, mantendo o seletor de horário nativo do Android/navegador por baixo.
- O botão de seleção de arquivos MP3 foi personalizado para seguir o mesmo padrão visual dos demais controles, mantendo a seleção múltipla de arquivos nativa.
- Os indicadores da fila agora usam bolinhas com cor real: verde para EM REPRODUÇÃO e amarelo para ÚLTIMO TOCADO.
- A legenda da fila também utiliza os mesmos indicadores coloridos.
- Mantido o uso dos Google Material Symbols Rounded nos ícones.
- Mantidas as funcionalidades existentes do Modo Operação, teste individual dos itens da fila, programação de horário, volume, locuções e música de fundo.

Recursos:
- Fila com arquivos MP3 e locuções.
- Texto falado usando SpeechSynthesis do navegador/Android.
- Voz + música de fundo.
- Velocidade e tom da voz configuráveis.
- Volume da voz e da música configuráveis.
- Intervalo entre anúncios.
- Ordem aleatória ou sequencial.
- Horário de funcionamento.
- Contagem regressiva fora do horário ativo.
- Timeline para reprodução.
- Botão ▶ para testar individualmente cada item da fila.
- Modo Operação otimizado para evitar toques acidentais.
- Configurações salvas no navegador.

PIN do Modo Operação:
- O acesso ao Modo Operação não exige PIN.
- As funções internas entram bloqueadas.
- O PIN fixo 1234 é usado somente para desbloquear as funções.
- Depois de desbloqueadas, as funções podem ser utilizadas sem novo PIN.
- Bloquear novamente não exige PIN.
- SAIR DO MODO fica disponível somente quando as funções estiverem desbloqueadas e não pede PIN novamente.

Observação: a duração da locução é estimada para a timeline, pois o SpeechSynthesis do navegador não informa antecipadamente a duração exata da fala.


Alterações da v2.0.19:
- Corrigida a reprodução do teste de locução: a fala agora é iniciada diretamente pelo clique, sem aguardar a música de fundo.
- Música de fundo e fala são iniciadas em paralelo no modo de reprodução.
- Adicionado mecanismo de manutenção da speechSynthesis no Android/Chrome para evitar interrupções durante locuções longas.
