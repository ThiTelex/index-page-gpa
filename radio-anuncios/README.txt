AUTO ANÚNCIOS EXTRA — v5

Novidade principal:
- A programação agora aceita MÚSICAS e TEMPO OCIOSO na mesma fila.
- Tempo ocioso é um item programável sem áudio, com duração definida em minutos.
- Música concluída = 1 item.
- Tempo ocioso concluído = 1 item.
- O contador de “Itens antes do anúncio” considera os dois tipos.
- Exemplo: 2 músicas + 5 minutos ociosos + bloco de anúncios.
- A tela mostra “TEMPO OCIOSO” e uma contagem regressiva durante a pausa.
- O botão de pular fica contextual: “PULAR MÚSICA” ou “PULAR TEMPO OCIOSO”.
- Itens de programação (músicas e tempos ociosos) continuam salvos no navegador via IndexedDB.
- Mantidos os anúncios MP3, locuções TTS, volume geral, horário dos anúncios, Modo Operação e demais funções da versão anterior.
- Enquanto o sistema estiver acessado após o login, o navegador solicita o Screen Wake Lock para evitar que o Android apague/bloqueie a tela por inatividade; o bloqueio é solicitado novamente quando a página volta a ficar visível ou o navegador o libera temporariamente.
- Fora do horário configurado, a programação não inicia nem continua: músicas, tempos ociosos e anúncios ficam aguardando. A tela informa a contagem regressiva até o próximo horário de início.
- Ao atingir o horário final, a reprodução é interrompida e fica em espera. No próximo horário de início, a programação retorna automaticamente, preservando o item atual quando possível e o contador de itens.

Uso:
1. Selecione as músicas MP3 e/ou adicione tempos ociosos.
2. Monte a programação na ordem desejada.
3. Defina quantos itens devem ser concluídos antes do bloco de anúncios.
4. Defina quantos anúncios entram em cada bloco.
5. Pressione INICIAR.

Acesso:
- Senha da ferramenta: configurada em config.json (padrão 1833).
- PIN do Modo Operação: 1234.

Observação:
- O login por config.json é apenas uma barreira de acesso à interface; a senha fica acessível ao navegador porque o arquivo é enviado junto com a aplicação.


VERSÃO 5 — AJUSTE DE HORÁRIO E VOLUMES
- Fora do horário de funcionamento, toda a programação é interrompida.
- Ao chegar ao próximo horário de início, a programação recomeça do zero.
- Volume das músicas separado do volume dos anúncios MP3.
- Volume das músicas fica dentro do card da programação de músicas.
- Volume dos anúncios MP3 fica dentro do card da fila de anúncios.
- Locuções continuam com volume próprio no card de criação de locução.
- Música de fundo das locuções continua com controle separado.
