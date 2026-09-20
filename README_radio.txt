AUTO ANÚNCIOS EXTRA — v2.0.15

Variação experimental que combina anúncios MP3 com locuções geradas pela voz disponível no navegador.

Alterações da v2.0.15:
- Entrar no Modo Operação não pede PIN.
- Ao entrar, as funções internas começam bloqueadas.
- Um único botão alterna entre DESBLOQUEAR e BLOQUEAR FUNÇÕES.
- Para desbloquear, é solicitado o PIN fixo 1234.
- Para bloquear novamente, não é solicitado PIN.
- As funções internas não pedem PIN individualmente enquanto estiverem desbloqueadas.
- Para sair do Modo Operação, o PIN 1234 é sempre solicitado, esteja o modo bloqueado ou desbloqueado.
- Indicador verde = funções desbloqueadas; indicador vermelho = funções bloqueadas.

Recursos:
- Fila com arquivos MP3 e locuções.
- Texto falado usando SpeechSynthesis do navegador/Android.
- Voz + música de fundo.
- Velocidade e tom da voz configuráveis.
- Volume da voz e da música configuráveis.
- Intervalo entre anúncios.
- Ordem aleatória ou sequencial.
- Horário de funcionamento.
- Timeline para reprodução.
- Modo Operação otimizado para evitar toques acidentais.

Observação: a duração da locução é estimada para a timeline, pois o SpeechSynthesis do navegador não informa antecipadamente a duração exata da fala.


v2.0.15: Modo Operação: sair sem PIN; bloqueio/desbloqueio centralizado das funções.


v2.0.15: Ajuste do Modo Operação — botão de bloqueio sozinho e SAIR DO MODO ao lado de PULAR TEMPO OCIOSO, sem PIN.


v2.0.15: SAIR DO MODO fica bloqueado enquanto as funções estiverem bloqueadas; após desbloquear com PIN, sai sem pedir PIN novamente.


v2.0.15: Corrigido o clique do botão Modo Operação e a transição entre tela principal e modo operação.


v2.0.15: Corrigido erro JavaScript que impedia o Modo Operação de funcionar; corrigidos também os botões de ações do modo.


v2.0.15: Interface centralizada horizontalmente na tela, mantendo o layout compacto para celular.


v2.0.15: Modo Operação centralizado horizontal e verticalmente no centro da tela.


v2.0.15: Corrigido o Modo Operação para espelhar a reprodução/tempo real e restaurado o botão SAIR DO MODO após desbloqueio.


v2.0.15: No Modo Operação, PULAR ANÚNCIO só fica disponível durante anúncio, PULAR TEMPO OCIOSO só durante espera; SAIR DO MODO exige apenas desbloqueio. Indicador de funções desbloqueadas corrigido para verde.


v2.0.15: Cada item da fila agora tem um botão ▶ para testar o áudio antes do X de excluir. Funciona para MP3 e locuções.


v2.0.15: Durante o período fora do horário, o cronômetro de tempo ocioso é interrompido. O sistema mostra a contagem regressiva até o próximo início do horário ativo, sem acumular tempo para o próximo anúncio. A timeline fica desativada fora do horário.


v2.0.15: Correção da música de fundo das locuções. O fundo agora reinicia automaticamente quando o arquivo termina, permanecendo tocando até a locução ser concluída, inclusive em navegadores Android com falhas no loop nativo.

v2.0.15: Corrige a reprodução da música de fundo das locuções usando Web Audio API com loop contínuo, evitando que o áudio de fundo seja interrompido pelo SpeechSynthesis no Android/Chrome. A música acompanha toda a locução e para somente quando a locução termina.
